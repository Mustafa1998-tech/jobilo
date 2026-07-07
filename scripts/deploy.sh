#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] DEPLOY STARTED"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Pulling latest from git..."
git checkout master
git pull origin master

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Building images..."
docker compose -f docker-compose.production.yml build

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting services..."
docker compose -f docker-compose.production.yml up -d

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Waiting for health checks..."
sleep 15

MAX_RETRIES=12
RETRY_INTERVAL=10
RETRIES=0

while [ $RETRIES -lt $MAX_RETRIES ]; do
  STATUS=$(docker compose -f docker-compose.production.yml ps --format json 2>/dev/null | \
    python -c "import sys,json; services=json.load(sys.stdin); print(' '.join(s.get('Health','') for s in (services if isinstance(services,list) else [services])))" 2>/dev/null || echo "")

  if echo "$STATUS" | grep -q "unhealthy"; then
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] DEPLOY FAILED: A service is unhealthy"
    docker compose -f docker-compose.production.yml logs --tail=50
    exit 1
  fi

  if echo "$STATUS" | grep -qv "healthy"; then
    RETRIES=$((RETRIES + 1))
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Waiting for services to become healthy... ($RETRIES/$MAX_RETRIES)"
    sleep "$RETRY_INTERVAL"
  else
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] DEPLOY SUCCESS: All services are healthy"
    docker compose -f docker-compose.production.yml ps
    exit 0
  fi
done

echo "[$(date '+%Y-%m-%d %H:%M:%S')] DEPLOY FAILED: Timed out waiting for health checks"
docker compose -f docker-compose.production.yml logs --tail=50
exit 1
