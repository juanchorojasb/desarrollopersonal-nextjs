#!/bin/bash

echo "🚀 Deploying DesarrolloPersonal.uno to Production..."
echo "⏰ Started at: $(date)"

# Verificar que estamos en la rama correcta
echo "📋 Checking git branch..."
git checkout main

# Pull latest changes
echo "📥 Pulling latest changes from GitHub..."
git pull origin main

# Install ALL dependencies (including devDependencies for build)
echo "📦 Installing dependencies (including dev dependencies)..."
npm install

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf .next/

# Build production
echo "🔨 Building production bundle..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed! Aborting deploy."
    exit 1
fi

# Restart PM2
echo "🔄 Restarting PM2..."
pm2 restart desarrollopersonal

# Wait for restart
echo "⏳ Waiting for application to start..."
sleep 5

# Show status
echo "📊 PM2 Status:"
pm2 status | grep desarrollopersonal

# Test functionality
echo "🧪 Testing deployment..."
HEALTH_CHECK=$(curl -s http://localhost:3004/api/health)
echo "Health Check: $HEALTH_CHECK"

# Test main page
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3004/)
echo "HTTP Status: $HTTP_STATUS"

if [ "$HTTP_STATUS" = "200" ]; then
    echo "✅ Deploy completed successfully!"
    echo "🌐 URL: http://desarrollopersonal.uno"
    echo "🔒 HTTPS: https://desarrollopersonal.uno (pending SSL)"
    echo "⏰ Completed at: $(date)"
else
    echo "❌ Deploy failed - HTTP Status: $HTTP_STATUS"
    exit 1
fi
