import { prisma } from '../../../config/database';
import type { ISubmissionRepository } from '../../../domain/ports/repositories/ISubmissionRepository';
import type { Submission, SubmissionResult } from '@interviewprep/shared-types';
import { SubmissionStatus } from '@interviewprep/shared-types';

export class PrismaSubmissionRepository implements ISubmissionRepository {
  private mapPrismaSubmission(prismaSubmission: any): Submission {
    return {
      id: prismaSubmission.id,
      userId: prismaSubmission.userId,
      problemId: prismaSubmission.problemId,
      code: prismaSubmission.code,
      language: prismaSubmission.language,
      status: prismaSubmission.status as SubmissionStatus,
      createdAt: prismaSubmission.createdAt,
    };
  }

  private mapPrismaSubmissionResult(prismaResult: any): SubmissionResult {
    return {
      id: prismaResult.id,
      submissionId: prismaResult.submissionId,
      runtime: prismaResult.runtime,
      memory: prismaResult.memory,
      passedCases: prismaResult.passedCases,
      totalCases: prismaResult.totalCases,
      error: prismaResult.error,
      output: prismaResult.output,
      createdAt: prismaResult.createdAt,
    };
  }

  async create(data: {
    userId: string;
    problemId: string;
    code: string;
    language: string;
    status: string;
  }): Promise<Submission> {
    const prismaSubmission = await prisma.submission.create({
      data: {
        userId: data.userId,
        problemId: data.problemId,
        code: data.code,
        language: data.language,
        status: data.status as any,
      },
    });

    return this.mapPrismaSubmission(prismaSubmission);
  }

  async findById(id: string): Promise<(Submission & { result?: SubmissionResult | null }) | null> {
    const prismaSubmission = await prisma.submission.findUnique({
      where: { id },
      include: { result: true },
    });

    if (!prismaSubmission) return null;

    return {
      ...this.mapPrismaSubmission(prismaSubmission),
      result: prismaSubmission.result
        ? this.mapPrismaSubmissionResult(prismaSubmission.result)
        : null,
    };
  }

  async findByUser(
    userId: string,
    options?: { page?: number; limit?: number },
  ): Promise<{ data: Submission[]; total: number }> {
    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const skip = (page - 1) * limit;

    const [submissions, total] = await Promise.all([
      prisma.submission.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.submission.count({
        where: { userId },
      }),
    ]);

    return {
      data: submissions.map((s: any) => this.mapPrismaSubmission(s)),
      total,
    };
  }

  async findByUserAndProblem(userId: string, problemId: string): Promise<Submission[]> {
    const submissions = await prisma.submission.findMany({
      where: { userId, problemId },
      orderBy: { createdAt: 'desc' },
    });

    return submissions.map((s: any) => this.mapPrismaSubmission(s));
  }

  async updateStatus(id: string, status: string): Promise<void> {
    await prisma.submission.update({
      where: { id },
      data: { status: status as any },
    });
  }

  async createResult(data: {
    submissionId: string;
    runtime?: number;
    memory?: number;
    passedCases: number;
    totalCases: number;
    error?: string;
    output?: string;
  }): Promise<SubmissionResult> {
    const prismaResult = await prisma.submissionResult.create({
      data: {
        submissionId: data.submissionId,
        runtime: data.runtime,
        memory: data.memory,
        passedCases: data.passedCases,
        totalCases: data.totalCases,
        error: data.error,
        output: data.output,
      },
    });

    return this.mapPrismaSubmissionResult(prismaResult);
  }

  async countByUser(userId: string): Promise<number> {
    return prisma.submission.count({
      where: { userId },
    });
  }

  async countSolvedByUser(userId: string): Promise<number> {
    const solvedGroup = await prisma.submission.groupBy({
      by: ['problemId'],
      where: {
        userId,
        status: 'ACCEPTED',
      },
    });

    return solvedGroup.length;
  }

  async countAcceptedByUser(userId: string): Promise<number> {
    return prisma.submission.count({
      where: {
        userId,
        status: 'ACCEPTED',
      },
    });
  }

  async getSolvedProblemsDifficultyByUser(userId: string): Promise<Record<string, number>> {
    const solvedProblems = await prisma.submission.findMany({
      where: {
        userId,
        status: 'ACCEPTED',
      },
      select: {
        problem: {
          select: {
            difficulty: true,
          },
        },
      },
      distinct: ['problemId'],
    });

    const result = { EASY: 0, MEDIUM: 0, HARD: 0 };
    solvedProblems.forEach((s: any) => {
      const diff = s.problem.difficulty;
      if (diff in result) {
        result[diff as keyof typeof result]++;
      }
    });
    return result;
  }

  async getSolvedProblemsCategoryByUser(userId: string): Promise<Record<string, number>> {
    const solvedProblems = await prisma.submission.findMany({
      where: {
        userId,
        status: 'ACCEPTED',
      },
      select: {
        problem: {
          select: {
            category: true,
          },
        },
      },
      distinct: ['problemId'],
    });

    const result = { JAVASCRIPT: 0, REACT: 0, NODEJS: 0, TYPESCRIPT: 0 };
    solvedProblems.forEach((s: any) => {
      const cat = s.problem.category;
      if (cat in result) {
        result[cat as keyof typeof result]++;
      }
    });
    return result;
  }

  async getRecentActivityByUser(
    userId: string,
    limit: number,
  ): Promise<
    Array<{
      id: string;
      problemId: string;
      problemTitle: string;
      problemSlug: string;
      difficulty: string;
      status: string;
      createdAt: Date;
    }>
  > {
    const submissions = await prisma.submission.findMany({
      where: { userId },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        problem: {
          select: {
            title: true,
            slug: true,
            difficulty: true,
          },
        },
      },
    });

    return submissions.map((s: any) => ({
      id: s.id,
      problemId: s.problemId,
      problemTitle: s.problem.title,
      problemSlug: s.problem.slug,
      difficulty: s.problem.difficulty,
      status: s.status,
      createdAt: s.createdAt,
    }));
  }

  async getActivityByUser(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Array<{ date: string; count: number }>> {
    const submissions = await prisma.submission.findMany({
      where: {
        userId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        createdAt: true,
      },
    });

    const counts: Record<string, number> = {};
    submissions.forEach((s: any) => {
      const dateStr = s.createdAt.toISOString().split('T')[0];
      counts[dateStr] = (counts[dateStr] || 0) + 1;
    });

    return Object.entries(counts).map(([date, count]) => ({ date, count }));
  }
}
