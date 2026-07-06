# Jobilo — Non-Functional Requirements Specification

> **Version:** 1.0 | **Cross-Ref:** [Security Testing](SECURITY_TESTING.md), [Performance Testing](PERFORMANCE_TESTING.md), [Test Strategy](TEST_STRATEGY.md)

---

## NFR-1: Performance

| ID | Requirement | Target | Measurement Tool | Priority |
|----|------------|--------|-----------------|----------|
| NFR-1.1 | First Contentful Paint (FCP) | < 1.5s | Lighthouse | P0 |
| NFR-1.2 | Largest Contentful Paint (LCP) | < 2.5s | Lighthouse / Web Vitals | P0 |
| NFR-1.3 | Time to Interactive (TTI) | < 3s | Lighthouse | P0 |
| NFR-1.4 | API Response Time (p50) | < 150ms | APM (Sentry/DataDog) | P0 |
| NFR-1.5 | API Response Time (p95) | < 300ms | APM | P0 |
| NFR-1.6 | API Response Time (p99) | < 500ms | APM | P0 |
| NFR-1.7 | Database Query Time (p95) | < 100ms | Prisma logging | P0 |
| NFR-1.8 | Search Query Response (p95) | < 500ms | PostgreSQL query analysis | P0 |
| NFR-1.9 | File Upload (10MB) | < 5s | Browser dev tools | P1 |
| NFR-1.10 | Lighthouse Performance Score | ≥ 90 | Lighthouse CI | P1 |
| NFR-1.11 | Time to First Byte (TTFB) | < 200ms | Web Vitals | P0 |
| NFR-1.12 | Concurrent Users (load) | 10,000+ | k6 load testing | P0 |
| NFR-1.13 | Requests Per Second (RPS) | 1,000+ | k6 | P0 |
| NFR-1.14 | WebSocket message latency (p95) | < 100ms | Custom monitoring | P0 |
| NFR-1.15 | API Pagination response (100 items) | < 200ms | APM | P0 |

### Performance Budgets

| Asset Type | Budget |
|-----------|--------|
| Initial JS bundle (frontend) | < 200KB gzipped |
| CSS bundle | < 30KB gzipped |
| Image (hero/page) | < 200KB |
| Font files (Arabic + Latin) | < 100KB total |
| API response payload (list) | < 50KB |
| Total page weight | < 500KB |

> See [Performance Testing](PERFORMANCE_TESTING.md) for full load/stress testing approach.

---

## NFR-2: Security

| ID | Requirement | Implementation | Priority |
|----|------------|---------------|----------|
| NFR-2.1 | Password hashing with bcrypt (12 rounds) | `bcrypt` library | P0 |
| NFR-2.2 | JWT access tokens (RS256, 15min expiry) | `@nestjs/jwt` + Passport | P0 |
| NFR-2.3 | JWT refresh tokens (7 days, rotation) | Custom strategy | P0 |
| NFR-2.4 | HTTPS enforced (TLS 1.3) | Nginx / reverse proxy | P0 |
| NFR-2.5 | CSRF protection | `csrf-csrf` or SameSite cookies | P0 |
| NFR-2.6 | XSS prevention | Helmet headers + input sanitization | P0 |
| NFR-2.7 | SQL injection prevention | Prisma ORM (parameterized queries) | P0 |
| NFR-2.8 | Rate limiting (100 req/min per IP/user) | `@nestjs/throttler` | P0 |
| NFR-2.9 | CORS whitelist (specific origins) | NestJS CORS config | P0 |
| NFR-2.10 | Security headers (Helmet) | `helmet` middleware | P0 |
| NFR-2.11 | Input validation (all endpoints) | Zod + `class-validator` | P0 |
| NFR-2.12 | File upload validation (type, size, scan) | Multer + virus scan (future) | P0 |
| NFR-2.13 | Data encryption at rest (DB) | PostgreSQL TDE / column encryption | P0 |
| NFR-2.14 | Session management (secure, httpOnly cookies) | Cookie-parser + JWT | P0 |
| NFR-2.15 | Audit logging (all admin actions) | Logger module + DB audit table | P0 |
| NFR-2.16 | OWASP Top 10 compliance | Regular scanning | P0 |
| NFR-2.17 | Secrets via environment variables | `.env` (never committed) | P0 |
| NFR-2.18 | 2FA (TOTP) support | Phase 2 | P1 |

> Detailed security testing in [SECURITY_TESTING.md](SECURITY_TESTING.md).

---

## NFR-3: Scalability

| ID | Requirement | Target | Approach |
|----|------------|--------|----------|
| NFR-3.1 | Horizontal scaling (application layer) | 10x without code changes | Stateless NestJS, Docker Compose → K8s |
| NFR-3.2 | Database connection pooling | 100+ concurrent | Prisma with pgBouncer |
| NFR-3.3 | Caching layer | 80% cache hit rate | Redis (Phase 2) |
| NFR-3.4 | CDN for static assets | Global edge delivery | Vercel / Cloudflare |
| NFR-3.5 | Database read replicas | Up to 5 replicas | PostgreSQL streaming replication |
| NFR-3.6 | Stateless API design | Ready for scale | JWT (no server sessions) |
| NFR-3.7 | Message queue for async tasks | Event-driven | Bull/RabbitMQ (Phase 2) |
| NFR-3.8 | Database sharding readiness | Shard key identified | By region or user_id hash |
| NFR-3.9 | Image optimization | Automatic resize/format | Next.js Image + Sharp |

---

## NFR-4: Availability

| ID | Requirement | Target | Details |
|----|------------|--------|---------|
| NFR-4.1 | Platform Uptime (SLA) | 99.9% | Max 8.76h downtime/year |
| NFR-4.2 | Planned maintenance downtime | < 4h/month | Off-peak hours |
| NFR-4.3 | Disaster Recovery — RPO | < 15 minutes | Data loss tolerance |
| NFR-4.4 | Disaster Recovery — RTO | < 1 hour | Time to restore service |
| NFR-4.5 | Database backup frequency | Every 6 hours | Automated pg_dump |
| NFR-4.6 | Backup retention period | 30 days | Rolling backups |
| NFR-4.7 | Failover time | < 5 minutes | Automated health checks |
| NFR-4.8 | Graceful degradation | Core features work | Feature flags |
| NFR-4.9 | Health check endpoints | `/api/health` | Return DB + cache status |

---

## NFR-5: Maintainability

| ID | Requirement | Implementation | Priority |
|----|------------|---------------|----------|
| NFR-5.1 | Clean Architecture (separation of concerns) | Controllers → Services → Repositories | P0 |
| NFR-5.2 | Modular design (NestJS modules) | Each feature is a module | P0 |
| NFR-5.3 | TypeScript strict mode throughout | `strict: true` in tsconfig | P0 |
| NFR-5.4 | Unit test coverage ≥ 80% | Jest | P0 |
| NFR-5.5 | Integration test coverage ≥ 70% | NestJS testing + Prisma test DB | P0 |
| NFR-5.6 | E2E test coverage (critical paths) ≥ 60% | Playwright | P0 |
| NFR-5.7 | API documentation (Swagger/OpenAPI) | `@nestjs/swagger` | P0 |
| NFR-5.8 | Code documentation (JSDoc for public APIs) | TSDoc conventions | P0 |
| NFR-5.9 | ESLint + Prettier enforced | Pre-commit hooks | P0 |
| NFR-5.10 | Conventional Commits (git) | `feat:`, `fix:`, `chore:`, etc. | P0 |
| NFR-5.11 | Environment-based configuration | `@nestjs/config` + `.env` | P0 |
| NFR-5.12 | Feature flags support | Config service | P1 |
| NFR-5.13 | Dependency injection throughout | NestJS DI | P0 |
| NFR-5.14 | Prisma migrations managed in version control | `prisma/migrations/` | P0 |

> See [Test Strategy](TEST_STRATEGY.md) for detailed testing approach.

---

## NFR-6: Usability

| ID | Requirement | Target | Priority |
|----|------------|--------|----------|
| NFR-6.1 | Responsive design | Desktop (1920px) → Mobile (320px) | P0 |
| NFR-6.2 | Arabic RTL support | Full bidirectional layout | P0 |
| NFR-6.3 | English LTR support | Parallel RTL/LTR | P0 |
| NFR-6.4 | WCAG 2.1 AA accessibility | All pages | P0 |
| NFR-6.5 | Keyboard navigation | All interactive elements | P0 |
| NFR-6.6 | Screen reader support | ARIA labels, semantic HTML | P1 |
| NFR-6.7 | Mobile-first design | Priority for mobile layouts | P0 |
| NFR-6.8 | Loading states (skeleton, spinner) | Every async action | P0 |
| NFR-6.9 | Error states (user-friendly messages) | Arabic error messages | P0 |
| NFR-6.10 | Empty states (no data illustrations) | Every list view | P0 |
| NFR-6.11 | Real-time form validation feedback | On blur + on change | P0 |
| NFR-6.12 | Optimistic UI updates | For non-critical actions | P1 |
| NFR-6.13 | Offline detection and messaging | Network status indicator | P2 |

---

## NFR-7: Reliability

| ID | Requirement | Target | Implementation |
|----|------------|--------|---------------|
| NFR-7.1 | Graceful error handling | 100% of endpoints | Global exception filter |
| NFR-7.2 | Request retry logic (idempotent operations) | 3 retries | HTTP interceptors |
| NFR-7.3 | Database transaction integrity | All financial/write operations | Prisma transactions |
| NFR-7.4 | Data validation at API boundary | All incoming requests | Pipes + DTOs |
| NFR-7.5 | WebSocket reconnection | Auto-reconnect with exponential backoff | Socket.IO client |
| NFR-7.6 | Automated DB backups | Every 6 hours | Cron + pg_dump |
| NFR-7.7 | Backup restoration tested | Monthly | QA schedule |
| NFR-7.8 | Circuit breaker for external services | OpenAI, email, file storage | Resilience4j pattern |
| NFR-7.9 | Rate limit exceeded handling | 429 with retry-after header | Throttler module |

---

## NFR-8: Monitoring & Observability

| ID | Requirement | Tool | Priority |
|----|------------|------|----------|
| NFR-8.1 | Error tracking | Sentry | P0 |
| NFR-8.2 | API health checks | `/api/health` endpoint | P0 |
| NFR-8.3 | Performance monitoring | Lighthouse CI + Sentry | P1 |
| NFR-8.4 | Structured logging (JSON) | NestJS Logger + Winston | P0 |
| NFR-8.5 | Database query monitoring | Prisma logging + pg_stat_statements | P1 |
| NFR-8.6 | Uptime monitoring | UptimeRobot / BetterStack | P0 |
| NFR-8.7 | Alerting (email, Slack) | Sentry + Webhooks | P0 |
| NFR-8.8 | System health dashboard | Grafana (Phase 2) | P1 |

---

## NFR-9: Compliance & Legal

| ID | Requirement | Priority |
|----|------------|----------|
| NFR-9.1 | GDPR compliance (EU users) | P1 |
| NFR-9.2 | Data privacy policy (公开) | P0 |
| NFR-9.3 | User data export (GDPR right to portability) | P1 |
| NFR-9.4 | User account deletion (right to be forgotten) | P0 |
| NFR-9.5 | Terms of Service display and acceptance | P0 |
| NFR-9.6 | Cookie consent banner | P0 |
| NFR-9.7 | Age verification (18+) | P0 |
| NFR-9.8 | Anti-money laundering (AML) checks | P2 |

---

*Non-functional requirements are validated through the processes defined in [TEST_PLAN.md](TEST_PLAN.md) and [TEST_STRATEGY.md](TEST_STRATEGY.md). All security-specific NFRs are tested as documented in [SECURITY_TESTING.md](SECURITY_TESTING.md). Performance budgets are validated in [PERFORMANCE_TESTING.md](PERFORMANCE_TESTING.md).*
