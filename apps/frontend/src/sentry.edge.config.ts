import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn:
    process.env.SENTRY_DSN ||
    'https://27829b68874b11f1b2c1ce67353f4361@o0.ingest.sentry.io/4511789330792448',
  tracesSampleRate: 1.0,
  debug: true,
});
