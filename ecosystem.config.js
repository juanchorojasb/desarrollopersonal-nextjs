module.exports = {
  apps: [
    // ─── DEV SERVER ────────────────────────────────────────────────────────────
    // URL: https://dev.desarrollopersonal.uno
    // Server: srv126943 | IP: 62.72.3.226 | Port: 3001
    {
      name: 'desarrollopersonal-dev',
      script: 'pnpm',
      args: 'start',
      cwd: '/var/www/desarrollopersonal',
      env_file: '.env',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      // Process management
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      // Logging
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: '/var/log/pm2/desarrollopersonal-dev-error.log',
      out_file: '/var/log/pm2/desarrollopersonal-dev-out.log',
      merge_logs: true,
    },

    // ─── PROD SERVER ───────────────────────────────────────────────────────────
    // URL: https://desarrollopersonal.uno
    // Server: srv1313442 | Port: 3000
    {
      name: 'desarrollopersonal-prod',
      script: 'pnpm',
      args: 'start',
      cwd: '/var/www/desarrollopersonal',
      env_file: '.env',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      // Process management
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      // Logging
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: '/var/log/pm2/desarrollopersonal-prod-error.log',
      out_file: '/var/log/pm2/desarrollopersonal-prod-out.log',
      merge_logs: true,
    },
  ],
}
