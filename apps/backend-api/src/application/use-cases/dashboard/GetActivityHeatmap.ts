import type { IUseCase } from '../../interfaces/IUseCase';
import type { ISubmissionRepository } from '../../../domain/ports/repositories/ISubmissionRepository';

// ============================================================
// GetActivityHeatmap Use Case
// Retrieves submission activity counts grouped by day for the past year
// ============================================================

export interface ActivityHeatmapItem {
  date: string;
  count: number;
}

export interface ActivityHeatmapOutput {
  activity: ActivityHeatmapItem[];
}

export interface GetActivityHeatmapInput {
  userId: string;
}

export class GetActivityHeatmap implements IUseCase<
  GetActivityHeatmapInput,
  ActivityHeatmapOutput
> {
  constructor(private readonly submissionRepository: ISubmissionRepository) {}

  async execute({ userId }: GetActivityHeatmapInput): Promise<ActivityHeatmapOutput> {
    const endDate = new Date();
    const startDate = new Date();
    // Default to the last 365 days of activity
    startDate.setDate(endDate.getDate() - 365);

    const activity = await this.submissionRepository.getActivityByUser(userId, startDate, endDate);

    return { activity };
  }
}
