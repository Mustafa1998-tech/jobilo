#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="$PROJECT_ROOT/backups"
RETENTION_DAYS=7
TIMESTAMP="$(date +%Y-%m-%d_%H%M%S)"
DUMP_FILE="jobilo_${TIMESTAMP}.sql"
COMPRESSED_FILE="${DUMP_FILE}.gz"

mkdir -p "$BACKUP_DIR"

if [ -z "${POSTGRES_DB:-}" ] || [ -z "${POSTGRES_USER:-}" ] || [ -z "${POSTGRES_PASSWORD:-}" ]; then
  if [ -f "$PROJECT_ROOT/.env.production" ]; then
    set -a
    # shellcheck source=/dev/null
    . "$PROJECT_ROOT/.env.production"
    set +a
  else
    echo "ERROR: POSTGRES_DB, POSTGRES_USER, and POSTGRES_PASSWORD must be set or .env.production must exist"
    exit 1
  fi
fi

export PGPASSWORD="$POSTGRES_PASSWORD"

if ! pg_dump -h "${PGHOST:-localhost}" -p "${PGPORT:-5432}" -U "$POSTGRES_USER" -d "$POSTGRES_DB" \
  --no-owner --no-acl --format=custom > "$BACKUP_DIR/$DUMP_FILE" 2>/dev/null; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] BACKUP FAILED: pg_dump exited with code $?" >&2
  exit 1
fi

gzip -f "$BACKUP_DIR/$DUMP_FILE"
echo "[$(date '+%Y-%m-%d %H:%M:%S')] BACKUP SUCCESS: $COMPRESSED_FILE ($(du -h "$BACKUP_DIR/$COMPRESSED_FILE" | cut -f1))"

find "$BACKUP_DIR" -name "jobilo_*.sql.gz" -mtime +$RETENTION_DAYS -delete
