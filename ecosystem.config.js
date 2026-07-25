const path = require('path');

// ============================================================
// PM2 Ecosystem Config — Production Process Manager
//
// This file is safe to commit — it contains NO secrets.
// Secrets are loaded from each app's .env file via dotenv.
//
// Usage (on VPS):
//   pm2 start ecosystem.config.js
//   pm2 save
//   pm2 startup    # auto-start on reboot
// ============================================================

module.exports = {
  apps: [
    // --------------------------------------------------------
    // Backend API
    // --------------------------------------------------------
    {
      name: 'interview-undo-backend',
      script: 'dist/server.js',
      cwd: path.join(__dirname, 'apps/backend-api'),
      node_args: '-r dotenv/config',
      env_production: {
        NODE_ENV: 'production',
      },
      instances: 1,
      exec_mode: 'fork',
      // Restart behavior
      max_restarts: 10,
      restart_delay: 5000,
      min_uptime: '10s',
      // Logging
      out_file: '/var/log/pm2/backend-out.log',
      error_file: '/var/log/pm2/backend-err.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      // Graceful shutdown
      kill_timeout: 12000, // matches 10s timeout in server.ts + buffer
      listen_timeout: 8000,
    },

    // --------------------------------------------------------
    // Judge Worker
    // --------------------------------------------------------
    {
      name: 'interview-undo-worker',
      script: 'dist/index.js',
      cwd: path.join(__dirname, 'apps/judge-worker'),
      node_args: '-r dotenv/config',
      env_production: {
        NODE_ENV: 'production',
      },
      instances: 1,
      exec_mode: 'fork',
      // Restart behavior
      max_restarts: 10,
      restart_delay: 5000,
      min_uptime: '10s',
      // Logging
      out_file: '/var/log/pm2/worker-out.log',
      error_file: '/var/log/pm2/worker-err.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      // Graceful shutdown
      kill_timeout: 15000,
      listen_timeout: 8000,
    },
  ],
};
