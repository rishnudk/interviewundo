import { Router, Request, Response } from 'express';
import { prisma } from '../../config/database';
import { redis } from '../../config/redis';

// ============================================================
// Health Check Routes
// /health — basic liveness check
// /ready  — readiness check (DB + Redis connectivity)
// ============================================================

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

router.get('/ping', (_req: Request, res: Response) => {
  res.json({
    status: 'pong',
    timestamp: new Date().toISOString(),
  });
});

// /keepalive — checks node uptime + pings DB and Redis so all free-tier services stay awake
router.get('/keepalive', async (_req: Request, res: Response) => {
  const result: {
    status: string;
    timestamp: string;
    uptime: number;
    services: { database: string; redis: string };
  } = {
    status: 'alive',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: { database: 'connected', redis: 'connected' },
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    result.services.database = 'disconnected';
    result.status = 'degraded';
  }

  try {
    await redis.ping();
  } catch {
    result.services.redis = 'disconnected';
    result.status = 'degraded';
  }

  res.status(result.status === 'degraded' ? 207 : 200).json(result);
});

router.get('/ready', async (_req: Request, res: Response) => {
  try {
    // Check database connectivity
    await prisma.$queryRaw`SELECT 1`;

    // Check Redis connectivity
    await redis.ping();

    res.json({
      status: 'ready',
      services: {
        database: 'connected',
        redis: 'connected',
      },
    });
  } catch (error) {
    res.status(503).json({
      status: 'not ready',
      services: {
        database: 'unknown',
        redis: 'unknown',
      },
    });
  }
});

export const healthRoutes = router;
