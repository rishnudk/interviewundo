import { Router, Request, Response } from 'express';
import { PrismaUserRepository } from '../../infrastructure/database/repositories/PrismaUserRepository';

const router = Router();
const userRepository = new PrismaUserRepository();

// GET /api/stats/public — public statistics for landing page
router.get('/public', async (_req: Request, res: Response) => {
  try {
    const userCount = await userRepository.count();
    const recentUsers = await userRepository.findRecentWithImages(10);
    res.json({
      userCount,
      recentUsers: recentUsers.map((u) => ({
        name: u.name,
        image: u.image,
        createdAt: u.createdAt,
      })),
    });
  } catch (err) {
    console.error('Error fetching public stats:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export const statsRoutes = router;
