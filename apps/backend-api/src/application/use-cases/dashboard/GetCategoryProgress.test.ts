import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetCategoryProgress } from './GetCategoryProgress';
import type { ISubmissionRepository } from '../../../domain/ports/repositories/ISubmissionRepository';
import type { IProblemRepository } from '../../../domain/ports/repositories/IProblemRepository';

describe('GetCategoryProgress Use Case', () => {
  let submissionRepository: ISubmissionRepository;
  let problemRepository: IProblemRepository;
  let useCase: GetCategoryProgress;

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
      countAcceptedByUser: vi.fn(),
      getSolvedProblemsDifficultyByUser: vi.fn(),
      getSolvedProblemsCategoryByUser: vi.fn(),
      getRecentActivityByUser: vi.fn(),
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
      countByDifficulty: vi.fn(),
      countByCategory: vi.fn(),
    };

    useCase = new GetCategoryProgress(submissionRepository, problemRepository);
  });

  it('should compile category progress for a user', async () => {
    vi.mocked(problemRepository.countByCategory).mockResolvedValue({
      JAVASCRIPT: 10,
      REACT: 5,
      NODEJS: 8,
      TYPESCRIPT: 12,
    });
    vi.mocked(submissionRepository.getSolvedProblemsCategoryByUser).mockResolvedValue({
      JAVASCRIPT: 5,
      REACT: 1,
      NODEJS: 0,
      TYPESCRIPT: 6,
    });

    const result = await useCase.execute({ userId: 'user-123' });

    expect(problemRepository.countByCategory).toHaveBeenCalled();
    expect(submissionRepository.getSolvedProblemsCategoryByUser).toHaveBeenCalledWith('user-123');

    expect(result).toEqual({
      categories: [
        { category: 'JAVASCRIPT', solved: 5, total: 10, percentage: 50 },
        { category: 'REACT', solved: 1, total: 5, percentage: 20 },
        { category: 'NODEJS', solved: 0, total: 8, percentage: 0 },
        { category: 'TYPESCRIPT', solved: 6, total: 12, percentage: 50 },
      ],
    });
  });
});
