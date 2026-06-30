import { Worker, Job } from 'bullmq';
import { redis } from '../config/redis';
import { prisma } from '../config/database';
import { JavascriptExecutor } from '../executor/JavascriptExecutor';
import { SqlExecutor } from '../executor/SqlExecutor';
import { MongodbExecutor } from '../executor/MongodbExecutor';
import { ReactExecutor } from '../executor/ReactExecutor';
import { logger } from '../config/logger';
import {
  getAcceptedSubmissionStreakUpdate,
  getCurrentStreakState,
} from '@interviewprep/shared-utils';

import { IExecutor } from '../executor/IExecutor';

// Instantiate the executors
const jsExecutor = new JavascriptExecutor();
const sqlExecutor = new SqlExecutor();
const mongodbExecutor = new MongodbExecutor();
const reactExecutor = new ReactExecutor();

function getExecutorForCategory(category: string): IExecutor {
  switch (category) {
    case 'JAVASCRIPT':
    case 'NODEJS':
      return jsExecutor;
    case 'REACT':
      return reactExecutor;
    case 'SQL':
      return sqlExecutor;
    case 'MONGODB':
      return mongodbExecutor;
    default:
      throw new Error(`Unsupported category for execution: ${category}`);
  }
}

// ============================================================
// SubmissionWorker — BullMQ Job Worker
// Pulls submission tasks from the 'submission-queue' and
// processes them within sandboxed Docker containers.
// ============================================================

export const submissionWorker = new Worker(
  'submission-queue',
  async (job: Job) => {
    const { submissionId, userId, problemId, code, files, language: _language } = job.data;
    logger.info({ submissionId, problemId, userId }, 'Processing submission job');

    const isPlayground = submissionId.startsWith('run-');

    try {
      // 1. Fetch problem details and test cases from database
      const [problem, testCases] = await prisma.$transaction([
        prisma.problem.findUnique({
          where: { id: problemId },
          select: { category: true },
        }),
        prisma.testCase.findMany({
          where: { problemId },
          orderBy: { order: 'asc' },
        }),
      ]);

      if (!problem) {
        throw new Error(`Problem not found for ID: ${problemId}`);
      }

      if (testCases.length === 0) {
        throw new Error(`No test cases found for problem ID: ${problemId}`);
      }

      // 2. If it's a real submission, update database status to PROCESSING
      if (!isPlayground) {
        await prisma.submission.update({
          where: { id: submissionId },
          data: { status: 'PROCESSING' },
        });

        // Publish status update to Redis pub/sub
        await redis.publish(
          'submission:updates',
          JSON.stringify({
            userId,
            submissionId,
            status: 'PROCESSING',
          }),
        );
      }

      // 3. Execute user code against all test cases
      const formattedTestCases = testCases.map((tc: any) => ({
        id: tc.id,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
      }));

      const executor = getExecutorForCategory(problem.category);
      const execResult = await executor.execute(
        submissionId,
        code,
        formattedTestCases,
        undefined,
        files,
      );

      // 4. Map executor outputs to final submission statuses
      let finalStatus = 'ACCEPTED';
      if (execResult.error) {
        if (execResult.error.includes('Time Limit Exceeded')) {
          finalStatus = 'TIME_LIMIT_EXCEEDED';
        } else if (
          execResult.error.includes('SyntaxError') ||
          execResult.error.includes('ReferenceError') ||
          execResult.error.includes('TypeError')
        ) {
          finalStatus = 'COMPILATION_ERROR';
        } else {
          finalStatus = 'RUNTIME_ERROR';
        }
      } else if (!execResult.passed) {
        finalStatus = 'WRONG_ANSWER';
      }

      // 5. Persist the results based on execution type
      if (isPlayground) {
        const playgroundResult = {
          runId: submissionId,
          status: 'Finished',
          passed: execResult.passed,
          passedCases: execResult.passedCases,
          totalCases: execResult.totalCases,
          error: execResult.error,
          results: execResult.results,
        };

        // Cache results in Redis for 5 minutes (300 seconds)
        await redis.setex(`run:result:${submissionId}`, 300, JSON.stringify(playgroundResult));

        // Publish playground finish event to pub/sub
        await redis.publish(
          'submission:updates',
          JSON.stringify({
            userId,
            submissionId,
            status: 'Finished',
            error: execResult.error,
            data: playgroundResult,
          }),
        );
      } else {
        // Save database records via a single atomic transaction
        await prisma.$transaction([
          prisma.submission.update({
            where: { id: submissionId },
            data: { status: finalStatus as any },
          }),
          prisma.submissionResult.create({
            data: {
              submissionId,
              runtime: execResult.runtime ?? 0,
              memory: execResult.memory ?? 0,
              passedCases: execResult.passedCases,
              totalCases: execResult.totalCases,
              error: execResult.error,
              output: execResult.results
                .map((r) => (r.actual ? JSON.stringify(r.actual) : ''))
                .join('\n'),
            },
          }),
        ]);

        // Increment solvedCount if successfully solved
        if (finalStatus === 'ACCEPTED') {
          await prisma.problem.update({
            where: { id: problemId },
            data: { solvedCount: { increment: 1 } },
          });
        }

        // Calculate and update user streak
        let newStreak = 0;
        let streakMilestone: number | null = null;

        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { streak: true, lastActiveAt: true },
        });

        if (user) {
          const now = new Date();
          newStreak = getCurrentStreakState(user.streak, user.lastActiveAt, now);

          if (newStreak !== user.streak) {
            await prisma.user.update({
              where: { id: userId },
              data: { streak: newStreak },
            });
          }

          if (finalStatus === 'ACCEPTED') {
            const streakUpdate = getAcceptedSubmissionStreakUpdate(
              newStreak,
              user.lastActiveAt,
              now,
            );
            newStreak = streakUpdate.streak;
            streakMilestone = streakUpdate.milestone;

            await prisma.user.update({
              where: { id: userId },
              data: {
                streak: newStreak,
                lastActiveAt: now,
              },
            });
          }
        }

        // Publish final results to Redis pub/sub
        await redis.publish(
          'submission:updates',
          JSON.stringify({
            userId,
            submissionId,
            status: finalStatus,
            error: execResult.error,
            userStreak: newStreak,
            streakMilestone,
            data: {
              runtime: execResult.runtime,
              memory: execResult.memory,
              passedCases: execResult.passedCases,
              totalCases: execResult.totalCases,
            },
          }),
        );
      }

      logger.info({ submissionId, finalStatus }, 'Submission job successfully processed');
    } catch (err: any) {
      logger.error({ err, submissionId }, 'Error processing submission job');

      // Fallback: update status to RUNTIME_ERROR if failure occurs during processing
      const errorMsg = err.message || String(err);

      if (!isPlayground) {
        await prisma.submission
          .update({
            where: { id: submissionId },
            data: { status: 'RUNTIME_ERROR' },
          })
          .catch(() => {});

        await prisma.submissionResult
          .create({
            data: {
              submissionId,
              passedCases: 0,
              totalCases: 0,
              error: errorMsg,
            },
          })
          .catch(() => {});

        await redis
          .publish(
            'submission:updates',
            JSON.stringify({
              userId,
              submissionId,
              status: 'RUNTIME_ERROR',
              error: errorMsg,
            }),
          )
          .catch(() => {});
      } else {
        await redis
          .setex(
            `run:result:${submissionId}`,
            300,
            JSON.stringify({
              runId: submissionId,
              status: 'RUNTIME_ERROR',
              error: errorMsg,
            }),
          )
          .catch(() => {});

        await redis
          .publish(
            'submission:updates',
            JSON.stringify({
              userId,
              submissionId,
              status: 'RUNTIME_ERROR',
              error: errorMsg,
            }),
          )
          .catch(() => {});
      }
    }
  },
  {
    connection: redis as any,
    concurrency: 2, // Process up to 2 submission jobs in parallel
  },
);

// Worker Event Listeners
submissionWorker.on('ready', () => {
  logger.info('🚀 Submission worker successfully started and listening for jobs');
});

submissionWorker.on('failed', (job, err) => {
  logger.error({ jobId: job?.id, err }, 'Job execution failed in BullMQ');
});
