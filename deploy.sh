#!/bin/bash

echo "🚀 Deploying DesarrolloPersonal.uno to Production..."

# Verificar que estamos en la rama correcta
git checkout main

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Install dependencies if needed
echo "📦 Installing dependencies..."
npm install --production

# Build production
echo "🔨 Building production..."
npm run build

# Restart PM2
echo "🔄 Restarting PM2..."
pm2 restart desarrollopersonal

# Show status
pm2 status | grep desarrollopersonal

echo "✅ Deploy completed!"
echo "🌐 URL: http://desarrollopersonal.uno"
echo "🔒 HTTPS: https://desarrollopersonal.uno (pending SSL)"
