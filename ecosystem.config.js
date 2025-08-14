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
        PORT: 3003,
        // 🔐 CLERK BASIC CONFIGURATION
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: 'pk_test_Ym9sZC13YXJ0aG9nLTg4LmNsZXJrLmFjY291bnRzLmRldiQ',
        CLERK_SECRET_KEY: 'sk_test_m4B1bNprIOqvxwY0J2CuwgXGfqqAnGZFcCm1gt8ZAx',
        NEXT_PUBLIC_CLERK_SIGN_IN_URL: '/sign-in',
        NEXT_PUBLIC_CLERK_SIGN_UP_URL: '/sign-up',
        NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: 'https://desarrollopersonal.uno/dashboard',
        NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: 'https://desarrollopersonal.uno/dashboard',
        // 🗄️ DATABASE
        DATABASE_URL: 'mysql://devuser:devpass123@localhost:3307/desarrollopersonal_db?charset=utf8mb4&collation=utf8mb4_unicode_ci',
        // 🐰 BUNNY.NET CDN
        BUNNY_STORAGE_ZONE_NAME: 'desarrollopersonal',
        BUNNY_HOSTNAME: 'br.storage.bunnycdn.com',
        BUNNY_USERNAME: 'desarrollopersonal',
        BUNNY_PASSWORD: '0e0e861a-1456-4e47-a89a758f3cd5-a2b5-4da7',
        NEXT_PUBLIC_BUNNY_CDN_URL: 'https://desarrollopersonal.b-cdn.net'
      },
      error_file: '/var/log/pm2/desarrollopersonal-error.log',
      out_file: '/var/log/pm2/desarrollopersonal-out.log',
      log_file: '/var/log/pm2/desarrollopersonal.log',
      time: true
    }
  ]
}
