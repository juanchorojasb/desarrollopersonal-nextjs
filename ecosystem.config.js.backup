module.exports = {
  apps: [
    {
      name: 'desarrollopersonal',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/desarrollopersonal-nextjs',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        PORT: 3003
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3003
      },
      error_file: '/var/log/pm2/desarrollopersonal-error.log',
      out_file: '/var/log/pm2/desarrollopersonal-out.log',
      log_file: '/var/log/pm2/desarrollopersonal.log',
      time: true
    }
  ]
}
