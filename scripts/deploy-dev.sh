#!/bin/bash
# ============================================================
# deploy-dev.sh — Deploy to DEV server
# Server: srv126943 | IP: 62.72.3.226
# URL: https://dev.desarrollopersonal.uno
# ============================================================
set -e

APP_NAME="desarrollopersonal-dev"
APP_DIR="/var/www/desarrollopersonal"
BRANCH="${1:-main}"

echo "======================================================"
echo "  DEPLOY → DEV (dev.desarrollopersonal.uno)"
echo "  Branch: $BRANCH"
echo "======================================================"

cd "$APP_DIR"

# 1. Pull latest code
echo "[1/6] Pulling $BRANCH..."
git fetch origin "$BRANCH"
git checkout "$BRANCH"
git pull origin "$BRANCH"

# 2. Install dependencies (only if package.json changed)
echo "[2/6] Installing dependencies..."
pnpm install

# 3. Run DB migrations
echo "[3/6] Running database migrations..."
npx prisma migrate deploy
npx prisma generate

# 4. Clean previous build
echo "[4/6] Cleaning previous build..."
rm -rf .next

# 5. Build
echo "[5/6] Building..."
pnpm build

# 6. Restart PM2 process
echo "[6/6] Restarting $APP_NAME..."
pm2 restart "$APP_NAME" || pm2 start ecosystem.config.js --only "$APP_NAME"
pm2 save

echo ""
echo "======================================================"
echo "  Deploy to DEV completed successfully!"
echo "  Check: https://dev.desarrollopersonal.uno"
echo "======================================================"
echo ""

# Show last 20 log lines
echo "--- Recent logs ---"
pm2 logs "$APP_NAME" --lines 20 --nostream
