# System Design Document — وثيقة تصميم النظام

> **Jobilo System Design**: Component interactions, data flow, database design, caching, error handling, and observability.

---

## High-Level Architecture | المعمارية عالية المستوى

```mermaid
C4Container
  title Jobilo Platform - Container Diagram
  
  Person(user, "User", "Freelancer or Client")
  
  System_Boundary(jobilo, "Jobilo Platform") {
    Container(web, "Next.js App", "React, TypeScript, Tailwind CSS", "Server-rendered frontend with client-side interactivity")
    Container(api, "NestJS API", "TypeScript, Express", "REST API server with WebSocket support")
    Container(worker, "Background Worker", "TypeScript, BullMQ", "Async job processing (email, notifications, AI)")
    
    ContainerDb(pg, "PostgreSQL 16", "SQL Database", "Primary data store")
    ContainerDb(redis, "Redis 7", "Key-Value Store", "Caching, sessions, queues, pub/sub")
    ContainerDb(s3, "MinIO / S3", "Object Storage", "File uploads, images, documents")
  }
  
  System_Ext(emailSvc, "Email Service", "SendGrid")
  System_Ext(smsSvc, "SMS Service", "Twilio")
  System_Ext(aiSvc, "AI/ML Service", "Model inference")
  System_Ext(paymentSvc, "Payment Gateway", "Paymob / Stripe")
  
  Rel(user, web, "HTTPS", "UI interactions")
  Rel(web, api, "REST/WSS", "API calls")
  Rel(api, pg, "Prisma ORM", "SQL")
  Rel(api, redis, "ioredis", "Cache, sessions")
  Rel(api, s3, "AWS SDK", "File operations")
  Rel(api, emailSvc, "SMTP", "Transactional emails")
  Rel(api, smsSvc, "API", "SMS verification")
  Rel(api, aiSvc, "REST/gRPC", "ML inference")
  Rel(api, paymentSvc, "REST", "Payment processing")
  Rel(worker, redis, "BullMQ", "Job queues")
  Rel(worker, emailSvc, "SMTP", "Email sending")
  Rel(worker, aiSvc, "REST", "AI batch processing")
```

---

## Component Interactions | تفاعلات المكونات

### Request/Response Flow

```mermaid
sequenceDiagram
    participant C as Client (Browser)
    participant CDN as CDN / CloudFlare
    participant LB as Nginx Load Balancer
    participant W as Next.js (Web)
    participant A as NestJS (API)
    participant V as Validation Pipe
    participant G as Auth Guard (JWT)
    participant R as RBAC Guard
    participant S as Service Layer
    participant DB as PostgreSQL
    participant Cache as Redis
    participant Ext as External Service

    C->>CDN: HTTPS Request
    CDN->>LB: Forward request
    LB->>W: Route to web
    
    alt Static page (SSR)
        W->>W: Render React Server Component
        W->>A: Fetch data via server component
        A->>V: Validate request
        V->>G: Authenticate
        G->>R: Authorize
        R->>S: Execute business logic
        S->>Cache: Check cache
        alt Cache hit
            Cache-->>S: Cached data
        else Cache miss
            S->>DB: Query database
            DB-->>S: Result
            S->>Cache: Set cache
        end
        S->>Ext: Call external service
        Ext-->>S: Response
        S-->>A: Return result
        A-->>W: JSON response
        W-->>LB: HTML (SSR)
    else API request
        C->>W: Client-side navigation
        W->>A: Fetch API (useEffect / React Query)
        A->>V: Validate request
        V->>G: Authenticate
        G->>R: Authorize
        R->>S: Execute business logic
        S->>DB: Query
        DB-->>S: Result
        S-->>A: Response
        A-->>W: JSON
        W-->>C: Update UI
    end
    
    LB-->>C: Response
```

### WebSocket Flow (Messaging)

```mermaid
sequenceDiagram
    participant U1 as Freelancer
    participant U2 as Client
    participant W as Next.js Web
    participant WS as WebSocket Gateway
    participant A as Auth Service
    participant R as Redis (Pub/Sub)
    participant DB as PostgreSQL
    participant N as Notification Service

    U1->>W: Open chat
    W->>WS: Connect (with JWT)
    WS->>A: Verify JWT
    A-->>WS: User authenticated
    WS-->>U1: Connection established
    
    U2->>WS: Connect
    
    U1->>WS: Send message to project/123
    WS->>WS: Validate message
    WS->>DB: Save message
    WS->>R: Publish to channel "project:123"
    
    R-->>WS: Receive event (same pod)
    R-->>WS: (different pod via Redis adapter)
    
    WS-->>U2: Deliver message (real-time)
    
    alt U2 is offline
        WS->>N: Send push notification
        N->>U2: Email/SMS notification
    end
    
    WS-->>U1: Message delivered confirmation
    WS-->>U1: Typing indicators (via WebSocket)
```

---

## Database Design Overview | نظرة عامة على تصميم قاعدة البيانات

### Entity Relationship Diagram

```mermaid
erDiagram
    User ||--o| Profile : has
    User ||--o{ Project : "creates as client"
    User ||--o{ Proposal : "submits as freelancer"
    User ||--o{ Review : "writes"
    User ||--o{ Message : "sends"
    User ||--o{ UserSkill : "possesses"
    User ||--o{ Subscription : "subscribes to"
    
    Profile ||--o{ Portfolio : "contains"
    Profile ||--o{ Certification : "has"
    Profile ||--o{ Education : "includes"
    Profile ||--o{ Experience : "lists"
    
    Skill ||--o{ UserSkill : "linked to users"
    Skill ||--o{ ProjectSkill : "linked to projects"
    
    Project ||--o{ Proposal : "receives"
    Project ||--o{ ProjectSkill : "requires"
    Project ||--o{ Contract : "results in"
    
    Proposal ||--o| Contract : "accepted as"
    
    Contract ||--o{ Milestone : "contains"
    Contract ||--o{ Review : "generates"
    
    Message ||--o| Conversation : "belongs to"
    Conversation ||--o{ User : "participants"
    
    Review ||--o| User : "target"
    
    Subscription ||--o| SubscriptionPlan : "based on"
    
    AuditLog ||--o| User : "created by"
```

### Core Tables

| Table | الجدول | Description | Key Relationships |
|-------|--------|-------------|-------------------|
| **User** | المستخدم | Core user account with auth credentials | 1:1 with Profile, 1:N with Project, Proposal |
| **Profile** | الملف الشخصي | Extended user information | 1:1 with User |
| **Skill** | المهارة | Skill catalog | M:N with User, M:N with Project |
| **Project** | المشروع | Freelance project listing | M:1 with Client, 1:N with Proposal |
| **Proposal** | العرض | Freelancer bid on project | M:1 with Project, M:1 with Freelancer |
| **Contract** | العقد | Formal agreement between parties | 1:1 with Proposal, 1:N with Milestone |
| **Message** | الرسالة | Chat message | M:1 with Conversation |
| **Conversation** | المحادثة | Chat conversation between users | M:N with User |
| **Review** | المراجعة | Post-project review | M:1 with Contract, M:1 with Reviewer |
| **Subscription** | الاشتراك | User subscription record | M:1 with User, M:1 with Plan |
| **AuditLog** | سجل التدقيق | Security audit trail | M:1 with User |

### Indexing Strategy

| Table | Indexes | Purpose |
|-------|---------|---------|
| **User** | email (unique), username (unique), role, createdAt | Auth lookups, sorting |
| **Profile** | userId (unique), fullName (GIN for full-text) | Profile search |
| **Project** | clientId, status, budget, createdAt, title (GIN) | Project search/filter |
| **Proposal** | projectId + freelancerId (unique), status, amount | Prevent duplicate proposals |
| **Message** | conversationId + createdAt, senderId | Chat history loading |
| **Conversation** | participantIds (GIN) | Find user conversations |
| **Skill** | name (unique), category | Skill autocomplete |
| **Review** | contractId (unique), targetId, rating | Prevent duplicate reviews |

### Arabic Full-Text Search

PostgreSQL 16 provides robust Arabic full-text search capabilities:

```sql
-- Create Arabic text search configuration
CREATE TEXT SEARCH CONFIGURATION arabic (PARSER = default);
ALTER TEXT SEARCH CONFIGURATION arabic
  ALTER MAPPING FOR hword, hword_part, word
  WITH arabic_stem, simple;

-- Create GIN index for full-text search on projects
CREATE INDEX idx_project_search ON "Project"
  USING GIN (to_tsvector('arabic', coalesce(title, '') || ' ' || coalesce(description, '')));
```

---

## Caching Strategy | استراتيجية التخزين المؤقت

### Cache Layers

```mermaid
flowchart TD
    subgraph "Browser Cache"
        B1[HTTP Cache: 5 min]
        B2[React Query Cache: 5 min]
        B3[Static Assets: 1 year]
    end
    
    subgraph "CDN Cache"
        C1[CloudFlare: Static files]
        C2[CloudFlare: API responses]
    end
    
    subgraph "Application Cache (Redis)"
        R1[Session Data: 24h]
        R2[API Responses: 5-60 min]
        R3[Rate Limiting: window]
        R4[Rate Limiting: 15 min]
        R5[User Online Status: real-time]
    end
    
    subgraph "Database Cache"
        D1[PostgreSQL Shared Buffers]
        D2[Query Result Cache]
    end
    
    B1 --> C1
    B2 --> R2
    C1 --> R2
    R2 --> D1
```

### Cache Invalidation Rules

| Data Type | Cache Duration | Invalidation Trigger |
|-----------|---------------|---------------------|
| **User profile** | 5 minutes | Profile update, skill change |
| **Project listings** | 1 minute | New project created, status change |
| **Project details** | 5 minutes | Proposal submitted, project update |
| **Skill catalog** | 1 hour | Admin skill update |
| **Static assets** | 1 year | File hash change |
| **Session data** | 24 hours | Logout, token revocation |
| **Rate limit counters** | Window duration | Window expiry |

### Cache Key Naming

```
jobilo:{entity}:{id}:{field}:{locale}
```

Examples:
```
jobilo:user:123:profile:ar
jobilo:project:456:details:en
jobilo:skill:catalog:all:ar
```

---

## Error Handling Strategy | استراتيجية معالجة الأخطاء

### Error Classification

```mermaid
flowchart TD
    A[Error Occurs] --> B{Error Type?}
    
    B -->|Validation| C[400 Bad Request]
    B -->|Authentication| D[401 Unauthorized]
    B -->|Authorization| E[403 Forbidden]
    B -->|Not Found| F[404 Not Found]
    B -->|Conflict| G[409 Conflict]
    B -->|Rate Limit| H[429 Too Many Requests]
    B -->|Business Logic| I[422 Unprocessable Entity]
    B -->|Internal| J[500 Internal Server Error]
    B -->|Service Unavailable| K[503 Service Unavailable]
    
    C --> L[Return ErrorResponse]
    D --> L
    E --> L
    F --> L
    G --> L
    H --> L
    I --> L
    J --> L
    K --> L
    
    L --> M[Log to Audit]
    M --> N[Alert if Critical]
```

### Error Response Format

```typescript
// Standard error response
interface ApiErrorResponse {
  success: false;
  statusCode: number;
  error: string;
  message: string;
  timestamp: string;
  path: string;
  requestId: string;
  details?: {
    field?: string;
    constraint?: string;
    message?: string;
  }[];
}

// Example: 422 Validation Error
{
  "success": false,
  "statusCode": 422,
  "error": "VALIDATION_ERROR",
  "message": "Validation failed for CreateProjectDto",
  "timestamp": "2026-07-06T12:00:00.000Z",
  "path": "/api/v1/projects",
  "requestId": "req_abc123",
  "details": [
    {
      "field": "budget",
      "constraint": "min",
      "message": "budget must not be less than 10"
    },
    {
      "field": "title",
      "constraint": "isNotEmpty",
      "message": "title should not be empty"
    }
  ]
}
```

### Error Handling Layers

| Layer | Responsibility | Implementation |
|-------|---------------|----------------|
| **Client (React)** | Catch HTTP errors, display user-friendly messages | React ErrorBoundary, React Query `onError` |
| **Next.js SSR** | Handle server rendering errors | `error.tsx` pages, `not-found.tsx` |
| **NestJS Guard** | Auth/authorization failures | JwtAuthGuard, RbacGuard throw `UnauthorizedException` |
| **NestJS Pipe** | Input validation errors | ValidationPipe throws `BadRequestException` with details |
| **NestJS Interceptor** | Transform errors to consistent format | Global response interceptor |
| **NestJS Filter** | Catch unhandled exceptions | Global exception filter |
| **Prisma** | Database errors | PrismaClientExceptionFilter |
| **Winston Logger** | Log all errors with context | Structured logging to Loki |

---

## Monitoring and Observability | المراقبة والرصد

### Observability Stack

```mermaid
flowchart TD
    subgraph "Application Instrumentation"
        A1[NestJS: Prometheus Metrics]
        A2[NestJS: Winston Logger]
        A3[Next.js: Web Vitals]
        A4[Prisma: Query Logging]
    end
    
    subgraph "Metrics Collection"
        M1[Prometheus]
        M2[Grafana Loki]
    end
    
    subgraph "Visualization"
        V1[Grafana Dashboards]
        V2[AlertManager]
    end
    
    subgraph "Alerting"
        S1[Slack Webhook]
        S2[Email Alerts]
        S3[PagerDuty]
    end
    
    A1 --> M1
    A2 --> M2
    A3 --> M1
    A4 --> M2
    M1 --> V1
    M2 --> V1
    V1 --> S1
    V1 --> S2
    M1 --> V2
    V2 --> S3
    
    style V1 fill:#FF9900,color:#fff
    style S1 fill:#4A154B,color:#fff
    style S3 fill:#F44336,color:#fff
```

### Key Metrics

| Category | Metric | Instrumentation | Alert Threshold |
|----------|--------|-----------------|-----------------|
| **API Performance** | Request latency (p50/p95/p99) | NestJS Prometheus | p95 > 500ms |
| **API Performance** | Request rate (req/s) | NestJS Prometheus | N/A (baseline) |
| **API Performance** | Error rate (%) | NestJS Prometheus | > 1% |
| **Database** | Query execution time | Prisma logging | > 100ms |
| **Database** | Connection pool utilization | pg_stat_activity | > 80% |
| **Database** | Slow queries (>1s) | PostgreSQL logging | Any |
| **Infrastructure** | CPU usage (%) | Docker stats | > 80% |
| **Infrastructure** | Memory usage (%) | Docker stats | > 85% |
| **Infrastructure** | Disk I/O | Docker stats | > 80% IOPS |
| **Business** | Active users | Custom metric | Drop > 20% |
| **Business** | Project creation rate | Custom metric | Drop > 30% |
| **Business** | Error rate per endpoint | Custom metric | > 5% |

### Health Check Endpoints

| Endpoint | Checks | Response |
|----------|--------|----------|
| `GET /api/health` | Server status | `{ "status": "ok", "timestamp": "..." }` |
| `GET /api/health/readiness` | DB, Redis, MinIO connections | `{ "status": "ok", "checks": {...} }` |
| `GET /api/health/liveness` | Server process alive | `{ "status": "ok" }` |

### Logging Strategy

```typescript
// Log levels and usage
const LOG_CONFIG = {
  error:  'Unhandled exceptions, DB errors, auth failures',  // Always alert
  warn:   'Validation failures, rate limit hits, deprecated API usage',
  info:   'User actions (login, project create, proposal submit)',
  debug:  'Development-only verbose logging (disabled in production)',
};

// Structured log format
interface LogEntry {
  timestamp: string;
  level: 'error' | 'warn' | 'info' | 'debug';
  context: string;       // Module/class name
  message: string;
  requestId?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
  error?: {
    name: string;
    message: string;
    stack?: string;      // Only in development
  };
}
```

### Alerting Rules

| Alert | Condition | Severity | Action |
|-------|-----------|----------|--------|
| **High Error Rate** | Error rate > 5% for 5 minutes | Critical | Slack + PagerDuty |
| **High Latency** | p95 > 1s for 5 minutes | Warning | Slack |
| **Database Down** | Health check fails | Critical | PagerDuty + Email |
| **Low Disk Space** | Disk < 10% free | Warning | Slack |
| **Rate Limit Saturation** | 80% of rate limit used | Info | Slack (daily summary) |
| **Suspicious Activity** | 10+ failed logins per minute | Critical | Slack + Email |

---

## Rate Limiting Strategy | استراتيجية تحديد المعدل

```typescript
// Rate limit configuration by endpoint group
const rateLimits = {
  global:     { windowMs: 60_000,    max: 100 },  // 100 req/min
  auth:       { windowMs: 900_000,   max: 5 },    // 5 req/15 min
  register:   { windowMs: 3_600_000, max: 3 },    // 3 req/hour
  api:        { windowMs: 60_000,    max: 60 },   // 60 req/min
  fileUpload: { windowMs: 3_600_000, max: 10 },   // 10 uploads/hour
};
```

---

## Links | روابط ذات صلة

- [Architecture](ARCHITECTURE.md) — Detailed system architecture
- [Security](SECURITY.md) — Security architecture and policies
- [Deployment Guide](DEPLOYMENT_GUIDE.md) — Deployment configuration
- [README.md](../README.md) — Main project readme
