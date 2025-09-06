module.exports = {
  apps: [
    {
      name: 'desarrollopersonal',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/desarrollopersonal-nextjs',
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        PORT: 3010
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3010,
        // 🔐 CLERK PRODUCTION CONFIGURATION
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: 'pk_live_Y2xlcmsubG9jYWwkKyQqPzknUktCT0NMRVJLLkxPQ0FM',
        CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
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
        BUNNY_PASSWORD: process.env.BUNNY_PASSWORD,
        NEXT_PUBLIC_BUNNY_CDN_URL: 'https://desarrollopersonal.b-cdn.net'
      },
      error_file: '/var/log/projects/desarrollopersonal/error.log',
      out_file: '/var/log/projects/desarrollopersonal/out.log',
      log_file: '/var/log/projects/desarrollopersonal/combined.log',
      time: true
    }
  ]
}
