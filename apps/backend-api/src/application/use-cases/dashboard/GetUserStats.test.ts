import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetUserStats } from './GetUserStats';
import type { ISubmissionRepository } from '../../../domain/ports/repositories/ISubmissionRepository';
import type { IProblemRepository } from '../../../domain/ports/repositories/IProblemRepository';
import type { IUserRepository } from '../../../domain/ports/repositories/IUserRepository';
import type { User, UserRole } from '@interviewprep/shared-types';

describe('GetUserStats Use Case', () => {
  let submissionRepository: ISubmissionRepository;
  let problemRepository: IProblemRepository;
  let userRepository: IUserRepository;
  let useCase: GetUserStats;

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

    userRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findByEmail: vi.fn(),
      findByGithubId: vi.fn(),
      updateStreak: vi.fn(),
    };

    useCase = new GetUserStats(submissionRepository, problemRepository, userRepository);
  });

  it('should compile correct stats for a user', async () => {
    const mockUser: User = {
      id: 'user-123',
      name: 'Test User',
      email: 'test@example.com',
      role: 'STUDENT' as UserRole,
      streak: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(submissionRepository.countSolvedByUser).mockResolvedValue(10);
    vi.mocked(problemRepository.countByDifficulty).mockResolvedValue({
      EASY: 20,
      MEDIUM: 30,
      HARD: 10,
    });
    vi.mocked(submissionRepository.getSolvedProblemsDifficultyByUser).mockResolvedValue({
      EASY: 5,
      MEDIUM: 4,
      HARD: 1,
    });
    vi.mocked(submissionRepository.countByUser).mockResolvedValue(25);
    vi.mocked(submissionRepository.countAcceptedByUser).mockResolvedValue(12);
    vi.mocked(userRepository.findById).mockResolvedValue(mockUser);

    const result = await useCase.execute({ userId: 'user-123' });

    expect(submissionRepository.countSolvedByUser).toHaveBeenCalledWith('user-123');
    expect(problemRepository.countByDifficulty).toHaveBeenCalled();
    expect(submissionRepository.getSolvedProblemsDifficultyByUser).toHaveBeenCalledWith('user-123');
    expect(submissionRepository.countByUser).toHaveBeenCalledWith('user-123');
    expect(submissionRepository.countAcceptedByUser).toHaveBeenCalledWith('user-123');
    expect(userRepository.findById).toHaveBeenCalledWith('user-123');

    expect(result).toEqual({
      totalSolved: 10,
      totalProblems: 60,
      successRate: 48, // 12 / 25 * 100 = 48%
      streak: 5,
      difficultyBreakdown: {
        EASY: { solved: 5, total: 20 },
        MEDIUM: { solved: 4, total: 30 },
        HARD: { solved: 1, total: 10 },
      },
    });
  });

  it('should handle division by zero for successRate if no submissions exist', async () => {
    vi.mocked(submissionRepository.countSolvedByUser).mockResolvedValue(0);
    vi.mocked(problemRepository.countByDifficulty).mockResolvedValue({
      EASY: 20,
      MEDIUM: 30,
      HARD: 10,
    });
    vi.mocked(submissionRepository.getSolvedProblemsDifficultyByUser).mockResolvedValue({});
    vi.mocked(submissionRepository.countByUser).mockResolvedValue(0);
    vi.mocked(submissionRepository.countAcceptedByUser).mockResolvedValue(0);
    vi.mocked(userRepository.findById).mockResolvedValue(null);

    const result = await useCase.execute({ userId: 'user-123' });

    expect(result.successRate).toBe(0);
    expect(result.streak).toBe(0);
  });
});
