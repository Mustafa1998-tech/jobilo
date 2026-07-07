# Docker PostgreSQL Database Deployment

> Production-grade PostgreSQL 16 deployment using Docker for the Jobilo platform.

## Architecture

```mermaid
graph TB
    subgraph "Docker Host"
        subgraph "Internal Network (backend)"
            PG[("PostgreSQL 16 Alpine")]
            BC[Backend API]
        end
        subgraph "Volumes"
            PGDATA[(pgdata<br/>/var/lib/postgresql/data)]
            BACKUPS[(backups<br/>./backups)]
        end
        subgraph "Health Checks"
            HC1[pg_isready<br/>10s interval]
        end
    end

    BC -- TCP 5432 --> PG
    PG -- writes --> PGDATA
    PG -- backups --> BACKUPS
    HC1 -.-> PG
```

## PostgreSQL Container Setup

### Using Docker Compose (Recommended)

```yaml
# docker-compose.production.yml
services:
  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./backups:/backups
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s
    networks:
      - backend

volumes:
  pgdata:

networks:
  backend:
    internal: true
```

### Using Docker Run

```bash
docker run -d \
  --name jobilo-postgres \
  --network backend \
  --network-alias postgres \
  -v pgdata:/var/lib/postgresql/data \
  -v ./backups:/backups \
  -e POSTGRES_DB=jobilo \
  -e POSTGRES_USER=jobilo \
  -e POSTGRES_PASSWORD=<secure-password> \
  --health-cmd="pg_isready -U jobilo -d jobilo" \
  --health-interval=10s \
  --health-timeout=5s \
  --health-retries=5 \
  --health-start-period=30s \
  --restart unless-stopped \
  postgres:16-alpine
```

## Volume Management

| Volume | Container Path | Purpose | Size Estimate |
|--------|---------------|---------|--------------|
| `pgdata` | `/var/lib/postgresql/data` | Persistent database storage | 1-10 GB |
| `./backups` | `/backups` | Backup dump files | Varies |

### Volume Inspection

```bash
# List volumes
docker volume ls

# Inspect pgdata volume
docker volume inspect pgdata

# Check actual disk usage
docker run --rm -v pgdata:/data alpine du -sh /data

# Backup volume metadata
docker volume inspect pgdata --format '{{.Mountpoint}}'
```

## Environment Variables

| Variable | Description | Required | Default |
|----------|------------|----------|---------|
| `POSTGRES_DB` | Database name | Yes | `jobilo` |
| `POSTGRES_USER` | Database user | Yes | `jobilo` |
| `POSTGRES_PASSWORD` | Database password (64-char random) | Yes | — |
| `PGHOST` | Host override for scripts | No | `localhost` |
| `PGPORT` | Port override for scripts | No | `5432` |

## Network Configuration

```mermaid
flowchart LR
    subgraph "Internet"
        USER[Client Browser]
    end
    subgraph "Docker Internal Network (backend)"
        direction LR
        PG[PostgreSQL:5432]
        API[Backend API:4000]
    end
    USER -- HTTPS --> API
    API -- internal TCP --> PG
```

- PostgreSQL **must not** expose ports to the host (`ports:` omitted)
- Only services on the `backend` network can reach PostgreSQL
- Network is marked `internal: true` for maximum isolation
- Backend connects via `DATABASE_URL=postgresql://user:pass@postgres:5432/dbname`

## Health Checks

```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
  interval: 10s
  timeout: 5s
  retries: 5
  start_period: 30s
```

The backend service depends on PostgreSQL health:

```yaml
depends_on:
  postgres:
    condition: service_healthy
```

## Connection from Backend

The backend uses `DATABASE_URL` in Prisma:

```
DATABASE_URL=postgresql://jobilo:<password>@postgres:5432/jobilo
```

Connection flow:
1. Docker DNS resolves `postgres` hostname via internal network
2. Backend connects over TCP 5432
3. Prisma manages connection pooling and queries
4. `PGHOST` and `PGPORT` env vars used by backup/restore scripts

## Security Considerations

| Concern | Mitigation |
|---------|-----------|
| Public port exposure | No `ports:` mapping for postgres; `network: backend` + `internal: true` |
| Weak password | Generate with `openssl rand -hex 32` |
| Unencrypted traffic | Internal Docker network is isolated; TLS optional for external clients |
| Data at rest | Docker volume on encrypted filesystem |
| Container escape | Run as non-root user; use `postgres:16-alpine` minimal image |
| Backup exposure | `./backups` volume readable only by host; restrict permissions |

## Troubleshooting

### Connection Refused

```bash
# Is the container running?
docker ps --filter name=postgres

# Check container logs
docker logs jobilo-postgres --tail 50

# Verify network exists
docker network inspect backend

# Test connectivity from backend container
docker exec jobilo-backend -- sh -c "nc -zv postgres 5432"
```

### Authentication Failed

```bash
# Verify environment variables match
docker compose config | grep POSTGRES

# Check password in .env.production
grep POSTGRES_PASSWORD .env.production

# Reset password (if needed)
docker exec -it jobilo-postgres psql -U postgres -c "ALTER USER jobilo WITH PASSWORD 'new-password';"
```

### Disk Full

```bash
# Check volume disk usage
docker system df -v | grep pgdata

# Prune old backups
find ./backups -name "*.sql.gz" -mtime +7 -delete

# Vacuum database
docker exec jobilo-postgres psql -U jobilo -d jobilo -c "VACUUM ANALYZE;"

# Monitor disk inside container
docker exec jobilo-postgres df -h
```

### Slow Queries

```bash
# Check active queries
docker exec jobilo-postgres psql -U jobilo -d jobilo -c \
  "SELECT pid, now() - pg_stat_activity.query_start AS duration, query, state \
   FROM pg_stat_activity \
   WHERE state != 'idle' ORDER BY duration DESC;"

# Check for locks
docker exec jobilo-postgres psql -U jobilo -d jobilo -c \
  "SELECT blocked_locks.pid AS blocked_pid, blocking_locks.pid AS blocking_pid \
   FROM pg_catalog.pg_locks blocked_locks \
   JOIN pg_catalog.pg_locks blocking_locks ON blocked_locks.locktype = blocking_locks.locktype;"
```

---

**See also:**
- [POSTGRESQL_CONTAINER.md](./POSTGRESQL_CONTAINER.md) — Detailed container configuration
- [BACKUP_RESTORE.md](./BACKUP_RESTORE.md) — Backup and recovery procedures
- [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md) — All env vars reference
