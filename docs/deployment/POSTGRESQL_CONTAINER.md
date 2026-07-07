# PostgreSQL Container Detailed Guide

> Comprehensive configuration and management guide for the Jobilo PostgreSQL 16 container.

## Container Creation

### Docker Run

```bash
docker run -d \
  --name jobilo-postgres \
  --restart unless-stopped \
  --network backend \
  --network-alias postgres \
  -v pgdata:/var/lib/postgresql/data \
  -v ./backups:/backups \
  -e POSTGRES_DB=jobilo \
  -e POSTGRES_USER=jobilo \
  -e POSTGRES_PASSWORD=$(openssl rand -hex 32) \
  -e POSTGRES_INITDB_ARGS="--data-checksums" \
  --health-cmd="pg_isready -U jobilo -d jobilo" \
  --health-interval=10s \
  --health-timeout=5s \
  --health-retries=5 \
  --health-start-period=30s \
  postgres:16-alpine \
  -c shared_buffers=256MB \
  -c max_connections=50 \
  -c work_mem=16MB \
  -c effective_cache_size=1GB
```

### Docker Compose

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: jobilo-postgres
    restart: unless-stopped
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./backups:/backups
      - ./docker/postgres/init:/docker-entrypoint-initdb.d
    environment:
      POSTGRES_DB: jobilo
      POSTGRES_USER: jobilo
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_INITDB_ARGS: "--data-checksums --auth=scram-sha-256"
      TZ: UTC
    command:
      - "postgres"
      - "-c"
      - "shared_buffers=256MB"
      - "-c"
      - "max_connections=50"
      - "-c"
      - "work_mem=16MB"
      - "-c"
      - "effective_cache_size=1GB"
      - "-c"
      - "log_min_duration_statement=1000"
      - "-c"
      - "log_line_prefix=%t [%p]: [%l-1] user=%u,db=%d "
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U jobilo -d jobilo"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s
    networks:
      - backend

networks:
  backend:
    internal: true

volumes:
  pgdata:
```

## Volume Setup and Verification

```bash
# Create the volume explicitly
docker volume create pgdata

# Inspect volume details
docker volume inspect pgdata
# Output:
# {
#   "CreatedAt": "2026-07-07T12:00:00Z",
#   "Driver": "local",
#   "Mountpoint": "/var/lib/docker/volumes/pgdata/_data",
#   "Name": "pgdata",
#   "Options": {},
#   "Scope": "local"
# }

# Check data directory contents
sudo ls -la /var/lib/docker/volumes/pgdata/_data

# Verify PostgreSQL data files
docker exec jobilo-postgres ls -la /var/lib/postgresql/data

# Check volume disk usage
docker run --rm -v pgdata:/data alpine du -sh /data
```

## Database Initialization

Place SQL scripts in `./docker/postgres/init/` to run on first startup:

```sql
-- ./docker/postgres/init/01-extensions.sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- ./docker/postgres/init/02-create-schemas.sql
CREATE SCHEMA IF NOT EXISTS jobilo;
```

Prisma migrations are then applied by the backend:

```bash
npx prisma migrate deploy
npx prisma db seed
```

## User and Permission Management

```sql
-- Create application user (if not using POSTGRES_USER)
CREATE USER jobilo_app WITH PASSWORD '<secure-password>' LOGIN;
GRANT CONNECT ON DATABASE jobilo TO jobilo_app;
GRANT USAGE ON SCHEMA public TO jobilo_app;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO jobilo_app;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO jobilo_app;

-- Create readonly user for monitoring
CREATE USER jobilo_readonly WITH PASSWORD '<password>' LOGIN;
GRANT CONNECT ON DATABASE jobilo TO jobilo_readonly;
GRANT USAGE ON SCHEMA public TO jobilo_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO jobilo_readonly;

-- Revoke public schema permissions
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON DATABASE jobilo FROM PUBLIC;
```

## Connection Pooling with PgBouncer (Optional)

```yaml
services:
  pgbouncer:
    image: edoburu/pgbouncer:latest
    restart: unless-stopped
    environment:
      DATABASE_URL: postgres://jobilo:${POSTGRES_PASSWORD}@postgres:5432/jobilo
      POOL_MODE: transaction
      MAX_CLIENT_CONN: 100
      DEFAULT_POOL_SIZE: 25
      MIN_POOL_SIZE: 5
      RESERVE_POOL_SIZE: 5
    ports:
      - "5432"  # internal only
    networks:
      - backend
    depends_on:
      postgres:
        condition: service_healthy
```

Update `DATABASE_URL` to point to PgBouncer:

```
DATABASE_URL=postgresql://jobilo:<password>@pgbouncer:5432/jobilo
```

## Performance Tuning

| Parameter | Value | Description | When to Tune |
|-----------|-------|-------------|-------------|
| `shared_buffers` | 256 MB (25% of RAM) | Memory for caching data | On deploy, scale with RAM |
| `max_connections` | 50 | Max concurrent connections | Match application concurrency |
| `work_mem` | 16 MB | Per-sort/hash memory | Increase for complex queries |
| `effective_cache_size` | 1 GB | OS cache estimate | Set to ~50% of total RAM |
| `maintenance_work_mem` | 64 MB | VACUUM/INDEX memory | Increase for large tables |
| `random_page_cost` | 1.1 | SSD-optimized | Set to 1.1 for SSDs, 4.0 for HDDs |
| `effective_io_concurrency` | 200 | Parallel I/O | Set to 200 for SSDs |

### Apply via container command:

```yaml
command:
  - "postgres"
  - "-c"
  - "shared_buffers=256MB"
  - "-c"
  - "max_connections=50"
  - "-c"
  - "work_mem=16MB"
  - "-c"
  - "effective_cache_size=1GB"
```

## SSL/TLS Configuration

Generate certificates and mount them:

```bash
# Generate self-signed cert (or use Let's Encrypt)
openssl req -new -text -nodes -subj "/CN=postgres" -out server.req
openssl rsa -in privkey.pem -out server.key
openssl req -x509 -in server.req -text -key server.key -out server.crt
chmod 600 server.key server.crt
```

Mount and configure:

```yaml
volumes:
  - ./docker/postgres/certs:/etc/postgresql/certs:ro
command:
  - "-c"
  - "ssl=on"
  - "-c"
  - "ssl_cert_file=/etc/postgresql/certs/server.crt"
  - "-c"
  - "ssl_key_file=/etc/postgresql/certs/server.key"
```

## Logging Configuration

```ini
# Log settings (passed via command)
log_min_duration_statement = 1000    # Log queries > 1s
log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d '
log_checkpoints = on
log_connections = on
log_disconnections = on
log_lock_waits = on
log_temp_files = 0
log_autovacuum_min_duration = 0
```

View logs via Docker:

```bash
# Tail PostgreSQL logs
docker logs jobilo-postgres --tail 100 -f

# Filter slow queries
docker logs jobilo-postgres 2>&1 | grep "duration:" | head -20

# Persist logs to file
docker logs jobilo-postgres > postgresql.log 2>&1
```

## Monitoring Queries

### Active Sessions

```sql
SELECT pid, usename, application_name, client_addr, state,
       now() - query_start AS duration,
       LEFT(query, 100) AS query_preview
FROM pg_stat_activity
WHERE state != 'idle'
  AND pid <> pg_backend_pid()
ORDER BY duration DESC;
```

### Lock Analysis

```sql
SELECT blocked_locks.pid     AS blocked_pid,
       blocked_activity.usename AS blocked_user,
       blocking_locks.pid     AS blocking_pid,
       blocking_activity.usename AS blocking_user,
       blocked_activity.query    AS blocked_statement,
       blocking_activity.query   AS blocking_statement
FROM pg_catalog.pg_locks blocked_locks
JOIN pg_catalog.pg_stat_activity blocked_activity ON blocked_activity.pid = blocked_locks.pid
JOIN pg_catalog.pg_locks blocking_locks
    ON blocking_locks.locktype = blocked_locks.locktype
    AND blocking_locks.database = blocked_locks.database
    AND blocking_locks.relation = blocked_locks.relation
    AND blocking_locks.page = blocked_locks.page
    AND blocking_locks.tuple = blocked_locks.tuple
    AND blocking_locks.virtualxid = blocked_locks.virtualxid
    AND blocking_locks.transactionid = blocked_locks.transactionid
    AND blocking_locks.classid = blocked_locks.classid
    AND blocking_locks.objid = blocked_locks.objid
    AND blocking_locks.objsubid = blocked_locks.objsubid
    AND blocking_locks.pid != blocked_locks.pid
JOIN pg_catalog.pg_stat_activity blocking_activity ON blocking_activity.pid = blocking_locks.pid
WHERE NOT blocked_locks.granted;
```

### Table Size

```sql
SELECT relname AS table_name,
       pg_size_pretty(pg_total_relation_size(relid)) AS total_size,
       pg_size_pretty(pg_relation_size(relid)) AS table_size,
       pg_size_pretty(pg_total_relation_size(relid) - pg_relation_size(relid)) AS index_size,
       n_live_tup AS row_count
FROM pg_catalog.pg_statio_user_tables
ORDER BY pg_total_relation_size(relid) DESC;
```

### Database Statistics

```sql
SELECT datname, numbackends, xact_commit, xact_rollback,
       blks_read, blks_hit,
       round(blks_hit * 100.0 / NULLIF(blks_hit + blks_read, 0), 2) AS cache_hit_ratio,
       temp_files, temp_bytes
FROM pg_catalog.pg_stat_database
WHERE datname = 'jobilo';
```

## Backup Commands

### Full Database Dump (custom format)

```bash
pg_dump -h localhost -U jobilo -d jobilo \
  --no-owner --no-acl \
  --format=custom \
  -f backups/jobilo_$(date +%Y%m%d_%H%M%S).dump
```

### Compressed SQL Dump

```bash
pg_dump -h localhost -U jobilo -d jobilo \
  --no-owner --no-acl \
  --format=plain \
  | gzip > backups/jobilo_$(date +%Y%m%d_%H%M%S).sql.gz
```

### Schema-Only Dump

```bash
pg_dump -h localhost -U jobilo -d jobilo \
  --schema-only \
  -f backups/jobilo_schema.sql
```

### Data-Only Dump

```bash
pg_dump -h localhost -U jobilo -d jobilo \
  --data-only --exclude-table=migrations \
  --format=custom \
  -f backups/jobilo_data.dump
```

### Restore

```bash
# Custom format restore
pg_restore -h localhost -U jobilo -d jobilo \
  --clean --if-exists --no-owner --no-acl \
  backups/jobilo_20260707_120000.dump

# SQL restore
gunzip -c backups/jobilo_20260707_120000.sql.gz | \
  psql -h localhost -U jobilo -d jobilo
```

---

**See also:**
- [DOCKER_DATABASE.md](./DOCKER_DATABASE.md) — Container setup overview
- [BACKUP_RESTORE.md](./BACKUP_RESTORE.md) — Automated backup/restore procedures
- [PRODUCTION_DEPLOYMENT.md](./PRODUCTION_DEPLOYMENT.md) — Full deployment workflow
