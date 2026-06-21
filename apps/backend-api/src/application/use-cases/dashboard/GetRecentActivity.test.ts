import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetRecentActivity } from './GetRecentActivity';
import type { ISubmissionRepository } from '../../../domain/ports/repositories/ISubmissionRepository';

describe('GetRecentActivity Use Case', () => {
  let submissionRepository: ISubmissionRepository;
  let useCase: GetRecentActivity;

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

    useCase = new GetRecentActivity(submissionRepository);
  });

  it('should retrieve recent submissions with problem details', async () => {
    const mockRecentSubmissions = [
      {
        id: 'sub-1',
        problemId: 'prob-1',
        problemTitle: 'Two Sum',
        problemSlug: 'two-sum',
        difficulty: 'EASY',
        status: 'ACCEPTED',
        createdAt: new Date(),
      },
      {
        id: 'sub-2',
        problemId: 'prob-2',
        problemTitle: 'Add Two Numbers',
        problemSlug: 'add-two-numbers',
        difficulty: 'MEDIUM',
        status: 'WRONG_ANSWER',
        createdAt: new Date(),
      },
    ];

    vi.mocked(submissionRepository.getRecentActivityByUser).mockResolvedValue(
      mockRecentSubmissions,
    );

    const result = await useCase.execute({ userId: 'user-123', limit: 5 });

    expect(submissionRepository.getRecentActivityByUser).toHaveBeenCalledWith('user-123', 5);
    expect(result).toEqual({
      submissions: mockRecentSubmissions,
    });
  });

  it('should use default limit of 5 if none provided', async () => {
    vi.mocked(submissionRepository.getRecentActivityByUser).mockResolvedValue([]);

    await useCase.execute({ userId: 'user-123' });

    expect(submissionRepository.getRecentActivityByUser).toHaveBeenCalledWith('user-123', 5);
  });
});
