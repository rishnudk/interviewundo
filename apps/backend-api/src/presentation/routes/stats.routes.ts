import { Router, Request, Response } from 'express';
import { PrismaUserRepository } from '../../infrastructure/database/repositories/PrismaUserRepository';

const router = Router();
const userRepository = new PrismaUserRepository();

// GET /api/stats/public — public statistics for landing page
router.get('/public', async (_req: Request, res: Response) => {
  try {
    const userCount = await userRepository.count();
    const recentUsers = await userRepository.findRecent(20);
    res.json({
      userCount,
      recentUsers: recentUsers.map((u) => ({
        id: u.id,
        name: u.name,
        image: u.image,
        role: u.role,
        createdAt: u.createdAt,
      })),
    });
  } catch (err) {
    console.error('Error fetching public stats:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export const statsRoutes = router;
