module.exports = {
  apps: [{
    name: 'desarrollopersonal',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/desarrollopersonal-nextjs',
    env: {
      NODE_ENV: 'production',
      PORT: 3010
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    error_file: '/var/log/projects/desarrollopersonal/error.log',
    out_file: '/var/log/projects/desarrollopersonal/out.log',
    log_file: '/var/log/projects/desarrollopersonal/combined.log'
  }]
}
