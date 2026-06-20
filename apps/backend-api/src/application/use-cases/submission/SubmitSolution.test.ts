import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SubmitSolution } from './SubmitSolution';
import { NotFoundError } from '../../../domain/errors';
import type { ISubmissionRepository } from '../../../domain/ports/repositories/ISubmissionRepository';
import type { IProblemRepository } from '../../../domain/ports/repositories/IProblemRepository';
import type { IQueueService } from '../../../domain/ports/services/IQueueService';
import type { INotificationService } from '../../../domain/ports/services/INotificationService';
import type {
  Problem,
  Submission,
  Difficulty,
  SubmissionStatus,
} from '@interviewprep/shared-types';

describe('SubmitSolution Use Case', () => {
  let submissionRepository: ISubmissionRepository;
  let problemRepository: IProblemRepository;
  let queueService: IQueueService;
  let notificationService: INotificationService;
  let useCase: SubmitSolution;

  const mockProblem: Problem = {
    id: 'problem-123',
    title: 'Two Sum',
    slug: 'two-sum',
    description: 'Find two numbers that add up to a target.',
    difficulty: 'EASY' as Difficulty,
    category: 'JAVASCRIPT' as any,
    starterCode: 'function twoSum() {}',
    createdAt: new Date(),
    updatedAt: new Date(),
    order: 0,
    isPublished: true,
    solvedCount: 0,
    attemptCount: 0,
    tags: [],
  };

  const mockSubmission: Submission = {
    id: 'submission-789',
    userId: 'user-456',
    problemId: 'problem-123',
    code: 'console.log("hello world");',
    language: 'javascript',
    status: 'PENDING' as SubmissionStatus,
    createdAt: new Date(),
  };

  beforeEach(() => {
    submissionRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findByUser: vi.fn(),
      findByUserAndProblem: vi.fn(),
      updateStatus: vi.fn(),
      createResult: vi.fn(),
      countByUser: vi.fn(),
      countSolvedByUser: vi.fn(),
      getActivityByUser: vi.fn(),
    };

    problemRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findBySlug: vi.fn(),
      findAll: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      incrementSolvedCount: vi.fn(),
      incrementAttemptCount: vi.fn(),
    };

    queueService = {
      enqueueSubmission: vi.fn(),
      getJobStatus: vi.fn(),
    };

    notificationService = {
      notifyUser: vi.fn(),
      notifyAll: vi.fn(),
    };

    useCase = new SubmitSolution(
      submissionRepository,
      problemRepository,
      queueService,
      notificationService,
    );
  });

  it('should submit a solution successfully', async () => {
    const input = {
      problemId: 'problem-123',
      code: 'console.log("hello world");',
      language: 'javascript',
      userId: 'user-456',
    };

    vi.mocked(problemRepository.findById).mockResolvedValue(mockProblem);
    vi.mocked(submissionRepository.create).mockResolvedValue(mockSubmission);
    vi.mocked(queueService.enqueueSubmission).mockResolvedValue('job-id-123');

    const result = await useCase.execute(input);

    expect(problemRepository.findById).toHaveBeenCalledWith(input.problemId);
    expect(submissionRepository.create).toHaveBeenCalledWith({
      userId: input.userId,
      problemId: input.problemId,
      code: input.code,
      language: input.language,
      status: 'PENDING',
    });
    expect(problemRepository.incrementAttemptCount).toHaveBeenCalledWith(input.problemId);
    expect(queueService.enqueueSubmission).toHaveBeenCalledWith({
      submissionId: mockSubmission.id,
      userId: input.userId,
      problemId: input.problemId,
      code: input.code,
      language: input.language,
    });
    expect(notificationService.notifyUser).toHaveBeenCalledWith(input.userId, 'submission:status', {
      submissionId: mockSubmission.id,
      status: 'PENDING',
    });

    expect(result).toEqual(mockSubmission);
  });

  it('should throw NotFoundError if problem is not found', async () => {
    const input = {
      problemId: 'non-existent-problem',
      code: 'console.log("hello world");',
      language: 'javascript',
      userId: 'user-456',
    };

    vi.mocked(problemRepository.findById).mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow(NotFoundError);
    await expect(useCase.execute(input)).rejects.toThrow(
      'Problem with identifier "non-existent-problem" was not found',
    );

    expect(problemRepository.findById).toHaveBeenCalledWith(input.problemId);
    expect(submissionRepository.create).not.toHaveBeenCalled();
    expect(problemRepository.incrementAttemptCount).not.toHaveBeenCalled();
    expect(queueService.enqueueSubmission).not.toHaveBeenCalled();
    expect(notificationService.notifyUser).not.toHaveBeenCalled();
  });
});
