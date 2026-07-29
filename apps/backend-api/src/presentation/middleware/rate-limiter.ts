import rateLimit from 'express-rate-limit';

// General API rate limiter — applied globally
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 10000 : 100, // Limit each IP to 10000 requests in dev, 100 in prod
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      error: {
        code: 'TOO_MANY_REQUESTS',
        message: 'Too many requests from this IP, please try again later.',
      },
    });
  },
});

// Lenient limiter specifically for /api/auth/refreshToken
// Token refresh happens automatically every ~14 minutes.
// Using the general limiter here risks locking users out (especially
// with multiple browser tabs open). This allows 20 refreshes per 15 min per IP.
export const authRefreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      error: {
        code: 'TOO_MANY_REQUESTS',
        message: 'Too many token refresh attempts. Please sign in again.',
      },
    });
  },
});
