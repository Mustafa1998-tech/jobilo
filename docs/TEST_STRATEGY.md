# Jobilo — Test Strategy

> **Version:** 1.0 | **Status:** Approved | **Cross-Ref:** [Test Plan](TEST_PLAN.md), [Security Testing](SECURITY_TESTING.md), [Performance Testing](PERFORMANCE_TESTING.md)

---

## 1. Testing Pyramid

```
         ╱ ╲
        ╱ E2E ╲           ← 60% coverage (Playwright)
       ╱───────╲
      ╱Integration╲        ← 70% coverage (NestJS Testing + Supertest)
     ╱─────────────╲
    ╱   Unit Tests   ╲     ← 80% coverage (Jest / Vitest)
   ╱───────────────────╲
  ╱   Static Analysis   ╲  ← ESLint, Prettier, TypeScript strict
 ╱─────────────────────────╲
```

---

## 2. Unit Testing

### 2.1 Backend (NestJS — Jest)

| Aspect | Detail |
|--------|--------|
| **Framework** | Jest (v29) with `ts-jest` |
| **Config** | `jest` block in `backend/package.json` |
| **Test Match** | `*.spec.ts` inside `src/` |
| **Root Dir** | `backend/src` |
| **Coverage Tool** | Istanbul (built into Jest) |
| **Coverage Report** | `backend/coverage/` |

**Test Structure (Convention):**
```
src/
├── modules/
│   ├── auth/
│   │   ├── auth.service.ts
│   │   ├── auth.service.spec.ts       ← Unit test
│   │   ├── auth.controller.ts
│   │   ├── auth.controller.spec.ts    ← Unit test
│   │   └── strategies/
│   │       ├── jwt.strategy.ts
│   │       └── jwt.strategy.spec.ts   ← Unit test
```

**What to Test:**
- All service methods (success + error paths)
- Guards and pipes (isolated)
- DTO validation rules
- Business logic (see [Business Rules](BUSINESS_RULES.md))
- Helper/utility functions

**What NOT to Test (in unit tests):**
- Database interactions (mock PrismaService)
- HTTP request/response cycle (integration tests)
- External API calls (mock or stub)

**Example — Auth Service Unit Test:**
```typescript
describe('AuthService', () => {
  let service: AuthService;
  let prisma: MockPrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();
    service = module.get(AuthService);
  });

  describe('register', () => {
    it('should hash password and create user', async () => {
      const result = await service.register(registerDto);
      expect(result.user.email).toBe(registerDto.email);
      expect(result.user.password).not.toBe(registerDto.password); // hashed
    });

    it('should throw on duplicate email', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(existingUser);
      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
    });
  });
});
```

**Coverage Targets by Module:**

| Module | Target |
|--------|--------|
| Auth | 90% |
| Users | 85% |
| Projects | 85% |
| Proposals | 85% |
| Messaging (Gateway) | 70% |
| Reviews | 80% |
| Notifications | 75% |
| Admin | 75% |
| CMS | 80% |
| Subscriptions | 80% |

### 2.2 Frontend (Next.js — Vitest — Future)

| Aspect | Detail |
|--------|--------|
| **Framework** | Vitest (faster than Jest for frontend) |
| **Scope** | Components, hooks, utilities |
| **Rendering** | @testing-library/react |
| **Target** | 80% coverage |
| **Status** | Phase 2 — MVP focus on backend testing first |

---

## 3. Integration Testing

### 3.1 NestJS Testing Utilities + Supertest

| Aspect | Detail |
|--------|--------|
| **Framework** | `@nestjs/testing` + `supertest` |
| **Test Match** | `*.e2e-spec.ts` in `test/` |
| **Database** | Isolated PostgreSQL test DB |
| **Config** | `test/jest-e2e.json` |

**Integration Test Structure:**
```
test/
├── app.e2e-spec.ts              ← Root module test
├── auth.e2e-spec.ts              ← Auth endpoints
├── projects.e2e-spec.ts          ← Project endpoints
├── proposals.e2e-spec.ts         ← Proposal endpoints
├── jest-e2e.json                 ← Jest config
└── setup.ts                      ← BeforeAll/AfterAll hooks
```

**What to Test:**
- Full HTTP request → Controller → Service → Database → Response cycle
- Authentication guards (protected vs public endpoints)
- Request validation (DTOs with class-validator)
- Error handling (404, 401, 403, 409, 422, 500)
- Pagination, filtering, sorting

**Database Strategy:**

```typescript
// test/setup.ts
beforeAll(async () => {
  // Run migrations on test DB
  await exec('npx prisma migrate deploy');
  // Seed test data
  await seedTestData();
});

afterAll(async () => {
  // Disconnect and clean up
  await prisma.$disconnect();
});
```

### 3.2 API Endpoint Coverage

| Endpoint Group | Test Cases |
|---------------|-----------|
| POST /api/auth/register | Valid registration, duplicate email, invalid data, OAuth flow |
| POST /api/auth/login | Valid credentials, wrong password, non-existent user |
| GET /api/projects | Pagination, filtering, search, no auth required |
| POST /api/projects | Create as client, forbidden as freelancer, validation errors |
| GET /api/proposals | List proposals, filter by status, authorization check |
| PATCH /api/users/:id | Update profile, invalid data, role changes |

---

## 4. E2E Testing (Playwright)

| Aspect | Detail |
|--------|--------|
| **Framework** | Playwright (v1.40+) |
| **Location** | `tests/e2e/` |
| **Browsers** | Chromium, Firefox, WebKit |
| **Device Emulation** | Desktop (1920x1080), Mobile (iPhone 12, 390x844) |
| **RTL Testing** | Playwright with `dir="rtl"` assertions |

**Critical E2E Journeys:**

| Journey | Steps | Priority |
|---------|-------|----------|
| **Freelancer Happy Path** | Register → Verify email → Complete profile → Browse projects → Submit proposal | P0 |
| **Client Happy Path** | Register → Create project → Review proposals → Accept → Leave review | P0 |
| **Admin Moderation** | Login as admin → Find reported project → Moderate → Suspend user | P0 |
| **Messaging Flow** | Freelancer submits proposal → Client messages → Freelancer replies | P0 |
| **Password Reset** | Request reset → Click email link → Set new password → Login | P0 |

**Example — Playwright Test:**
```typescript
test('freelancer completes registration and verifies email', async ({ page }) => {
  await page.goto('/register');
  await page.selectRole('freelancer');
  await page.fill('[name="name"]', 'أحمد محمد');
  await page.fill('[name="email"]', 'ahmed@test.com');
  await page.fill('[name="password"]', 'Test@1234');
  await page.click('button[type="submit"]');

  // OTP page should appear
  await expect(page.locator('text=تحقق من بريدك الإلكتروني')).toBeVisible();
  // ... enter OTP from test email service
});
```

---

## 5. API Testing (Postman)

| Aspect | Detail |
|--------|--------|
| **Collection** | `Jobilo-API.postman_collection.json` |
| **Environment** | `Jobilo-Local.postman_environment.json`, `Jobilo-Staging.postman_environment.json` |
| **Automation** | Newman CLI in CI pipeline |
| **Auth** | Pre-request script to get JWT token |

**Collection Structure:**
```
Jobilo API
├── Auth
│   ├── Register (Email)
│   ├── Register (Google)
│   ├── Login
│   ├── Verify Email
│   └── Reset Password
├── Users
│   ├── Get Profile
│   ├── Update Profile
│   └── Upload Avatar
├── Projects
│   ├── List Projects (with query params)
│   ├── Get Project
│   ├── Create Project
│   ├── Update Project
│   └── Delete Project
├── Proposals
│   ├── Submit Proposal
│   ├── List Proposals
│   ├── Accept Proposal
│   └── Reject Proposal
├── Messaging
│   ├── Get Conversations
│   ├── Get Messages
│   └── Send Message
└── Admin
    ├── Dashboard Stats
    ├── List Users
    ├── Suspend User
    └── Moderate Project
```

---

## 6. CI/CD Integration

### Pipeline Stages

```
[Lint] → [Unit Tests] → [Integration Tests] → [Build] → [E2E Tests] → [Security Scan]
```

### Quality Gates

| Gate | Threshold | Action on Failure |
|------|-----------|-------------------|
| ESLint | No errors | Block PR merge |
| Unit Tests | ≥ 80% coverage, all passing | Block PR merge |
| Integration Tests | ≥ 70% coverage, all passing | Block PR merge |
| E2E Tests | Critical journeys pass | Block release |
| Security Scanner | No critical/high findings | Block release |
| Lighthouse CI | Performance ≥ 85 | Warning |
| Bundle Size | ≤ 200KB JS gzipped | Warning |

---

## 7. Test Reporting

| Report | Tool | Format |
|--------|------|--------|
| Unit Test Results | Jest | JUnit XML / HTML |
| Integration Results | Jest + Supertest | JUnit XML |
| E2E Results | Playwright | HTML + Trace |
| Coverage Report | Istanbul (nyc) | HTML + LCOV |
| Performance Report | k6 | HTML + JSON |
| Lighthouse Report | Lighthouse CI | HTML + JSON |
| Security Report | OWASP ZAP | HTML + XML |

---

*For the overall test planning (environment, process, deliverables), see [TEST_PLAN.md](TEST_PLAN.md). For specific security test cases, refer to [SECURITY_TESTING.md](SECURITY_TESTING.md). For load and performance benchmarks, refer to [PERFORMANCE_TESTING.md](PERFORMANCE_TESTING.md).*
