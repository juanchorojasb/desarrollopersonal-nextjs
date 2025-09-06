#!/usr/bin/env node
/**
 * Environment Variable Validation Script
 * Validates all required environment variables for DesarrolloPersonal
 */

const path = require('path')
const fs = require('fs')

// ANSI Colors
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
}

// Required environment variables
const REQUIRED_VARS = [
  {
    name: 'NODE_ENV',
    description: 'Node environment',
    validator: (val) => ['development', 'production', 'test'].includes(val)
  },
  {
    name: 'PORT',
    description: 'Application port',
    validator: (val) => !isNaN(val) && parseInt(val) === 3010
  },
  {
    name: 'DATABASE_URL',
    description: 'MySQL database connection string',
    validator: (val) => val && val.includes('mysql://') && val.includes('desarrollopersonal_db')
  },
  {
    name: 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
    description: 'Clerk publishable key',
    validator: (val) => val && val.startsWith('pk_')
  },
  {
    name: 'CLERK_SECRET_KEY',
    description: 'Clerk secret key',
    validator: (val) => val && val.startsWith('sk_')
  }
]

// Important optional variables
const OPTIONAL_VARS = [
  'NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL',
  'NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL',
  'BUNNY_STORAGE_ZONE_NAME',
  'BUNNY_HOSTNAME',
  'BUNNY_USERNAME',
  'BUNNY_PASSWORD',
  'NEXT_PUBLIC_BUNNY_CDN_URL',
  'STRIPE_SECRET_KEY',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'NEXT_PUBLIC_APP_URL',
  'NEXTAUTH_SECRET'
]

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logHeader(message) {
  log(`\n${colors.bold}${colors.cyan}=== ${message} ===${colors.reset}`)
}

function validateEnvironment() {
  logHeader('Environment Variable Validation')
  
  let hasErrors = false
  let warnings = 0

  // Check for .env file
  const envPath = path.join(process.cwd(), '.env')
  const envLocalPath = path.join(process.cwd(), '.env.local')
  
  if (!fs.existsSync(envPath) && !fs.existsSync(envLocalPath)) {
    log('⚠️  No .env or .env.local file found', 'yellow')
    log('💡 Copy .env.example to .env and configure your values', 'blue')
    warnings++
  } else {
    log('✅ Environment file found', 'green')
  }

  // Validate required variables
  logHeader('Required Variables')
  
  REQUIRED_VARS.forEach(({ name, description, validator }) => {
    const value = process.env[name]
    
    if (!value) {
      log(`❌ ${name} - ${description} (MISSING)`, 'red')
      hasErrors = true
    } else if (validator && !validator(value)) {
      log(`❌ ${name} - ${description} (INVALID FORMAT)`, 'red')
      hasErrors = true
    } else {
      // Show partial value for security
      const displayValue = value.length > 10 
        ? `${value.substring(0, 10)}...` 
        : value
      log(`✅ ${name} - ${displayValue}`, 'green')
    }
  })

  // Check optional but important variables
  logHeader('Optional Variables')
  
  OPTIONAL_VARS.forEach(name => {
    const value = process.env[name]
    if (value) {
      const displayValue = value.length > 20 
        ? `${value.substring(0, 20)}...` 
        : value
      log(`✅ ${name} - ${displayValue}`, 'green')
    } else {
      log(`⚠️  ${name} - Not set (optional)`, 'yellow')
      warnings++
    }
  })

  // Port validation
  logHeader('Port Configuration')
  const port = process.env.PORT || '3010'
  if (port === '3010') {
    log('✅ Port correctly set to 3010 (standardized schema)', 'green')
  } else {
    log(`⚠️  Port is ${port}, should be 3010 for standardized schema`, 'yellow')
    warnings++
  }

  // Database connection test
  logHeader('Database Connection')
  if (process.env.DATABASE_URL) {
    const dbUrl = process.env.DATABASE_URL
    if (dbUrl.includes('localhost:3307')) {
      log('✅ Database URL points to correct port (3307)', 'green')
    } else if (dbUrl.includes('localhost:3306')) {
      log('⚠️  Database URL uses port 3306, verify if this is correct', 'yellow')
      warnings++
    } else {
      log('ℹ️  Database URL uses external host', 'blue')
    }
  }

  // Summary
  logHeader('Validation Summary')
  
  if (hasErrors) {
    log('❌ Validation failed! Fix the errors above before deploying.', 'red')
    process.exit(1)
  } else {
    log('✅ All required environment variables are configured!', 'green')
    if (warnings > 0) {
      log(`⚠️  ${warnings} warnings found. Review optional configurations.`, 'yellow')
    }
    log('🚀 Environment is ready for deployment!', 'cyan')
    process.exit(0)
  }
}

// Load environment variables if running standalone
if (require.main === module) {
  // Try to load .env files
  try {
    const dotenv = require('dotenv')
    dotenv.config({ path: '.env.local' })
    dotenv.config({ path: '.env' })
  } catch (err) {
    // dotenv not available, continue with system env vars
  }
  
  validateEnvironment()
}

module.exports = { validateEnvironment }