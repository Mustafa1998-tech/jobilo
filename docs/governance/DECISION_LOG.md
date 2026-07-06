# Decision Log

> Last Updated: 2026-07-06

This document contains the full Architecture Decision Records. See [TECHNICAL_DECISIONS.md](./TECHNICAL_DECISIONS.md) for the index and [ADR_TEMPLATE.md](./ADR_TEMPLATE.md) for the template.

---

## ADR-001: Use NestJS for Backend

**Status:** ✅ Accepted
**Date:** 2026-06-01
**Author:** @tech-lead

---

### Context

Jobilo needs a backend framework to power its REST API. The team evaluated several Node.js frameworks based on:

- TypeScript support (first-class)
- Built-in DI and modular architecture
- Community size and ecosystem maturity
- Learning curve for the team
- Performance characteristics
- Support for GraphQL and REST (future-proofing)

**Requirements:**
- First-class TypeScript support
- Built-in dependency injection
- Modular architecture for feature isolation
- Active community and long-term support
- Easy integration with Prisma and PostgreSQL

### Decision

We will use **NestJS** (v10+) as the backend framework.

NestJS provides the most complete out-of-the-box architecture for enterprise Node.js applications. Its modular system (Controllers, Services, Modules) aligns with our desired Clean Architecture layers. The built-in DI container eliminates manual dependency management.

```typescript
@Module({
  imports: [PrismaModule, RedisModule],
  controllers: [JobListingController],
  providers: [JobListingService, JobListingRepository],
  exports: [JobListingService],
})
export class JobListingModule {}
```

### Consequences

| Type | Impact |
|------|--------|
| **+** | Built-in DI enables Clean Architecture and testability |
| **+** | Modular structure maps directly to domain modules |
| **+** | Large ecosystem of plugins (validation, auth, queues) |
| **+** | Decorator-based API is expressive and declarative |
| **-** | Heavier than Express/Fastify — 50ms+ cold start |
| **-** | Decorators require experimental TypeScript features |
| **-** | Team needs ramp-up time on NestJS-specific patterns |
| **=** | Can fall back to Express/Fastify under the hood |

### Alternatives

| Alternative | Pros | Cons | Verdict |
|-------------|------|------|---------|
| Express.js | Simple, well-known | No DI, no structure, manual everything | ❌ Lacks architecture |
| Fastify | Fast, TypeScript | Smaller ecosystem, no built-in DI | ❌ Less mature |
| Hono | Fast, lightweight | Small ecosystem, limited plugins | ❌ Too new |
| Next.js API routes | Colocated with frontend | No DI, no modularity, blurs concerns | ❌ Violates SoC |
| NestJS | Full-featured, DI, modular | Heavier, decorator-dependent | ✅ **Selected** |

---

## ADR-002: Use Next.js 14+ App Router for Frontend

**Status:** ✅ Accepted
**Date:** 2026-06-01
**Author:** @tech-lead

---

### Context

The frontend needs a React framework that supports server-side rendering for SEO, has good developer experience, and integrates well with the NestJS backend.

**Requirements:**
- Server-side rendering for SEO on job listing pages
- App Router for file-based routing
- React Server Components for performance
- TypeScript support
- Easy integration with Tailwind CSS
- Strong community support

### Decision

We will use **Next.js 14+** with the **App Router**.

The App Router's file-based routing (nested layouts, `page.tsx`, `layout.tsx`) provides a clear project structure. React Server Components minimize client-side JavaScript. The 14+ version stabilizes Server Actions for form handling.

```typescript
// app/jobs/[id]/page.tsx — Server Component
export const metadata = { title: 'Job Details | Jobilo' };

export default async function JobPage({ params }: { params: { id: string } }) {
  const job = await api.jobs.getById(params.id);
  return <JobDetail job={job} />;
}
```

### Consequences

| Type | Impact |
|------|--------|
| **+** | Server Components reduce client JS bundle |
| **+** | File-based routing is intuitive and scalable |
| **+** | Metadata API simplifies SEO configuration |
| **+** | Large community and Vercel support |
| **-** | App Router has a learning curve (RSC model) |
| **-** | Server Components vs Client Components confusion |
| **-** | Tightly coupled to Vercel for optimal deployment |

### Alternatives

| Alternative | Pros | Cons | Verdict |
|-------------|------|------|---------|
| Vite + React Router | Fast HMR, simple | No SSR, no SEO | ❌ No SSR |
| Remix | SSR, nested routes | Smaller ecosystem | ❌ Team prefers Next |
| Astro | Islands architecture, fast | Less suited for app routing | ❌ Wrong paradigm |
| Next.js Pages Router | Stable, proven | Deprecation path, no RSC | ❌ Legacy |
| Next.js App Router | RSC, layouts, modern | Newer, some rough edges | ✅ **Selected** |

---

## ADR-003: PostgreSQL 16 with Prisma ORM

**Status:** ✅ Accepted
**Date:** 2026-06-02
**Author:** @backend-lead

---

### Context

Jobilo needs a relational database for structured data (users, job listings, applications) and an ORM that provides type safety and great DX.

**Requirements:**
- Relational data with foreign key relationships
- Full-text search on job listings
- Type-safe queries (no raw SQL strings)
- Migration management
- Connection pooling
- Support for JSON/JSONB for flexible metadata

### Decision

We will use **PostgreSQL 16** with **Prisma ORM** (v5+).

PostgreSQL 16 provides the best relational database features (full-text search, JSONB, advanced indexing). Prisma auto-generates TypeScript types from the schema, eliminating manual type definitions.

```prisma
model JobListing {
  id          String   @id @default(cuid())
  title       String
  description String
  salaryMin   Int?
  salaryMax   Int?
  status      ListingStatus @default(DRAFT)
  companyId   String
  company     Company  @relation(fields: [companyId], references: [id])
  tags        JobTag[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([status, createdAt])
  @@index([companyId])
}
```

### Consequences

| Type | Impact |
|------|--------|
| **+** | Full type safety from DB to API responses |
| **+** | Prisma migrations are version-controlled and deterministic |
| **+** | PostgreSQL full-text search avoids Elasticsearch for MVP |
| **+** | Prisma Studio provides a useful admin UI during dev |
| **-** | Prisma adds ~20ms overhead per query vs raw SQL |
| **-** | Complex queries (CTEs, window functions) are harder in Prisma |
| **-** | Migrations can be slow on large datasets |
| **=** | Can drop down to raw SQL via `prisma.$queryRaw` if needed |

### Alternatives

| Alternative | Pros | Cons | Verdict |
|-------------|------|------|---------|
| MongoDB + Mongoose | Schema-less, flexible | No relations, no transactions | ❌ Wrong data model |
| TypeORM | Mature, Active Record | Complex API, slower DX | ❌ Prisma is better DX |
| Drizzle ORM | SQL-like, lightweight | Smaller community | ❌ Too early |
| Knex.js | Full SQL control | No type safety, manual types | ❌ No auto-types |
| Prisma | Auto-types, great DX, migrations | Overhead, complex queries | ✅ **Selected** |

---

## ADR-004: JWT for Authentication with Refresh Tokens

**Status:** ✅ Accepted
**Date:** 2026-06-05
**Author:** @security-lead

---

### Context

The authentication system needs to support user login, session management, and secure API access. The system must be stateless (no server-side sessions) to scale horizontally.

**Requirements:**
- Stateless authentication for horizontal scaling
- Short-lived access tokens (< 15 min) to limit breach impact
- Refresh token rotation for long-lived sessions
- Support for mobile clients (native apps)
- OAuth2 compatibility for future social login

### Decision

We will use **signed JWTs (RS256)** with a **refresh token rotation** pattern.

Access tokens are short-lived (15 minutes) and signed with RS256 using a public/private key pair. Refresh tokens are long-lived (30 days) stored in Redis with a allowlist pattern. Rotation ensures old refresh tokens are invalidated on use.

```typescript
// Token service — simplified
@Injectable()
export class AuthTokenService {
  async generateTokens(userId: string): Promise<TokenPair> {
    const accessToken = await this.signAccessToken(userId, '15m');
    const refreshToken = crypto.randomUUID();
    await this.redis.set(`refresh:${refreshToken}`, userId, 'EX', 30 * 86400);
    return { accessToken, refreshToken };
  }

  async rotateRefreshToken(oldToken: string): Promise<TokenPair> {
    const userId = await this.redis.get(`refresh:${oldToken}`);
    if (!userId) throw new UnauthorizedException('Invalid refresh token');
    await this.redis.del(`refresh:${oldToken}`);
    return this.generateTokens(userId);
  }
}
```

### Consequences

| Type | Impact |
|------|--------|
| **+** | Stateless access tokens — no Redis lookup on every request |
| **+** | Short TTL limits exposure from token theft |
| **+** | Refresh rotation detects token reuse (theft indicator) |
| **+** | RS256 allows public key sharing with microservices |
| **-** | Token revocation requires a blocklist (Redis) |
| **-** | Refresh token storage in Redis adds complexity |
| **-** | JWT size (~1KB) adds overhead per request |

### Alternatives

| Alternative | Pros | Cons | Verdict |
|-------------|------|------|---------|
| Session cookies + Redis Store | Easy revocation | Stateful, Redis on every request | ❌ Not stateless |
| PASETO | More secure than JWT | Smaller ecosystem | ❌ Less support |
| OAuth2 + Keycloak | Full-featured | Overhead for MVP, self-hosted IdP | ❌ Too heavy for MVP |
| JWT + access only, no refresh | Simple | Poor UX (frequent logins) | ❌ Bad UX |
| JWT + refresh rotation | Stateless, secure, good UX | More complex | ✅ **Selected** |

---

## ADR-005: No Payment Module in MVP

**Status:** ✅ Accepted
**Date:** 2026-06-10
**Author:** @product-owner

---

### Context

The MVP scope discussion raised whether to include payment processing (subscriptions, pay-per-job-posting) in the initial release.

**Requirements:**
- Validate core job listing value proposition before monetization
- Avoid payment compliance complexity (PCI-DSS, tax, refunds)
- Minimize time-to-market for MVP

### Decision

The payment module will be **excluded from MVP** (v1.0.0). Monetization will be added in v1.1.0 using Stripe.

This decision follows the YAGNI principle (see [ARCHITECTURE_PRINCIPLES.md](./ARCHITECTURE_PRINCIPLES.md#2-dry-kiss-yagni)). Payment processing introduces legal, compliance, and complexity overhead that would delay the MVP by 4-6 weeks.

```typescript
// Future — v1.1.0
@Module({
  imports: [StripeModule.forRoot(config.stripe)],
  controllers: [PaymentController],
  providers: [SubscriptionService, InvoiceService],
})
export class PaymentModule {}
```

### Consequences

| Type | Impact |
|------|--------|
| **+** | Faster time-to-market (MVP in 8 weeks vs 12-14 weeks) |
| **+** | No PCI-DSS compliance during MVP |
| **+** | No Stripe/PayPal integration overhead |
| **+** | Validate product-market fit before investing in payments |
| **-** | No revenue during initial launch |
| **-** | Architecture must still anticipate payment hooks |
| **-** | User data model needs eventual migration for billing info |
| **=** | Stripe API is well-documented; integration is straightforward |

### Alternatives

| Alternative | Pros | Cons | Verdict |
|-------------|------|------|---------|
| Include Stripe in MVP | Revenue Day 1 | 4-6 week delay, compliance | ❌ Delays validation |
| Include PayPal + Stripe | More payment options | Even more complexity | ❌ Over-engineering |
| Use Paddle (Merchant of Record) | Offloads compliance | 5-7% fee, less control | ❌ Consider for v2 |
| No payments in MVP | Fast launch, validate first | No revenue initially | ✅ **Selected** |

---

## ADR-009: Redis for Session Caching and Rate Limiting

**Status:** ✅ Accepted
**Date:** 2026-06-25
**Author:** @backend-lead

---

### Context

The application needs a fast in-memory data store for refresh token storage, rate limiting counters, and optional caching of frequently accessed data.

**Requirements:**
- Sub-millisecond read/write for token verification
- TTL expiration for automatic cleanup
- Atomic increment operations for rate limiting
- Lightweight — no need for Redis Cluster for MVP volume

### Decision

We will use **Redis** (via `ioredis`) for session caching, refresh token storage, and rate limiting.

```typescript
@Module({
  imports: [RedisModule.forRoot({ host: 'localhost', port: 6379 })],
  providers: [RateLimitService, SessionCacheService],
  exports: [RateLimitService, SessionCacheService],
})
export class CacheModule {}
```

### Consequences

| Type | Impact |
|------|--------|
| **+** | Sub-millisecond token verification |
| **+** | Built-in TTL handles token expiry cleanup |
| **+** | Atomic operations perfect for rate limiting |
| **+** | Widely supported, well-known technology |
| **-** | Additional infrastructure (Docker container) |
| **-** | Data loss if Redis restarts (not used for persistent data) |
| **-** | Cache invalidation complexity for application caching |
| **=** | Can use Redis Sentinel for HA in production |

---

## Related Documents

- [TECHNICAL_DECISIONS.md](./TECHNICAL_DECISIONS.md) — ADR index and RFC process
- [ADR_TEMPLATE.md](./ADR_TEMPLATE.md) — Template for new ADRs
- [GOVERNANCE.md](./GOVERNANCE.md) — Decision-making model
- [ARCHITECTURE_PRINCIPLES.md](./ARCHITECTURE_PRINCIPLES.md) — Guiding principles
