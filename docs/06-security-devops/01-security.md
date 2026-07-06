# Jobilo - Security, DevOps, Testing & Deployment

---

## OWASP Top 10 Mitigation

| # | Risk | Mitigation |
|---|------|-----------|
| **A01** | Broken Access Control | RBAC guards on every endpoint, JWT validation, resource ownership checks |
| **A02** | Cryptographic Failures | bcrypt (12 rounds) for passwords, HTTPS only, encrypted secrets |
| **A03** | Injection | Prisma ORM (parameterized queries), Zod/class-validator input sanitization |
| **A04** | Insecure Design | Threat modeling in design phase, rate limiting, audit logs |
| **A05** | Security Misconfiguration | Environment-specific configs, automated security scans, minimal privileges |
| **A06** | Vulnerable Components | Dependabot auto-updates, `npm audit` in CI, regular dependency review |
| **A07** | Auth Failures | JWT with short expiry, refresh tokens, rate limiting on login, account lockout |
| **A08** | Data Integrity Failures | CSRF tokens, signed webhooks, file type/contents validation |
| **A09** | Logging Failures | Structured logging of all auth events, security alerts, SIEM integration |
| **A10** | SSRF | URL validation, block internal IPs, no direct user-controlled URLs |

---

## Security Implementation Details

### Password Security
```typescript
// Hashing
const salt = await bcrypt.genSalt(12);
const hash = await bcrypt.hash(password, salt);

// Verification
const isValid = await bcrypt.compare(inputPassword, storedHash);

// Never store plain text passwords
// Never log passwords
// Always hash on client side too (optional, defense in depth)
```

### JWT Strategy
```typescript
// Access Token (15 min)
const accessToken = this.jwtService.sign({
  sub: user.id,
  email: user.email,
  role: user.role,
}, { expiresIn: '15m' });

// Refresh Token (7 days)
const refreshToken = this.jwtService.sign({
  sub: user.id,
  tokenId: uuid(),
  type: 'refresh',
}, { expiresIn: '7d' });
```

### Rate Limiting Config
```typescript
// app.module.ts
ThrottlerModule.forRoot([{
  ttl: 60000,
  limit: 100,
  skipIf: (context) => {
    const request = context.switchToHttp().getRequest();
    return request.user?.role === 'ADMIN'; // Admins unlimited
  }
}]);

// Auth-specific (more restrictive)
@Throttle({ default: { limit: 5, ttl: 60000 } })
@Post('login')
async login(@Body() dto: LoginDto) { ... }
```

### CORS Configuration
```typescript
app.enableCors({
  origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
  exposedHeaders: ['X-Request-Id', 'X-RateLimit-*'],
});
```

### Helmet Security Headers
```typescript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "https://res.cloudinary.com"],
      connectSrc: ["'self'", "https://api.jobilo.com"],
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true },
}));
```

### File Upload Security
```typescript
// Check file type (MIME)
const allowedMimes = ['image/jpeg', 'image/png', 'application/pdf'];
if (!allowedMimes.includes(file.mimetype)) {
  throw new BadRequestException('نوع الملف غير مسموح');
}

// Check file size (10MB)
if (file.size > 10 * 1024 * 1024) {
  throw new BadRequestException('حجم الملف كبير جداً');
}

// Scan for malware (ClamAV integration - Phase 2)
// Virus scanning before storage

// Store via Cloudinary (not local filesystem)
// Cloudinary handles secure storage + CDN
```

### Data Encryption
```typescript
// At rest: PostgreSQL + Neon encrypted storage
// In transit: TLS 1.3 for all communication
// Sensitive fields: AES-256 encryption before DB storage
// Secrets: Never in code - always environment variables

// Example: encrypting payment account details
const encrypted = await this.encryptionService.encrypt(
  JSON.stringify(paymentDetails),
  process.env.ENCRYPTION_KEY
);
```

---

## DevOps & CI/CD

### GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm run lint
      - run: npm run format:check

  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_DB: jobilo_test
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
        ports: ['5432:5432']
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npx prisma generate
      - run: npx prisma db push
      - run: npm run test
      - run: npm run test:e2e

  build:
    needs: [lint, test]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm run build

  deploy:
    needs: [build]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy Backend to Koyeb
        uses: koyeb/action-deploy@v1
        with:
          api-key: ${{ secrets.KOYEB_API_KEY }}
          app-name: jobilo-api
          service-name: api
          
      - name: Deploy Frontend to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Branch Strategy
```
main          → Production (protected, only from release)
├── develop   → Staging (integration branch)
│   ├── feature/*  → New features (merge to develop)
│   ├── fix/*      → Bug fixes (merge to develop)
│   └── release/*  → Release candidates (merge to main)
└── hotfix/*   → Emergency fixes (direct to main, then backport)
```

### Environment Variables

```bash
# ===== Backend (.env) =====
# Database
DATABASE_URL="postgresql://user:pass@host:5432/jobilo"
DATABASE_URL_REPLICA="postgresql://user:pass@replica:5432/jobilo"

# JWT
JWT_ACCESS_SECRET="your-access-secret-min-32-chars"
JWT_REFRESH_SECRET="your-refresh-secret-min-32-chars"
JWT_ACCESS_EXPIRY="15m"
JWT_REFRESH_EXPIRY="7d"

# Encryption
ENCRYPTION_KEY="aes-256-key-min-32-chars"

# OAuth
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
LINKEDIN_CLIENT_ID="..."
LINKEDIN_CLIENT_SECRET="..."
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."

# Payments
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRICE_IDS='{"escrow_fee":"price_..."}'

# AI
OPENAI_API_KEY="sk-..."
OPENAI_MODEL="gpt-4o-mini"
OPENAI_MAX_TOKENS=2000

# File Storage
CLOUDINARY_CLOUD_NAME="jobilo"
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
CLOUDINARY_FOLDER="jobilo"

# Email
RESEND_API_KEY="re_..."
RESEND_FROM="noreply@jobilo.com"

# Redis (for caching, sessions, queues)
REDIS_URL="redis://user:pass@host:6379"

# Monitoring
SENTRY_DSN="https://..."
LOGTAIL_TOKEN="..."

# Platform
NODE_ENV="production"
PORT=4000
CORS_ORIGINS="https://jobilo.com,https://www.jobilo.com"
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
APP_URL="https://jobilo.com"
API_URL="https://api.jobilo.com"
```

---

## Testing Strategy

### Test Pyramid
```
         ┌──────┐
         │ E2E  │  (5% - Critical User Journeys)
        ┌┴──────┴┐
        │Integration│ (20% - API + Database + Services)
       ┌┴──────────┴┐
       │  Unit Tests  │ (75% - Pure logic, DTOs, Validators)
       └──────────────┘
```

### Unit Testing

| Tool | Purpose |
|------|---------|
| Jest | Test runner + assertions |
| vitest | Alternative (if using Vite) |
| faker.js | Generate realistic test data |
| ts-mockito | Mock dependencies |

**Coverage Target**: > 80%

**What to Unit Test**:
```typescript
// Services (business logic)
describe('ProjectsService', () => {
  it('should calculate budget range correctly');
  it('should not allow duplicate proposals');
  it('should update project status correctly');
  it('should notify freelancers when project is created');
});

// DTOs (validation)
describe('CreateProjectDto', () => {
  it('should validate title length (10-200)');
  it('should require at least one skill');
  it('should validate budget min max relationship');
});

// Guards
describe('RolesGuard', () => {
  it('should allow access for correct role');
  it('should deny access for wrong role');
  it('should allow public endpoints without token');
});
```

### Integration Testing

| Tool | Purpose |
|------|---------|
| Supertest | HTTP testing |
| Testcontainers | PostgreSQL via Docker |
| Prisma Test Utils | Database mocking |

**What to Integration Test**:
```typescript
describe('POST /api/v1/auth/register', () => {
  it('should register a new user');
  it('should return 409 for duplicate email');
  it('should return 400 for invalid password');
  it('should send verification email');
});

describe('GET /api/v1/projects', () => {
  it('should return paginated projects');
  it('should filter by category');
  it('should search by keyword');
  it('should not return closed projects for public');
});

describe('POST /api/v1/payments/escrow/fund', () => {
  it('should fund escrow successfully');
  it('should reject if contract not signed');
  it('should reject insufficient funds');
  it('should create transaction record');
});
```

### E2E Testing

| Tool | Purpose |
|------|---------|
| Playwright | Browser automation |
| Cypress | Alternative (if preferred) |

**Critical User Journeys to Test**:
```typescript
// 1. Complete Freelancer Journey
test('freelancer can register, find project, submit proposal', async () => {
  await page.goto('/register');
  await page.fill('[name=email]', 'test@example.com');
  // ... full flow
  await expect(page.locator('text=تم إرسال عرضك')).toBeVisible();
});

// 2. Complete Client Journey
test('client can post project, review proposals, hire', async () => {
  // ...
});

// 3. Payment Escrow Flow
test('client can fund escrow and release payment', async () => {
  // ...
});

// 4. Admin Moderation
test('admin can suspend user and resolve dispute', async () => {
  // ...
});
```

### Test Data Factories
```typescript
// factories/user.factory.ts
export function createUser(overrides: Partial<User> = {}): User {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    passwordHash: bcrypt.hashSync('TestPass1', 12),
    role: 'FREELANCER',
    status: 'ACTIVE',
    locale: 'ar',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

// factories/project.factory.ts  
export function createProject(overrides: Partial<Project> = {}): Project {
  return {
    id: faker.string.uuid(),
    clientId: faker.string.uuid(),
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    status: 'OPEN',
    // ...
    ...overrides,
  };
}
```

---

## Monitoring & Observability

### Stack
| Tool | Purpose |
|------|---------|
| **Sentry** | Error tracking (backend + frontend) |
| **Logtail** (Better Stack) | Structured log management |
| **Grafana** | Metrics dashboards |
| **Prometheus** | Metrics collection |
| **Health Check** | `/api/v1/health` endpoint |
| **Uptime Robot** | External uptime monitoring |

### Key Metrics to Monitor
```typescript
// Business Metrics
- MAU (Monthly Active Users)
- Projects Created / Hour
- Proposals Submitted / Hour
- GMV (Gross Merchandise Value)
- Completion Rate
- Average Response Time

// Technical Metrics
- API Response Time (p50, p95, p99)
- Error Rate (5xx / total)
- Database Query Time
- AI API Latency
- Cache Hit Rate
- Active WebSocket Connections

// Infrastructure
- CPU / Memory Usage
- Database Connections
- Disk Space
- Network I/O
```

### Alerting Rules
```yaml
# Critical (PagerDuty)
api_5xx_rate > 5% for 5 minutes
api_p99_response_time > 2s for 10 minutes
uptime < 99.9%

# Warning (Email/Slack)
error_rate > 1% for 15 minutes
database_connections > 80% of max
ai_api_latency > 5s for 5 minutes

# Info (Slack)
new_user_signups > 1000/day (growth alert)
cache_hit_rate < 50%
```

---

## Backup & Disaster Recovery

### Backup Schedule
| Type | Frequency | Retention | Storage |
|------|-----------|-----------|---------|
| Full DB | Daily | 30 days | Neon PITR |
| WAL (continuous) | Real-time | 7 days | Neon |
| File backups (Cloudinary) | N/A | N/A | Cloudinary |
| Environment configs | On change | 90 days | GitHub Secrets |

### Disaster Recovery Plan
```yaml
Scenario 1: Database Corruption
  1. Initiate point-in-time recovery (PITR) via Neon
  2. Target: < 15 minutes ago (RPO)
  3. Verify data integrity
  4. Switch connection string

Scenario 2: Region Failure
  1. Neon automatically handles (multi-region)
  2. Koyeb failover to nearest region
  3. Vercel CDN continues serving static
  4. Estimated RTO: < 1 hour

Scenario 3: Full Application Failure
  1. Git revert to last known good commit
  2. CI/CD rebuild and deploy
  3. DB restore if needed
  4. Estimated RTO: < 2 hours

Scenario 4: Security Breach
  1. Immediate service takedown
  2. Rotate all secrets
  3. Forensic analysis
  4. User notification if data affected
  5. Gradual re-deploy with fixes
```

### Runbook
```bash
# Emergency: Rollback to previous deployment
koyeb rollback jobilo-api --app jobilo
vercel rollback jobilo --prod

# Emergency: Database restore
psql "connection-string" < backup_2026_06_27.sql

# Emergency: Block user
curl -X PATCH https://api.jobilo.com/api/v1/admin/users/uuid/status \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"status": "BANNED"}'
```
