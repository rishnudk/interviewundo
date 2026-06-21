import { Router } from 'express';
import { container } from '../../container';
import { authenticate } from '../middleware/authenticate';

const dashboardRoutes = Router();

// Apply auth middleware to all dashboard endpoints
dashboardRoutes.use(authenticate);

// GET /api/dashboard/summary
dashboardRoutes.get('/summary', (req, res, next) => {
  container.controllers.dashboardController.getSummary(req, res, next);
});

// GET /api/dashboard/stats
dashboardRoutes.get('/stats', (req, res, next) => {
  container.controllers.dashboardController.getStats(req, res, next);
});

// GET /api/dashboard/progress
dashboardRoutes.get('/progress', (req, res, next) => {
  container.controllers.dashboardController.getCategoryProgress(req, res, next);
});

// GET /api/dashboard/heatmap
dashboardRoutes.get('/heatmap', (req, res, next) => {
  container.controllers.dashboardController.getActivityHeatmap(req, res, next);
});

// GET /api/dashboard/recent
dashboardRoutes.get('/recent', (req, res, next) => {
  container.controllers.dashboardController.getRecentActivity(req, res, next);
});

export { dashboardRoutes };
