import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn:
    process.env.SENTRY_DSN ||
    'https://cce2f70c1caa6f6b60c6f2c8d7ae137c@o4511789323386880.ingest.us.sentry.io/4511789330792448',
  tracesSampleRate: 1.0,
  includeLocalVariables: true,
  debug: true,
});
