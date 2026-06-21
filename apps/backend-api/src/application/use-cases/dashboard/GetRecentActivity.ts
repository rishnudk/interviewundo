import type { IUseCase } from '../../interfaces/IUseCase';
import type { ISubmissionRepository } from '../../../domain/ports/repositories/ISubmissionRepository';

// ============================================================
// GetRecentActivity Use Case
// Retrieves a user's recent submissions with problem details
// ============================================================

export interface RecentActivityItem {
  id: string;
  problemId: string;
  problemTitle: string;
  problemSlug: string;
  difficulty: string;
  status: string;
  createdAt: Date;
}

export interface RecentActivityOutput {
  submissions: RecentActivityItem[];
}

export interface GetRecentActivityInput {
  userId: string;
  limit?: number;
}

export class GetRecentActivity implements IUseCase<GetRecentActivityInput, RecentActivityOutput> {
  constructor(private readonly submissionRepository: ISubmissionRepository) {}

  async execute({ userId, limit = 5 }: GetRecentActivityInput): Promise<RecentActivityOutput> {
    const submissions = await this.submissionRepository.getRecentActivityByUser(userId, limit);

    return { submissions };
  }
}
