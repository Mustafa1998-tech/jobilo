# Deployment Guide — دليل النشر

> **Jobilo Deployment**: Docker-based deployment for development, staging, and production environments.

---

## Prerequisites | المتطلبات الأساسية

### Required Software

| Software | الإصدار الأدنى | Minimum Version | Purpose |
|----------|---------------|-----------------|---------|
| **Docker** | 24.x | Container runtime |
| **Docker Compose** | 2.20+ | Multi-container orchestration |
| **Git** | 2.40+ | Source control |
| **Node.js** | 18.x (dev only) | Local development |
| **pnpm** | 8.x (dev only) | Package management |
| **Make** | Optional | Automation scripts |

### Hardware Requirements

| Environment | CPU | RAM | Storage | Notes |
|-------------|-----|-----|---------|-------|
| **Development** | 2 cores | 4 GB | 20 GB | Local Docker, single developer |
| **Staging** | 4 cores | 8 GB | 50 GB | 1 API + 1 Web + DB + Redis |
| **Production (start)** | 8 cores | 16 GB | 100 GB | 2 API + 2 Web + DB + Redis + MinIO |
| **Production (scale)** | 16+ cores | 32+ GB | 200+ GB | Auto-scaling, multiple replicas |

---

## Environment Configuration | إعداد البيئة

### Environment Files

| File | Environment | Purpose |
|------|-------------|---------|
| `.env.example` | Template | Documented example with defaults |
| `.env.local` | Development | Local overrides (gitignored) |
| `.env.staging` | Staging | Staging environment settings |
| `.env.production` | Production | Production environment settings |

### Required Environment Variables

```bash
# === Application ===
NODE_ENV=production
APP_NAME=Jobilo
APP_URL=https://jobilo.ai
API_URL=https://api.jobilo.ai

# === Database ===
DATABASE_URL=postgresql://jobilo:password@postgres:5432/jobilo?schema=public
POSTGRES_USER=jobilo
POSTGRES_PASSWORD=<secure-password-here>
POSTGRES_DB=jobilo

# === Redis ===
REDIS_URL=redis://redis:6379

# === JWT ===
JWT_ACCESS_SECRET=<rsa-private-key-or-secret>
JWT_REFRESH_SECRET=<different-secret>
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# === File Storage (MinIO / S3) ===
STORAGE_ENDPOINT=minio:9000
STORAGE_ACCESS_KEY=minioadmin
STORAGE_SECRET_KEY=<secure-key>
STORAGE_BUCKET=jobilo-uploads
STORAGE_REGION=us-east-1

# === Email (SendGrid) ===
SENDGRID_API_KEY=<sendgrid-api-key>
EMAIL_FROM=noreply@jobilo.ai

# === Rate Limiting ===
THROTTLE_TTL=60
THROTTLE_LIMIT=100

# === CORS ===
CORS_ORIGINS=https://jobilo.ai,https://www.jobilo.ai

# === Monitoring ===
SENTRY_DSN=<sentry-dsn>  # Optional
PROMETHEUS_ENABLED=true
```

### Secrets Management

For production, use Docker secrets or a secrets manager:

```bash
# Option 1: Docker secrets (recommended for single-host)
echo "my-secret-password" | docker secret create db_password -

# Option 2: HashiCorp Vault (recommended for multi-host)
vault kv put jobilo/production/database PASSWORD=my-secret-password

# Option 3: Environment file (basic, less secure)
# .env.production (ensure proper file permissions: chmod 600)
```

---

## Docker Deployment | النشر باستخدام Docker

### Production Docker Compose

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./docker/nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./docker/nginx/sites:/etc/nginx/sites-enabled
      - ./apps/web/public:/var/www/public
      - certbot-etc:/etc/letsencrypt
    depends_on:
      - web
      - api
    networks:
      - jobilo-network

  web:
    image: ghcr.io/jobilo/jobilo-web:${TAG:-latest}
    build:
      context: .
      dockerfile: docker/web/Dockerfile
      args:
        NODE_ENV: production
    env_file:
      - .env.production
    environment:
      - PORT=3000
    expose:
      - "3000"
    depends_on:
      - api
    restart: unless-stopped
    networks:
      - jobilo-network

  api:
    image: ghcr.io/jobilo/jobilo-api:${TAG:-latest}
    build:
      context: .
      dockerfile: docker/api/Dockerfile
      args:
        NODE_ENV: production
    env_file:
      - .env.production
    environment:
      - PORT=4000
    expose:
      - "4000"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
      minio:
        condition: service_started
    restart: unless-stopped
    networks:
      - jobilo-network

  worker:
    image: ghcr.io/jobilo/jobilo-worker:${TAG:-latest}
    build:
      context: .
      dockerfile: docker/worker/Dockerfile
    env_file:
      - .env.production
    depends_on:
      - postgres
      - redis
    restart: unless-stopped
    networks:
      - jobilo-network

  postgres:
    image: postgres:16-alpine
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./docker/postgres/init.sql:/docker-entrypoint-initdb.d/init.sql
    env_file:
      - .env.production
    environment:
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=${POSTGRES_DB}
    expose:
      - "5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped
    networks:
      - jobilo-network

  redis:
    image: redis:7-alpine
    volumes:
      - redis-data:/data
    expose:
      - "6379"
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD:-}
    restart: unless-stopped
    networks:
      - jobilo-network

  minio:
    image: minio/minio
    volumes:
      - minio-data:/data
    env_file:
      - .env.production
    expose:
      - "9000"
      - "9001"
    command: server /data --console-address ":9001"
    restart: unless-stopped
    networks:
      - jobilo-network

  prometheus:
    image: prom/prometheus
    volumes:
      - ./docker/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus
    expose:
      - "9090"
    networks:
      - jobilo-network

  grafana:
    image: grafana/grafana
    volumes:
      - grafana-data:/var/lib/grafana
    expose:
      - "3000"
    depends_on:
      - prometheus
    networks:
      - jobilo-network

volumes:
  postgres-data:
  redis-data:
  minio-data:
  prometheus-data:
  grafana-data:
  certbot-etc:

networks:
  jobilo-network:
    driver: bridge
```

### Deployment Steps

```bash
# 1. Clone the repository
git clone https://github.com/jobilo/jobilo.git
cd jobilo

# 2. Configure environment
cp .env.example .env.production
# Edit .env.production with production values
# IMPORTANT: Use secure passwords and secrets

# 3. Run database migrations
docker compose -f docker-compose.prod.yml run --rm api npx prisma migrate deploy

# 4. Build and start all services
docker compose -f docker-compose.prod.yml up -d --build

# 5. Verify deployment
docker compose -f docker-compose.prod.yml ps
curl https://api.jobilo.ai/api/health

# 6. View logs
docker compose -f docker-compose.prod.yml logs -f api
docker compose -f docker-compose.prod.yml logs -f web
```

### Dockerfile Examples

```dockerfile
# docker/api/Dockerfile
FROM node:20-alpine AS base
RUN npm install -g pnpm

FROM base AS deps
WORKDIR /app
COPY pnpm-lock.yaml ./
COPY package.json ./
RUN pnpm fetch --prod

FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build --filter=api

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 jobilo && \
    adduser --system --uid 1001 jobilo
COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/apps/api/package.json ./
COPY --from=build /app/node_modules ./node_modules
USER jobilo
EXPOSE 4000
CMD ["node", "dist/main"]
```

```dockerfile
# docker/web/Dockerfile
FROM node:20-alpine AS base
RUN npm install -g pnpm

FROM base AS deps
WORKDIR /app
COPY pnpm-lock.yaml ./
COPY package.json ./
RUN pnpm fetch --prod

FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build --filter=web

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 jobilo && \
    adduser --system --uid 1001 jobilo
COPY --from=build /app/apps/web/.next/standalone ./
COPY --from=build /app/apps/web/public ./apps/web/public
COPY --from=build /app/apps/web/.next/static ./apps/web/.next/static
USER jobilo
EXPOSE 3000
CMD ["node", "apps/web/server.js"]
```

---

## Manual Deployment | النشر اليدوي

For environments where Docker is not available, you can deploy manually:

### Prerequisites

```bash
# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
npm install -g pnpm

# Install PostgreSQL 16
sudo apt-get install postgresql-16

# Install Redis 7
sudo apt-get install redis-server

# Install MinIO (optional, for file storage)
wget https://dl.min.io/server/minio/release/linux-amd64/minio
chmod +x minio
sudo mv minio /usr/local/bin/
```

### Manual Steps

```bash
# 1. Clone and install
git clone https://github.com/jobilo/jobilo.git
cd jobilo
pnpm install

# 2. Build
pnpm build

# 3. Run database migrations
cd apps/api
npx prisma migrate deploy
cd ../..

# 4. Start API (use PM2 for process management)
npm install -g pm2
pm2 start apps/api/dist/main.js --name jobilo-api

# 5. Start Web
pm2 start pnpm --name jobilo-web -- start --filter=web

# 6. Start Worker
pm2 start apps/api/dist/worker.js --name jobilo-worker

# 7. Save PM2 process list
pm2 save
pm2 startup
```

### Nginx Configuration

```nginx
# /etc/nginx/sites-available/jobilo
upstream jobilo-web {
    server 127.0.0.1:3000;
    keepalive 64;
}

upstream jobilo-api {
    server 127.0.0.1:4000;
    keepalive 64;
}

server {
    listen 80;
    server_name jobilo.ai www.jobilo.ai;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name jobilo.ai www.jobilo.ai;

    ssl_certificate /etc/letsencrypt/live/jobilo.ai/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/jobilo.ai/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Web app
    location / {
        proxy_pass http://jobilo-web;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API
    location /api/ {
        proxy_pass http://jobilo-api;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket
    location /ws/ {
        proxy_pass http://jobilo-api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_read_timeout 86400;
    }

    # Static files (MinIO)
    location /uploads/ {
        proxy_pass http://127.0.0.1:9000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## Database Migrations | ترحيلات قاعدة البيانات

### Migration Commands

```bash
# Development
pnpm prisma:migrate --name add_user_profile
pnpm prisma:push

# Production
docker compose -f docker-compose.prod.yml run --rm api npx prisma migrate deploy

# Rollback (last migration)
docker compose -f docker-compose.prod.yml run --rm api npx prisma migrate resolve --rolled-back "migration_name"
```

### Migration Best Practices

1. **Always test migrations on staging first**
2. **Back up the database before production migrations**
3. **Use `prisma migrate deploy` (not `prisma db push`) for production**
4. **Write down migrations for data backfills**
5. **Monitor migration execution time (aim for < 30s)**

### Database Backup

```bash
# Manual backup
docker exec jobilo-postgres-1 pg_dump -U jobilo jobilo > backup_$(date +%Y%m%d_%H%M%S).sql

# Automated backup (cron)
0 2 * * * docker exec jobilo-postgres-1 pg_dump -U jobilo jobilo | gzip > /backups/jobilo_$(date +\%Y\%m\%d).sql.gz

# Restore
gunzip < /backups/jobilo_20260706.sql.gz | docker exec -i jobilo-postgres-1 psql -U jobilo jobilo
```

---

## Health Checks | فحوصات الصحة

### Endpoint Health

```bash
# Basic health check
curl https://api.jobilo.ai/api/health
# Response: { "status": "ok", "timestamp": "2026-07-06T12:00:00.000Z" }

# Readiness check (includes DB, Redis, MinIO)
curl https://api.jobilo.ai/api/health/readiness
# Response: { "status": "ok", "checks": { "database": "ok", "redis": "ok", "storage": "ok" } }

# Liveness check
curl https://api.jobilo.ai/api/health/liveness
# Response: { "status": "ok" }
```

### Docker Health Check

```yaml
# In docker-compose.prod.yml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:4000/api/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

---

## Monitoring Setup | إعداد المراقبة

### Prometheus Configuration

```yaml
# docker/prometheus/prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'jobilo-api'
    static_configs:
      - targets: ['api:4000']
    metrics_path: '/api/metrics'

  - job_name: 'jobilo-web'
    static_configs:
      - targets: ['web:3000']
    metrics_path: '/api/metrics'

  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres-exporter:9187']

  - job_name: 'node'
    static_configs:
      - targets: ['node-exporter:9100']
```

### Grafana Dashboards

Pre-built dashboards are available in `docker/grafana/dashboards/`:

| Dashboard | Description |
|-----------|-------------|
| `jobilo-api.json` | API request rate, latency, error rate, endpoints |
| `jobilo-database.json` | DB connections, query performance, cache hit ratio |
| `jobilo-infrastructure.json` | CPU, memory, disk, network per container |
| `jobilo-business.json` | Active users, projects created, proposals submitted |

---

## Rollback Procedures | إجراءات التراجع

### Docker Rollback

```bash
# Option 1: Rollback to previous image tag
docker compose -f docker-compose.prod.yml up -d --no-deps api=ghcr.io/jobilo/jobilo-api:v1.0.0

# Option 2: Rollback entire stack
docker compose -f docker-compose.prod.yml down
git checkout v1.0.0
docker compose -f docker-compose.prod.yml up -d --build

# Option 3: Quick rollback (reuse previous containers)
docker compose -f docker-compose.prod.yml pull api:previous-tag
docker compose -f docker-compose.prod.yml up -d --no-deps api
```

### Database Rollback

```bash
# 1. Restore from backup
docker exec -i jobilo-postgres-1 psql -U jobilo -d jobilo < backup_before_migration.sql

# 2. Rollback Prisma migration
docker compose run --rm api npx prisma migrate resolve --rolled-back "migration_name"

# 3. Verify rollback
docker compose run --rm api npx prisma migrate status
```

### Rollback Checklist

- [ ] Identify the issue and affected component(s)
- [ ] Notify users via status page if service is impacted
- [ ] If database migration was involved, restore from backup first
- [ ] Rollback application code to previous stable version
- [ ] Verify all health checks pass after rollback
- [ ] Run smoke tests on critical paths
- [ ] Create a hotfix for the issue (see [Contributing Guide](../CONTRIBUTING.md))
- [ ] Document the incident in post-mortem report

---

## CI/CD Pipeline | خط أنابيب التكامل والنشر المستمر

```mermaid
flowchart LR
    A[Git Push] --> B[GitHub Actions]
    B --> C{Lint & Typecheck}
    C -->|Fail| D[Fix Code]
    D --> A
    C -->|Pass| E{Run Tests}
    E -->|Fail| D
    E -->|Pass| F[Build Docker Images]
    F --> G[Push to Registry]
    G --> H[Deploy to Staging]
    H --> I{Smoke Tests}
    I -->|Fail| D
    I -->|Pass| J[Deploy to Production]
    J --> K[Post-Deploy Monitoring]
```

### CI/CD Configuration

```yaml
# .github/workflows/deploy.yml
name: Deploy Jobilo

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Build Docker images
        run: |
          docker build -f docker/api/Dockerfile -t ghcr.io/jobilo/jobilo-api:${{ github.sha }} .
          docker build -f docker/web/Dockerfile -t ghcr.io/jobilo/jobilo-web:${{ github.sha }} .
      - name: Push to registry
        run: |
          echo "${{ secrets.GITHUB_TOKEN }}" | docker login ghcr.io -u ${{ github.actor }} --password-stdin
          docker push ghcr.io/jobilo/jobilo-api:${{ github.sha }}
          docker push ghcr.io/jobilo/jobilo-web:${{ github.sha }}
      - name: Deploy to production
        run: |
          ssh deploy@${{ secrets.DEPLOY_HOST }} 'cd /opt/jobilo && \
            docker compose pull && \
            docker compose up -d --no-deps api web'
```

---

## Links | روابط ذات صلة

- [Architecture](ARCHITECTURE.md) — System architecture and Docker configuration
- [Security](SECURITY.md) — Security configuration for deployment
- [System Design](SYSTEM_DESIGN.md) — Component interactions and monitoring
- [README.md](../README.md) — Main project readme with getting started
