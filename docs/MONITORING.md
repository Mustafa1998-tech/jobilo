# Monitoring Guide

> **Version:** 1.0 | **Last Updated:** 2026-07-06 | **Applies to:** All Environments (Production, Staging)

## Table of Contents

1. [Application Metrics](#application-metrics)
2. [Server Metrics](#server-metrics)
3. [Database Metrics](#database-metrics)
4. [Uptime Monitoring](#uptime-monitoring)
5. [Alerting Thresholds](#alerting-thresholds)
6. [Dashboard Setup](#dashboard-setup)
7. [Incident Response Plan](#incident-response-plan)
8. [Tools](#tools)

---

## Application Metrics

### Key Performance Indicators

| Metric | Description | Target | Critical |
|--------|-------------|--------|----------|
| **Response Time (p50)** | Median API response time | < 200ms | > 500ms |
| **Response Time (p95)** | 95th percentile response time | < 500ms | > 2s |
| **Response Time (p99)** | 99th percentile response time | < 1s | > 5s |
| **Error Rate** | Percentage of 5xx responses | < 0.1% | > 1% |
| **Request Rate** | Requests per second | — | — |
| **Active Users** | Concurrent active sessions | — | — |
| **API Availability** | Uptime of API endpoints | > 99.9% | < 99% |

### Application Metrics to Collect

| Metric Name | Type | Labels | Description |
|-------------|------|--------|-------------|
| `http_requests_total` | Counter | method, path, status, env | Total HTTP requests |
| `http_request_duration_ms` | Histogram | method, path, env | Request duration buckets |
| `http_requests_in_flight` | Gauge | method, env | Current requests being processed |
| `user_registrations_total` | Counter | role, env | New user registrations |
| `project_creations_total` | Counter | category, env | New projects created |
| `proposal_submissions_total` | Counter | project_id, env | Proposal submissions |
| `payment_transactions_total` | Counter | status, currency, env | Payment transactions |
| `auth_login_attempts_total` | Counter | success, method, env | Login attempts |
| `active_connections` | Gauge | service, env | WebSocket connections |
| `job_queue_size` | Gauge | queue_name, env | Background job queue size |
| `cache_hit_ratio` | Gauge | cache_name, env | Cache hit rate |

### Prometheus Metrics Endpoint

```ts
// backend/src/common/metrics/metrics.controller.ts
@Controller('metrics')
export class MetricsController {
  @Get()
  @SkipAuth() // Exposed without auth for Prometheus scraping
  getMetrics(): Promise<string> {
    return this.metricsService.getMetrics()
  }
}
```

### Metric Registration

```ts
// backend/src/common/metrics/metrics.service.ts
import { Injectable } from '@nestjs/common'
import { Counter, Histogram, Gauge, Registry } from 'prom-client'

@Injectable()
export class MetricsService {
  private readonly registry: Registry

  constructor() {
    this.registry = new Registry()

    new Counter({
      name: 'http_requests_total',
      help: 'Total HTTP requests',
      labelNames: ['method', 'path', 'status_code'],
      registers: [this.registry],
    })

    new Histogram({
      name: 'http_request_duration_ms',
      help: 'HTTP request duration in ms',
      labelNames: ['method', 'path'],
      buckets: [10, 50, 100, 200, 500, 1000, 2000, 5000],
      registers: [this.registry],
    })
  }

  getMetrics(): Promise<string> {
    return this.registry.metrics()
  }
}
```

---

## Server Metrics

### Infrastructure Monitoring

| Metric | Warning Threshold | Critical Threshold |
|--------|------------------|-------------------|
| CPU Usage | > 70% for 5 min | > 90% for 2 min |
| Memory Usage | > 75% | > 90% |
| Disk Usage | > 80% | > 95% |
| Disk IOPS | > 80% of limit | > 95% of limit |
| Network In/Out | — | — |
| TCP Connections | > 80% of max | > 95% of max |
| Swap Usage | > 10% | > 30% |
| Load Average | > 2× CPU cores | > 4× CPU cores |

### Node.js Process Metrics

| Metric | Warning | Critical |
|--------|---------|----------|
| Heap Used | > 200MB | > 400MB |
| Heap Total | > 500MB | > 1GB |
| Event Loop Lag | > 50ms | > 200ms |
| GC Pause Duration | — | > 500ms |
| File Descriptors | > 70% of limit | > 90% of limit |

### Prometheus Node Exporter

```
# Node exporter metrics collected from each server
node_cpu_seconds_total
node_memory_MemAvailable_bytes
node_filesystem_avail_bytes
node_network_receive_bytes_total
node_load1 / node_load5 / node_load15
```

---

## Database Metrics

### PostgreSQL Monitoring

| Metric | Warning | Critical | Query |
|--------|---------|----------|-------|
| Connection Count | > 80% of max_connections | > 95% of max_connections | `SELECT count(*) FROM pg_stat_activity` |
| Active Queries | > 50 | > 100 | `SELECT count(*) FROM pg_stat_activity WHERE state = 'active'` |
| Slow Queries (>1s) | > 5/min | > 20/min | `SELECT * FROM pg_stat_activity WHERE state = 'active' AND now() - query_start > interval '1 second'` |
| Deadlocks | > 0 | > 5/hour | `SELECT * FROM pg_stat_database WHERE datname = 'jobilo'` |
| Cache Hit Ratio | < 95% | < 90% | `SELECT heap_blks_hit / (heap_blks_hit + heap_blks_read) * 100` |
| Transaction ID Wraparound | < 100M remaining | < 50M remaining | `SELECT age(datfrozenxid) FROM pg_database` |
| Replication Lag | > 10s | > 30s | `SELECT pg_wal_lsn_diff(pg_current_wal_lsn(), replay_lsn)` |
| Table Bloat | > 20% | > 40% | pgstattuple extension |

### Slow Query Logging

```ts
// TypeORM slow query threshold
{
  type: 'postgres',
  logging: ['warn', 'error'],
  maxQueryExecutionTime: 1000, // Log queries taking > 1 second
}
```

### Database Health Check Endpoint

```
GET /api/health/database
Response: { "status": "healthy", "connectionPool": 5, "maxConnections": 100, "responseTimeMs": 3 }
```

---

## Uptime Monitoring

### External Uptime Checks

| Check | URL | Frequency | Expected Status |
|-------|-----|-----------|-----------------|
| API Health | `https://api.jobilo.com/health` | 30s | 200 |
| Web App | `https://app.jobilo.com` | 60s | 200 |
| Landing Page | `https://jobilo.com` | 60s | 200 |
| Auth Flow | `POST https://api.jobilo.com/auth/login` | 5 min | 200/401 |
| Critical API | `GET https://api.jobilo.com/api/projects` | 60s | 200 |

### Synthetic Monitoring

| Scenario | Script | Frequency |
|----------|--------|-----------|
| User registration flow | Register → Verify → Login | 15 min |
| Project creation + proposal | Create project → Submit proposal | 15 min |
| Payment flow | Create transaction → Process → Confirm | 30 min |
| Search + filter | Search → Apply filters → Sort results | 15 min |

### Status Page

- Public status: `status.jobilo.com`
- Managed via [Upptime](https://github.com/upptime/upptime) or similar
- Reports: API availability, response time, incident history

---

## Alerting Thresholds

### Alert Severity Levels

| Level | Color | Response Time | Notification |
|-------|-------|---------------|-------------|
| **P0 - Critical** | 🔴 Red | Immediate (15 min) | PagerDuty call + Slack + Email |
| **P1 - High** | 🟠 Orange | 30 minutes | Slack DM + Email |
| **P2 - Medium** | 🟡 Yellow | 2 hours | Slack channel |
| **P3 - Low** | 🔵 Blue | 8 hours | Slack channel (passive) |
| **P4 - Info** | ⚪ Gray | Next business day | Email digest |

### Alert Rules

| Alert Name | Condition | Severity | Description |
|------------|-----------|----------|-------------|
| `HighErrorRate` | error_rate > 1% for 5 min | P0 | API error rate exceeds threshold |
| `ApiDown` | healthcheck fails for 2 min | P0 | API is completely unreachable |
| `SlowResponses` | p95_response_time > 2s for 5 min | P1 | Response times degraded |
| `HighCpu` | cpu > 90% for 5 min | P1 | Server CPU overload |
| `HighMemory` | memory > 90% for 5 min | P1 | Server memory pressure |
| `DiskFull` | disk_usage > 95% | P1 | Disk space running out |
| `DatabaseConnections` | db_connections > 80% for 5 min | P2 | Database connection pool exhaustion |
| `SlowQueries` | slow_queries > 20/min for 5 min | P2 | Database performance degradation |
| `DeploymentFailed` | deployment status = failed | P1 | CI/CD pipeline failure |
| `SslCertExpiring` | ssl_days_remaining < 14 | P2 | SSL certificate expiring soon |
| `RateLimitHigh` | rate_limited_requests > 100/min | P2 | High rate limiting |
| `CacheMissRate` | cache_hit_ratio < 80% | P3 | Cache effectiveness decreased |

### Alert Configuration (Prometheus + Alertmanager)

```yaml
# prometheus/alert-rules.yml
groups:
  - name: jobilo-alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.01
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate ({{ $value | humanizePercentage }})"
          description: "API error rate is {{ $value | humanizePercentage }} for the last 5 minutes."

      - alert: SlowResponses
        expr: histogram_quantile(0.95, rate(http_request_duration_ms_bucket[5m])) > 2000
        for: 5m
        labels:
          severity: high
        annotations:
          summary: "Slow response times (p95: {{ $value }}ms)"

      - alert: HighMemory
        expr: (node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes > 0.9
        for: 5m
        labels:
          severity: high
        annotations:
          summary: "Memory usage above 90%"
```

---

## Dashboard Setup

### Grafana Dashboards

| Dashboard | Panels | Refresh Rate |
|-----------|--------|-------------|
| **API Overview** | Request rate, error rate, p50/p95/p99 latency, active users | 30s |
| **Server Health** | CPU, memory, disk, network, load per instance | 10s |
| **Database** | Connections, active queries, cache hit ratio, slow queries, replication lag | 30s |
| **Business Metrics** | Registrations, projects, proposals, payments, revenue | 1min |
| **User Experience** | Page load time, Core Web Vitals, session duration | 1min |
| **Background Jobs** | Queue size, processing time, failure rate, throughput | 30s |

### Dashboard JSON Structure

```json
{
  "title": "Jobilo - API Overview",
  "panels": [
    {
      "title": "Request Rate",
      "type": "graph",
      "targets": [
        {
          "expr": "rate(http_requests_total[5m])",
          "legendFormat": "{{ method }} {{ path }}"
        }
      ]
    },
    {
      "title": "Error Rate",
      "type": "graph",
      "targets": [
        {
          "expr": "rate(http_requests_total{status=~\"5..\"}[5m]) / rate(http_requests_total[5m])",
          "legendFormat": "Error rate"
        }
      ]
    },
    {
      "title": "Response Time (p95)",
      "type": "graph",
      "targets": [
        {
          "expr": "histogram_quantile(0.95, rate(http_request_duration_ms_bucket[5m]))",
          "legendFormat": "p95"
        }
      ]
    }
  ]
}
```

---

## Incident Response Plan

### Severity Classification

| Severity | Definition | Examples |
|----------|-----------|---------|
| **P0** | Complete service outage or data loss | API down, database corrupt, security breach |
| **P1** | Major feature degradation | Payment processing failed, login broken |
| **P2** | Partial feature degradation | Search slow, notifications delayed |
| **P3** | Minor issue | UI bug, cosmetic issue, non-critical warning |

### Incident Response Steps

```
1. DETECT
   - Automated alert fires OR user reports issue
   - Engineer acknowledges alert (within SLA)

2. TRIAGE (within 5 min)
   - Determine severity
   - Identify affected components
   - Check if this is a known issue

3. MITIGATE (P0/P1 within 15 min)
   - Rollback recent deployment if applicable
   - Scale up resources if capacity issue
   - Apply hotfix if bug
   - Route traffic away from failing instance

4. RESOLVE
   - Apply permanent fix
   - Verify fix in staging
   - Deploy to production
   - Monitor for stability

5. POST-MORTEM (within 48 hours)
   - Document timeline
   - Identify root cause
   - List action items to prevent recurrence
   - Share findings with team
```

### Communication During Incident

| Channel | Audience | Frequency |
|---------|----------|-----------|
| `#incidents` Slack channel | Engineering team | Every status change |
| Status page (status.jobilo.com) | All users | Every status change |
| Email (if critical) | Affected users | After resolution |
| PagerDuty | On-call engineer | Immediate |

### On-Call Rotation

| Role | Responsibility |
|------|---------------|
| Primary on-call | First responder, triage and mitigate |
| Secondary on-call | Backup, help with mitigation |
| Engineering lead | Coordinate response for P0/P1 |
| Ops engineer | Infrastructure-level response |

---

## Tools

### Monitoring Stack

| Tool | Purpose | Hosting |
|------|---------|---------|
| **Prometheus** | Metrics collection and alerting | Self-hosted (Kubernetes) |
| **Grafana** | Visualization and dashboards | Self-hosted (Kubernetes) |
| **Alertmanager** | Alert routing and notification | Self-hosted (Kubernetes) |
| **Sentry** | Error tracking and performance monitoring | SaaS (sentry.io) |
| **Datadog** | Infrastructure monitoring (optional) | SaaS |
| **Uptime Robot** | External uptime checks | SaaS |
| **PagerDuty** | Incident alerting and on-call management | SaaS |

### Monitoring Endpoints

```
Health checks:
  GET /health          → Overall service health
  GET /health/database → Database connectivity
  GET /health/redis    → Redis connectivity
  GET /health/external → External service dependencies

Metrics:
  GET /metrics         → Prometheus metrics endpoint
```

### Health Check Response

```json
GET /health
{
  "status": "healthy",
  "version": "1.0.0",
  "uptime": 1234567,
  "checks": {
    "database": { "status": "healthy", "responseTimeMs": 3 },
    "redis": { "status": "healthy", "responseTimeMs": 1 },
    "storage": { "status": "healthy", "usagePercent": 45 }
  },
  "timestamp": "2026-07-06T10:30:00Z"
}
```

---

## Cross-References

| Document | Link |
|----------|------|
| Logging | [LOGGING.md](./LOGGING.md) |
| Error Codes | [ERROR_CODES.md](./ERROR_CODES.md) |
| Deployment | [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md) |
| Performance Testing | [PERFORMANCE_TESTING.md](../PERFORMANCE_TESTING.md) |
| Security | [SECURITY.md](../SECURITY.md) |
