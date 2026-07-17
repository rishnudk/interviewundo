import { Router } from 'express';
import { healthRoutes } from './health.routes';
import { authRoutes } from './auth.routes';
import { problemRoutes } from './problem.routes';
import { submissionRoutes } from './submission.routes';
import { dashboardRoutes } from './dashboard.routes';
import { adminRoutes } from './admin.routes';
import { requestRoutes } from './requests.routes';
import { statsRoutes } from './stats.routes';

// ============================================================
// Route Aggregator
// All route modules are mounted here
// ============================================================

const router = Router();

// Health and keepalive checks (mounted on both root and /api)
router.use('/', healthRoutes);
router.use('/api', healthRoutes);

// Feature routes
router.use('/api/auth', authRoutes);
router.use('/api/problems', problemRoutes);
router.use('/api/submissions', submissionRoutes);
router.use('/api/dashboard', dashboardRoutes);
router.use('/api/admin', adminRoutes);
router.use('/api/requests', requestRoutes);
router.use('/api/stats', statsRoutes);

export { router };
