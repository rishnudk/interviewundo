import { Router } from 'express';
import { container } from '../../container';
import { validateRequest } from '../middleware/validate-request';
import { authenticate } from '../middleware/authenticate';
import { CreateFeatureRequestSchema } from '@interviewprep/shared-types';

const requestRoutes = Router();

// GET /api/requests
requestRoutes.get('/', (req, res, next) => {
  container.controllers.featureRequestController.list(req, res, next);
});

// POST /api/requests
requestRoutes.post(
  '/',
  authenticate,
  validateRequest(CreateFeatureRequestSchema, 'body'),
  (req, res, next) => {
    container.controllers.featureRequestController.create(req, res, next);
  },
);

// POST /api/requests/:id/upvote
requestRoutes.post('/:id/upvote', authenticate, (req, res, next) => {
  container.controllers.featureRequestController.upvote(req, res, next);
});

export { requestRoutes };
