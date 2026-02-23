#!/bin/bash
# ============================================================
# backup.sh — Backup code and database before a deploy
# Run on PROD server: bash scripts/backup.sh
# ============================================================
set -e

APP_DIR="/var/www/desarrollopersonal"
BACKUP_DIR="/var/backups/desarrollopersonal"
DATE=$(date +%Y%m%d-%H%M%S)

# Database credentials (loaded from .env)
if [ -f "$APP_DIR/.env" ]; then
  export $(grep -v '^#' "$APP_DIR/.env" | xargs)
fi

echo "======================================================"
echo "  BACKUP — DesarrolloPersonal.uno"
echo "  Date: $DATE"
echo "======================================================"

mkdir -p "$BACKUP_DIR"

# 1. Backup code (excluding .next and node_modules to save space)
echo "[1/2] Backing up code..."
tar -czf "${BACKUP_DIR}/code-${DATE}.tar.gz" \
  --exclude="$APP_DIR/.next" \
  --exclude="$APP_DIR/node_modules" \
  -C "$(dirname "$APP_DIR")" "$(basename "$APP_DIR")"
echo "  Code backup: ${BACKUP_DIR}/code-${DATE}.tar.gz"

# 2. Backup database
echo "[2/2] Backing up database..."
if [ -n "$DATABASE_URL" ]; then
  # Extract DB name from DATABASE_URL
  DB_NAME=$(echo "$DATABASE_URL" | sed 's/.*\///' | sed 's/?.*//')
  DB_USER=$(echo "$DATABASE_URL" | sed 's/.*:\/\///' | sed 's/:.*//')
  pg_dump -U "$DB_USER" "$DB_NAME" > "${BACKUP_DIR}/db-${DATE}.sql"
  gzip "${BACKUP_DIR}/db-${DATE}.sql"
  echo "  DB backup: ${BACKUP_DIR}/db-${DATE}.sql.gz"
else
  echo "  WARNING: DATABASE_URL not found, skipping DB backup."
fi

# 3. Remove backups older than 7 days
echo "Cleaning backups older than 7 days..."
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +7 -delete
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +7 -delete

echo ""
echo "Backup complete. Files in $BACKUP_DIR:"
ls -lh "$BACKUP_DIR" | tail -10
