#!/bin/bash
# ============================================================
# rollback.sh — Roll back to a previous backup
# Usage: bash scripts/rollback.sh <backup-date>
# Example: bash scripts/rollback.sh 20260222-143000
#
# Run on PROD server only.
# ============================================================
set -e

APP_NAME="desarrollopersonal-prod"
APP_DIR="/var/www/desarrollopersonal"
BACKUP_BASE="/var/backups/desarrollopersonal"
DATE_TAG="$1"

if [ -z "$DATE_TAG" ]; then
  echo "Usage: bash scripts/rollback.sh <backup-date>"
  echo ""
  echo "Available backups:"
  ls -lh "$BACKUP_BASE"/*.tar.gz 2>/dev/null || echo "  No code backups found in $BACKUP_BASE"
  exit 1
fi

CODE_BACKUP="${BACKUP_BASE}/code-${DATE_TAG}.tar.gz"
DB_BACKUP="${BACKUP_BASE}/db-${DATE_TAG}.sql.gz"

echo "======================================================"
echo "  ROLLBACK — DesarrolloPersonal.uno"
echo "  Target backup: $DATE_TAG"
echo "======================================================"
echo ""
echo "WARNING: This will replace the current production code."
if [ -f "$DB_BACKUP" ]; then
  echo "WARNING: A database backup was found. Restore it? (restoring may cause data loss)"
fi
read -r -p "  Type 'yes' to continue: " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
  echo "Rollback cancelled."
  exit 0
fi

# 1. Stop the application
echo "[1/4] Stopping $APP_NAME..."
pm2 stop "$APP_NAME"

# 2. Restore code
echo "[2/4] Restoring code from $CODE_BACKUP..."
if [ ! -f "$CODE_BACKUP" ]; then
  echo "ERROR: Code backup not found: $CODE_BACKUP"
  pm2 start "$APP_NAME"
  exit 1
fi
rm -rf "$APP_DIR"
tar -xzf "$CODE_BACKUP" -C "$(dirname "$APP_DIR")"
echo "  Code restored."

# 3. Restore database (optional)
if [ -f "$DB_BACKUP" ]; then
  read -r -p "  Restore database from $DB_BACKUP? (yes/no): " RESTORE_DB
  if [ "$RESTORE_DB" = "yes" ]; then
    echo "[3/4] Restoring database..."
    if [ -f "$APP_DIR/.env" ]; then
      export $(grep -v '^#' "$APP_DIR/.env" | xargs)
    fi
    DB_NAME=$(echo "$DATABASE_URL" | sed 's/.*\///' | sed 's/?.*//')
    DB_USER=$(echo "$DATABASE_URL" | sed 's/.*:\/\///' | sed 's/:.*//')
    gunzip -c "$DB_BACKUP" | psql -U "$DB_USER" "$DB_NAME"
    echo "  Database restored."
  else
    echo "[3/4] Skipping database restore."
  fi
else
  echo "[3/4] No database backup found for this date, skipping."
fi

# 4. Restart the application
echo "[4/4] Starting $APP_NAME..."
cd "$APP_DIR"
pm2 start "$APP_NAME"
pm2 save

echo ""
echo "======================================================"
echo "  Rollback to $DATE_TAG completed!"
echo "  Verify: https://desarrollopersonal.uno"
echo "======================================================"
pm2 logs "$APP_NAME" --lines 15 --nostream
