import { Request, Response, NextFunction } from 'express';
import type { GetUserStats } from '../../application/use-cases/dashboard/GetUserStats';
import type { GetCategoryProgress } from '../../application/use-cases/dashboard/GetCategoryProgress';
import type { GetActivityHeatmap } from '../../application/use-cases/dashboard/GetActivityHeatmap';
import type { GetRecentActivity } from '../../application/use-cases/dashboard/GetRecentActivity';

// ============================================================
// DashboardController
// Orchestrates requests for user statistics and activity metrics
// ============================================================

export class DashboardController {
  constructor(
    private readonly getUserStatsUseCase: GetUserStats,
    private readonly getCategoryProgressUseCase: GetCategoryProgress,
    private readonly getActivityHeatmapUseCase: GetActivityHeatmap,
    private readonly getRecentActivityUseCase: GetRecentActivity,
  ) {}

  getSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 5;

      const [stats, progress, activity, recent] = await Promise.all([
        this.getUserStatsUseCase.execute({ userId }),
        this.getCategoryProgressUseCase.execute({ userId }),
        this.getActivityHeatmapUseCase.execute({ userId }),
        this.getRecentActivityUseCase.execute({ userId, limit }),
      ]);

      res.status(200).json({
        success: true,
        data: {
          stats,
          progress: progress.categories,
          activity: activity.activity,
          recent: recent.submissions,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  getStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const stats = await this.getUserStatsUseCase.execute({ userId });

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  };

  getCategoryProgress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const progress = await this.getCategoryProgressUseCase.execute({ userId });

      res.status(200).json({
        success: true,
        data: progress.categories,
      });
    } catch (error) {
      next(error);
    }
  };

  getActivityHeatmap = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const activity = await this.getActivityHeatmapUseCase.execute({ userId });

      res.status(200).json({
        success: true,
        data: activity.activity,
      });
    } catch (error) {
      next(error);
    }
  };

  getRecentActivity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 5;
      const recent = await this.getRecentActivityUseCase.execute({ userId, limit });

      res.status(200).json({
        success: true,
        data: recent.submissions,
      });
    } catch (error) {
      next(error);
    }
  };
}
