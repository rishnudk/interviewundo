import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetActivityHeatmap } from './GetActivityHeatmap';
import type { ISubmissionRepository } from '../../../domain/ports/repositories/ISubmissionRepository';

describe('GetActivityHeatmap Use Case', () => {
  let submissionRepository: ISubmissionRepository;
  let useCase: GetActivityHeatmap;

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

    useCase = new GetActivityHeatmap(submissionRepository);
  });

  it('should retrieve activity counts for the user', async () => {
    const mockActivity = [
      { date: '2026-06-20', count: 3 },
      { date: '2026-06-21', count: 5 },
    ];

    vi.mocked(submissionRepository.getActivityByUser).mockResolvedValue(mockActivity);

    const result = await useCase.execute({ userId: 'user-123' });

    expect(submissionRepository.getActivityByUser).toHaveBeenCalledWith(
      'user-123',
      expect.any(Date),
      expect.any(Date),
    );

    expect(result).toEqual({
      activity: mockActivity,
    });
  });
});
