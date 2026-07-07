#!/usr/bin/env bash
set -euo pipefail

if [ $# -ne 1 ]; then
  echo "Usage: $0 <backup-file>"
  echo "Example: $0 backups/jobilo_2026-01-01_120000.sql.gz"
  exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "$BACKUP_FILE" ]; then
  echo "ERROR: File not found: $BACKUP_FILE"
  exit 1
fi

if [ -z "${POSTGRES_DB:-}" ] || [ -z "${POSTGRES_USER:-}" ] || [ -z "${POSTGRES_PASSWORD:-}" ]; then
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
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

echo "WARNING: This will OVERWRITE the database '$POSTGRES_DB'."
read -rp "Are you sure you want to continue? (yes/no): " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
  echo "Restore cancelled."
  exit 0
fi

export PGPASSWORD="$POSTGRES_PASSWORD"

if [[ "$BACKUP_FILE" == *.gz ]]; then
  gunzip -c "$BACKUP_FILE" | pg_restore -h "${PGHOST:-localhost}" -p "${PGPORT:-5432}" \
    -U "$POSTGRES_USER" -d "$POSTGRES_DB" --no-owner --no-acl --clean --if-exists
elif [[ "$BACKUP_FILE" == *.sql ]]; then
  psql -h "${PGHOST:-localhost}" -p "${PGPORT:-5432}" -U "$POSTGRES_USER" -d "$POSTGRES_DB" < "$BACKUP_FILE"
else
  echo "ERROR: Unrecognized backup format. Expected .sql or .sql.gz"
  exit 1
fi

echo "[$(date '+%Y-%m-%d %H:%M:%S')] RESTORE SUCCESS: $BACKUP_FILE"
