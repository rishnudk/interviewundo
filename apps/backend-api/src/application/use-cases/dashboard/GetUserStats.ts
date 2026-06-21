import type { IUseCase } from '../../interfaces/IUseCase';
import type { ISubmissionRepository } from '../../../domain/ports/repositories/ISubmissionRepository';
import type { IProblemRepository } from '../../../domain/ports/repositories/IProblemRepository';
import type { IUserRepository } from '../../../domain/ports/repositories/IUserRepository';

// ============================================================
// GetUserStats Use Case
// Calculates high-level statistics for a user dashboard
// ============================================================

export interface UserStatsOutput {
  totalSolved: number;
  totalProblems: number;
  successRate: number;
  streak: number;
  difficultyBreakdown: {
    EASY: { solved: number; total: number };
    MEDIUM: { solved: number; total: number };
    HARD: { solved: number; total: number };
  };
}

export interface GetUserStatsInput {
  userId: string;
}

export class GetUserStats implements IUseCase<GetUserStatsInput, UserStatsOutput> {
  constructor(
    private readonly submissionRepository: ISubmissionRepository,
    private readonly problemRepository: IProblemRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute({ userId }: GetUserStatsInput): Promise<UserStatsOutput> {
    const [
      totalSolved,
      difficultyTotals,
      difficultySolved,
      totalSubmissions,
      acceptedSubmissions,
      user,
    ] = await Promise.all([
      this.submissionRepository.countSolvedByUser(userId),
      this.problemRepository.countByDifficulty(),
      this.submissionRepository.getSolvedProblemsDifficultyByUser(userId),
      this.submissionRepository.countByUser(userId),
      this.submissionRepository.countAcceptedByUser(userId),
      this.userRepository.findById(userId),
    ]);

    const totalProblems = Object.values(difficultyTotals).reduce((sum, val) => sum + val, 0);
    const successRate =
      totalSubmissions > 0 ? Math.round((acceptedSubmissions / totalSubmissions) * 100) : 0;

    let userStreak = user ? user.streak : 0;
    if (user && user.lastActiveAt) {
      const today = new Date();
      const lastActive = new Date(user.lastActiveAt);
      const todayMidnight = new Date(
        Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()),
      );
      const lastActiveMidnight = new Date(
        Date.UTC(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate()),
      );

      const diffTime = todayMidnight.getTime() - lastActiveMidnight.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 1) {
        await this.userRepository.updateStreak(userId, 0, user.lastActiveAt);
        userStreak = 0;
      }
    }

    return {
      totalSolved,
      totalProblems,
      successRate,
      streak: userStreak,
      difficultyBreakdown: {
        EASY: { solved: difficultySolved.EASY || 0, total: difficultyTotals.EASY || 0 },
        MEDIUM: { solved: difficultySolved.MEDIUM || 0, total: difficultyTotals.MEDIUM || 0 },
        HARD: { solved: difficultySolved.HARD || 0, total: difficultyTotals.HARD || 0 },
      },
    };
  }
}
