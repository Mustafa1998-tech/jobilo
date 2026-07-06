# Jobilo — Performance Testing Guide

> **Version:** 1.0 | **Cross-Ref:** [NFR-1 (Performance)](NON_FUNCTIONAL_REQUIREMENTS.md#NFR-1), [Test Plan](TEST_PLAN.md), [Test Strategy](TEST_STRATEGY.md)

---

## 1. Performance Testing Strategy

This guide defines the performance testing approach for Jobilo, covering load testing, stress testing, endurance testing, and frontend performance validation. All tests target the thresholds defined in [NFR-1](NON_FUNCTIONAL_REQUIREMENTS.md#NFR-1).

### 1.1 Objectives

| Objective | Target |
|-----------|--------|
| Validate API response times | p95 < 300ms, p99 < 500ms |
| Verify platform handles expected load | 10,000 concurrent users |
| Identify bottlenecks before production | All critical paths analyzed |
| Frontend performance score | Lighthouse ≥ 90 |
| WebSocket message latency | p95 < 100ms |

---

## 2. Load Testing (k6)

### 2.1 Test Script Structure

Scripts located in `tests/performance/`:

```
tests/performance/
├── scenarios/
│   ├── browse-projects.js       # Project listing + search
│   ├── auth-flow.js             # Register, login, token refresh
│   ├── proposal-submission.js   # Submit proposals
│   ├── messaging.js             # WebSocket message sending
│   ├── admin-dashboard.js       # Admin dashboard queries
│   └── mixed-workload.js        # Simulates real user behavior
├── helpers/
│   ├── setup.js                 # Auth token setup
│   └── data.js                  # Test data generators
└── k6-config.js                 # Shared configuration
```

### 2.2 Scenario: Mixed Workload (Realistic)

This scenario simulates realistic user behavior with varying proportions:

| User Type | % of Virtual Users | Actions |
|-----------|-------------------|---------|
| Browsing freelancer | 50% | Browse projects, search, view details |
| Submitting freelancer | 20% | Browse → Submit proposal |
| Client | 20% | Browse projects, view proposals |
| Messaging user | 8% | Send/receive messages (WebSocket) |
| Admin | 2% | Dashboard, user management |

**k6 Script — Mixed Workload:**
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';

export const options = {
  stages: [
    { duration: '2m', target: 100 },   // Ramp-up to 100 users
    { duration: '5m', target: 1000 },  // Ramp-up to 1000 users
    { duration: '10m', target: 1000 }, // Sustained load
    { duration: '2m', target: 0 },     // Ramp-down
  ],
  thresholds: {
    http_req_duration: ['p(95)<300', 'p(99)<500'],
    http_req_failed: ['rate<0.01'],
    ws_connect_duration: ['p(95)<200'],
  },
};

export default function () {
  const userType = Math.random();
  if (userType < 0.5) browseProjects();
  else if (userType < 0.7) submitProposal();
  else if (userType < 0.9) clientActions();
  else if (userType < 0.98) messaging();
  else adminActions();
  sleep(Math.random() * 5 + 2);
}
```

### 2.3 Load Test Scenarios

| Scenario | Duration | Virtual Users | RPS Target | Purpose |
|----------|----------|---------------|------------|---------|
| **Baseline** | 5 min | 50 | 100 | Establish baseline metrics |
| **Load** | 15 min | 1,000 | 1,000 | Validate under expected load |
| **Peak** | 10 min | 5,000 | 5,000 | Validate under peak load |
| **Burst** | 2 min | 10,000 | 10,000 | Validate sudden traffic spike |
| **Stress** | 5 min (ramp to failure) | 20,000+ | N/A | Find breaking point |

### 2.4 Key Metrics to Monitor

| Metric | k6 Metric | Target |
|--------|-----------|--------|
| Request duration (p95) | `http_req_duration` | < 300ms |
| Request duration (p99) | `http_req_duration` | < 500ms |
| Error rate | `http_req_failed` | < 1% |
| Requests per second | `http_reqs` | 1,000+ |
| WebSocket connect time | Custom check | < 200ms |
| Iteration duration | `iteration_duration` | < 5s |

---

## 3. Stress Testing

Stress testing identifies the platform's breaking point by gradually increasing load until errors occur.

| Phase | Users | Duration | Expected |
|-------|-------|----------|----------|
| Baseline | 1,000 | 3 min | All requests succeed, latency normal |
| Ramp-up | 1,000 → 5,000 | 5 min | Latency increases linearly |
| High load | 5,000 | 5 min | Latency increases but < 1s |
| Breaking point | 5,000 → TBD | Until 5% errors | Identify max capacity |
| Recovery | Back to 1,000 | 3 min | System recovers completely |

**Success Criteria:**
- System recovers to baseline performance after stress test
- No data corruption or loss
- No persistent errors after load decreases
- Graceful degradation (rate limiting messages, not server errors)

---

## 4. Endurance (Soak) Testing

Endurance testing validates the platform can sustain load over an extended period (to catch memory leaks, connection leaks, and DB connection pool exhaustion).

| Parameter | Value |
|-----------|-------|
| Duration | 4 hours |
| Virtual Users | 500 |
| Load Type | Steady (mixed workload) |
| Monitoring | CPU, memory, DB connections, open handles |

**Expected Behavior:**
- Response times remain stable (no degradation trend)
- Memory usage plateaus (no leak)
- Database connection count stable within pool limits
- No unexpected connection resets

---

## 5. Frontend Performance (Lighthouse)

### 5.1 Lighthouse CI Integration

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [pull_request]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run build
      - run: npm start & npx wait-on http://localhost:3000
      - run: npx lhci autorun
```

### 5.2 Lighthouse Budgets

| Category | Budget | Weight |
|----------|--------|--------|
| Performance | ≥ 90 | Critical |
| Accessibility | ≥ 90 | Critical |
| Best Practices | ≥ 90 | Critical |
| SEO | ≥ 90 | Important |
| PWA | ≥ 50 | Future |

### 5.3 Frontend Performance Tests

| Page | FCP Target | LCP Target | TBT Target |
|------|-----------|-----------|-----------|
| Homepage | < 1.5s | < 2.5s | < 200ms |
| Browse Projects | < 1.5s | < 2.5s | < 200ms |
| Project Detail | < 1.5s | < 2.5s | < 200ms |
| Freelancer Profile | < 1.5s | < 2.5s | < 200ms |
| Dashboard | < 2s | < 3s | < 300ms |
| Admin Dashboard | < 2s | < 3s | < 300ms |
| Messages | < 1s (navigated) | < 2s | < 200ms |

---

## 6. Key Performance Indicators (KPIs)

| KPI | Target | Measurement Tool | When |
|-----|--------|-----------------|------|
| API p95 response time | < 300ms | Sentry Performance + k6 | Every release |
| API p99 response time | < 500ms | Sentry Performance + k6 | Every release |
| Error rate | < 0.1% | Sentry | Continuous |
| FCP | < 1.5s | Lighthouse CI | Every PR |
| LCP | < 2.5s | Lighthouse CI | Every PR |
| TTFB | < 200ms | Lighthouse CI | Every PR |
| Max concurrent users | 10,000+ | k6 | Per milestone |
| Throughput | 1,000+ RPS | k6 | Per milestone |
| DB query p95 | < 100ms | Prisma logging | Continuous |
| Memory leak (4h soak) | < 5% growth | k6 + monitoring | Per milestone |

---

## 7. Performance Budgets

### 7.1 API Budgets

| Endpoint Group | p50 | p95 | p99 |
|---------------|-----|-----|-----|
| GET /api/projects (list) | < 150ms | < 300ms | < 500ms |
| GET /api/projects/:id | < 100ms | < 200ms | < 400ms |
| POST /api/projects | < 200ms | < 400ms | < 600ms |
| POST /api/auth/login | < 300ms (bcrypt) | < 500ms | < 800ms |
| POST /api/proposals | < 200ms | < 400ms | < 600ms |
| GET /api/admin/stats | < 300ms | < 500ms | < 1000ms |
| WebSocket send message | < 50ms | < 100ms | < 200ms |

### 7.2 Database Query Budgets

| Query Type | p95 Target |
|------------|-----------|
| Simple SELECT by ID | < 10ms |
| List with filters + pagination (20 items) | < 50ms |
| Full-text search | < 200ms |
| Aggregation (COUNT, AVG) | < 100ms |
| Join across 3+ tables | < 100ms |

---

## 8. Bottleneck Analysis

### 8.1 Common Bottlenecks

| Layer | Potential Issue | Mitigation |
|-------|----------------|------------|
| **Database** | Missing indexes on filtered columns | Add indexes for `category_id`, `status`, `created_at`, `budget` |
| **Database** | N+1 queries on relation loading | Use Prisma `include` or `select` eagerly |
| **API** | Serialization overhead | Return only needed fields, use pagination |
| **API** | No caching on read-heavy endpoints | Redis cache layer (Phase 2) |
| **Frontend** | Unoptimized images | Next.js Image optimization, WebP format |
| **Frontend** | Large JS bundles | Code-splitting, dynamic imports |
| **WebSocket** | Connection scaling | Socket.IO adapter with Redis |

### 8.2 Profiling Approach

| Tool | Usage |
|------|-------|
| **Prisma logging** | `log: ['query', 'info', 'warn', 'error']` — identify slow queries |
| **Sentry Performance** | Trace API transactions, identify slow spans |
| **Node.js --prof** | CPU profiling for server-side bottlenecks |
| **Chrome DevTools** | Frontend performance profiling (Lighthouse, Performance tab) |
| **k6 metrics** | Identify endpoints with high latency or error rates |

### 8.3 Optimization Checklist

- [ ] Add database indexes for all filterable/sortable fields
- [ ] Implement cursor-based pagination for large datasets (vs offset)
- [ ] Use eager loading (`include`) to avoid N+1 queries
- [ ] Compress API responses (gzip/deflate)
- [ ] Implement response caching for read-only endpoints
- [ ] Optimize images (resize, WebP, lazy loading)
- [ ] Code-split frontend bundles by route
- [ ] Use `React.lazy` and `Suspense` for heavy components
- [ ] Enable Redis caching for frequently accessed data
- [ ] Review and optimize Prisma queries (avoiding full table scans)

---

## 9. Tools Summary

| Tool | Purpose | When |
|------|---------|------|
| **k6** | Load, stress, endurance, soak testing | Every milestone, before release |
| **Lighthouse CI** | Frontend performance, accessibility, SEO | Every PR |
| **Sentry** | APM — real-world performance monitoring | Production (continuous) |
| **Prisma logging** | Database query performance | Development + CI |
| **Chrome DevTools** | Frontend profiling | Development |
| **clinic.js** (future) | Node.js profiling | Phase 2 |

---

## 10. Reporting

Each performance test run produces:
- **k6 HTML report** with response time distributions, error rates, throughput charts
- **Lighthouse HTML report** with scores and optimization suggestions
- **Summary** comparing results against previous baseline

Reports are archived in CI artifacts and reviewed during release sign-off.

---

*Performance requirements are defined in [NON_FUNCTIONAL_REQUIREMENTS.md — Performance](NON_FUNCTIONAL_REQUIREMENTS.md#NFR-1). For overall testing strategy, see [TEST_STRATEGY.md](TEST_STRATEGY.md). For the general test plan, see [TEST_PLAN.md](TEST_PLAN.md).*
