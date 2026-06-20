import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RunCode } from './RunCode';
import { NotFoundError } from '../../../domain/errors';
import type { IProblemRepository } from '../../../domain/ports/repositories/IProblemRepository';
import type { IQueueService } from '../../../domain/ports/services/IQueueService';
import type { Problem, Difficulty } from '@interviewprep/shared-types';

describe('RunCode Use Case', () => {
  let problemRepository: IProblemRepository;
  let queueService: IQueueService;
  let useCase: RunCode;

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

  beforeEach(() => {
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

    useCase = new RunCode(problemRepository, queueService);
  });

  it('should run code successfully in playground mode', async () => {
    const input = {
      problemId: 'problem-123',
      code: 'console.log("hello world");',
      language: 'javascript',
      userId: 'user-456',
    };

    vi.mocked(problemRepository.findById).mockResolvedValue(mockProblem);
    vi.mocked(queueService.enqueueSubmission).mockResolvedValue('job-id-123');

    const result = await useCase.execute(input);

    expect(problemRepository.findById).toHaveBeenCalledWith(input.problemId);
    expect(queueService.enqueueSubmission).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: input.userId,
        problemId: input.problemId,
        code: input.code,
        language: input.language,
      }),
    );

    // jobId should start with "run-"
    expect(result.jobId).toMatch(/^run-/);
    expect(result.status).toBe('PENDING');
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
    expect(queueService.enqueueSubmission).not.toHaveBeenCalled();
  });
});
