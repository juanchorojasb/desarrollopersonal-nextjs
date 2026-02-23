#!/bin/bash
# ============================================================
# deploy-prod.sh — Deploy to PRODUCTION server
# Server: srv1313442
# URL: https://desarrollopersonal.uno
#
# IMPORTANT: Always run from PROD server only.
# Run backup.sh before executing this script.
# ============================================================
set -e

APP_NAME="desarrollopersonal-prod"
APP_DIR="/var/www/desarrollopersonal"
BACKUP_DIR="/var/www"
BRANCH="${1:-main}"
DATE=$(date +%Y%m%d-%H%M%S)

echo "======================================================"
echo "  DEPLOY → PROD (desarrollopersonal.uno)"
echo "  Branch: $BRANCH"
echo "  Date: $DATE"
echo "======================================================"
echo ""
echo "WARNING: You are about to deploy to PRODUCTION."
read -r -p "  Type 'yes' to continue: " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
  echo "Deploy cancelled."
  exit 0
fi

cd "$APP_DIR"

# 1. Backup current code
echo "[1/7] Backing up current code..."
cp -r "$APP_DIR" "${BACKUP_DIR}/desarrollopersonal-backup-${DATE}"
echo "  Backup saved to: ${BACKUP_DIR}/desarrollopersonal-backup-${DATE}"

# 2. Pull latest code
echo "[2/7] Pulling $BRANCH..."
git fetch origin "$BRANCH"
git checkout "$BRANCH"
git pull origin "$BRANCH"

# 3. Install dependencies
echo "[3/7] Installing dependencies..."
pnpm install

# 4. Run DB migrations (deploy-only, no new migrations created)
echo "[4/7] Running database migrations..."
npx prisma migrate deploy
npx prisma generate

# 5. Clean previous build
echo "[5/7] Cleaning previous build..."
rm -rf .next

# 6. Build
echo "[6/7] Building..."
pnpm build

# 7. Restart PM2
echo "[7/7] Restarting $APP_NAME..."
pm2 restart "$APP_NAME" || pm2 start ecosystem.config.js --only "$APP_NAME"
pm2 save

echo ""
echo "======================================================"
echo "  Deploy to PROD completed!"
echo "  Verify: https://desarrollopersonal.uno"
echo "  Backup: ${BACKUP_DIR}/desarrollopersonal-backup-${DATE}"
echo "======================================================"
echo ""

# Show last 20 log lines
echo "--- Recent logs ---"
pm2 logs "$APP_NAME" --lines 20 --nostream

echo ""
echo "Post-deploy checklist:"
echo "  [ ] Login works"
echo "  [ ] Courses load"
echo "  [ ] Payments functional"
echo "  [ ] Forum accessible"
echo "  [ ] AI assistant responds"
echo "  [ ] Admin panel accessible"
