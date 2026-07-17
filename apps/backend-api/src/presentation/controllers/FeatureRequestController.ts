import { Request, Response, NextFunction } from 'express';
import type { CreateFeatureRequest } from '../../application/use-cases/requests/CreateFeatureRequest';
import type { GetFeatureRequests } from '../../application/use-cases/requests/GetFeatureRequests';
import type { UpvoteFeatureRequest } from '../../application/use-cases/requests/UpvoteFeatureRequest';

export class FeatureRequestController {
  constructor(
    private readonly createFeatureRequest: CreateFeatureRequest,
    private readonly getFeatureRequests: GetFeatureRequests,
    private readonly upvoteFeatureRequest: UpvoteFeatureRequest,
  ) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { title, description, type } = req.body;

      const result = await this.createFeatureRequest.execute({
        userId,
        title,
        description,
        type,
      });

      res.status(201).json({
        success: true,
        data: result,
        message: 'Feature request created successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  list = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.getFeatureRequests.execute();

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  upvote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const requestId = req.params.id as string;
      const result = await this.upvoteFeatureRequest.execute({ requestId });

      res.status(200).json({
        success: true,
        data: result,
        message: 'Upvoted successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}
