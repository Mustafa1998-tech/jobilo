# Jobilo — Test Plan

> **Version:** 1.0 | **Status:** Draft | **Cross-Ref:** [Test Strategy](TEST_STRATEGY.md), [Security Testing](SECURITY_TESTING.md), [Performance Testing](PERFORMANCE_TESTING.md)

---

## 1. Test Strategy Overview

This test plan defines the overall approach, scope, resources, and schedule for testing the Jobilo freelancing marketplace MVP. Testing spans multiple levels from unit to end-to-end, with a focus on quality, security, and performance for an Arabic-first platform.

### 1.1 Test Objectives

| Objective | Target |
|-----------|--------|
| Validate all functional requirements | 100% of P0 requirements |
| Achieve code coverage targets | Unit ≥ 80%, Integration ≥ 70%, E2E ≥ 60% |
| Ensure platform security | OWASP Top 10 compliance |
| Verify platform performance | < 300ms API p95 response |
| Ensure Arabic RTL rendering | All pages LTR/RTL tested |
| Validate accessibility | WCAG 2.1 AA |

### 1.2 Scope

| In-Scope | Out-of-Scope |
|----------|-------------|
| All MVP features (see [BRD](BUSINESS_REQUIREMENTS.md#4-mvp-scope)) | Payment gateway (Phase 2) |
| Frontend (Next.js 15) UI + UX | AI model accuracy validation |
| Backend (NestJS) REST APIs | Mobile native apps |
| WebSocket messaging | Third-party integrations beyond basic OAuth |
| Admin Dashboard | Enterprise features |
| RBAC implementation | |
| Email notifications | |

---

## 2. Testing Levels

### 2.1 Unit Testing

| Aspect | Detail |
|--------|--------|
| **Framework** | Jest (backend), Vitest (frontend — future) |
| **Location** | `*.spec.ts` files alongside source code |
| **Scope** | Services, utilities, helpers, DTOs, guards, pipes |
| **Target** | 80% line coverage, 70% branch coverage |
| **Mocking** | Jest mocks for PrismaService, external APIs |
| **Run Command** | `npm test` (backend) |
| **Critical Areas** | Auth service, proposal validation, business rules, password hashing |

### 2.2 Integration Testing

| Aspect | Detail |
|--------|--------|
| **Framework** | NestJS testing utilities + Supertest |
| **Location** | `test/` directory |
| **Scope** | API endpoints with real DB (Prisma test DB) |
| **Target** | 70% coverage |
| **Database** | Separate PostgreSQL test DB (`jobilo_test`) |
| **Setup** | Before all: run migrations on test DB; after all: drop DB |
| **Data** | Seed minimal test data (users, projects, proposals) |
| **Run Command** | `npm run test:e2e` |

### 2.3 End-to-End (E2E) Testing

| Aspect | Detail |
|--------|--------|
| **Framework** | Playwright |
| **Location** | `tests/e2e/` in project root |
| **Scope** | Critical user journeys in browser |
| **Target** | 60% of critical paths |
| **Critical Journeys** | Register → Create profile → Post project → Submit proposal → Accept → Message → Review |
| **Environment** | Staging environment with seeded data |
| **Run Command** | `npx playwright test` |
| **CI Integration** | GitHub Actions (on PR to main) |

### 2.4 Security Testing

| Aspect | Detail |
|--------|--------|
| **Approach** | OWASP Top 10, automated + manual |
| **Tools** | OWASP ZAP, Burp Suite (manual), npm audit |
| **Scope** | Auth bypass, XSS, CSRF, SQL injection, JWT vulnerabilities |
| **Schedule** | Every sprint (automated), quarterly (manual pentest) |
| **Reference** | [Security Testing Guide](SECURITY_TESTING.md) |

### 2.5 Performance Testing

| Aspect | Detail |
|--------|--------|
| **Tools** | k6 (load), Lighthouse (frontend) |
| **Scope** | API endpoints, page load, WebSocket |
| **Targets** | See [NFR-1](NON_FUNCTIONAL_REQUIREMENTS.md#NFR-1) |
| **Schedule** | Before each release |
| **Reference** | [Performance Testing Guide](PERFORMANCE_TESTING.md) |

---

## 3. Test Environment

### Environment Matrix

| Environment | URL | Database | Purpose |
|-------------|-----|----------|---------|
| **Local Dev** | `localhost:3000` (FE), `localhost:4000` (API) | Local PostgreSQL | Developer testing |
| **Test/CI** | GitHub Actions ephemeral | `jobilo_test` (ephemeral) | Automated test runs |
| **Staging** | `staging.jobilo.com` | Staging DB replica | QA, UAT, E2E |
| **Production** | `jobilo.com` | Production DB | Smoke tests only |

### Test Environment Requirements

| Component | Requirement |
|-----------|-------------|
| Node.js | 18.x LTS |
| PostgreSQL | 16 |
| RAM | 4GB minimum |
| Disk | 10GB+ |

---

## 4. Test Data Strategy

| Data Type | Source | Strategy |
|-----------|--------|----------|
| **Seed Data** | `prisma/seed.ts` | Users, categories, skills, sample projects |
| **Test Data (Unit)** | Factory functions + faker | Generate fresh data per test |
| **Test Data (Integration)** | Prisma test DB seed | Reusable seed with known IDs |
| **Test Data (E2E)** | Staging DB seed | Fixed dataset for reproducible tests |
| **Anonymous Data** | Faker.js / @faker-js/faker | Localized Arabic data |
| **Sensitive Data** | Not used in tests | All test data is synthetic |

---

## 5. Automation Approach

### 5.1 CI/CD Pipeline (GitHub Actions)

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_DB: jobilo_test
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx prisma migrate deploy
      - run: npm test          # Unit tests
      - run: npm run test:e2e  # Integration tests
      - run: npx playwright test  # E2E tests
```

### 5.2 Test Automation Triggers

| Trigger | Actions |
|---------|---------|
| PR to `develop` | Unit + Integration tests |
| PR to `main` | Unit + Integration + E2E + Security scan |
| Push to `main` | Full test suite + Lighthouse CI |
| Weekly (scheduled) | Full performance + security suite |
| Pre-release | Full regression + manual exploratory |

---

## 6. Manual Testing Areas

| Area | Tester | Frequency |
|------|--------|-----------|
| Arabic RTL rendering | QA | Every PR with UI changes |
| Responsive design (mobile) | QA | Every sprint |
| Cross-browser (Chrome, Firefox, Safari, Edge) | QA | Every release |
| Accessibility (screen reader) | QA + Dev | Every release |
| New feature exploratory | QA | Per feature |
| Regression smoke | QA | Per release |
| UAT (User Acceptance) | Product Owner | Per milestone |

### Manual Test Checklist (Sample — Registration)

- [ ] Registration form displays correctly in RTL
- [ ] All validation messages appear in Arabic
- [ ] OTP email is sent and renders correctly in Arabic
- [ ] OTP input works with auto-focus between fields
- [ ] Resend OTP throttling works (max 3 in 15 min)
- [ ] Password show/hide toggle works
- [ ] Terms link opens in new tab
- [ ] Google OAuth popup and callback work
- [ ] Mobile layout is usable (320px width)
- [ ] Error states show friendly Arabic messages

---

## 7. QA Process

### Sprint Cycle

```
Day 1-3: Development + Unit tests
Day 4:   Integration tests + Code review
Day 5:   QA handover → Manual testing
Day 6:   Bug fixes → Re-testing
Day 7:   Regression → Sign-off
```

### Bug Lifecycle

```
[Reported] → [Triaged] → [Assigned] → [Fixed] → [Verified] → [Closed]
```

### Bug Severity Levels

| Level | Definition | SLA |
|-------|-----------|-----|
| **Critical** | Platform down or core feature broken | Fix within 4 hours |
| **Major** | Feature broken but workaround exists | Fix within 24 hours |
| **Minor** | Cosmetic issue, no functional impact | Fix within 1 week |
| **Trivial** | Suggestion, enhancement | Backlog |

---

## 8. Bug Tracking

| Tool | Details |
|------|---------|
| **System** | GitHub Issues |
| **Labels** | `bug`, `severity/critical`, `severity/major`, `severity/minor`, `area/auth`, `area/projects`, etc. |
| **Template** | Bug report template with: description, steps to reproduce, expected vs actual, environment, screenshots |
| **Integration** | Auto-create from Sentry errors |

### Bug Report Template

```markdown
## Description
[Clear description of the bug]

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll to '...'
4. See error

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Environment
- Browser: [Chrome/Firefox/Safari]
- OS: [Windows/Mac/iOS/Android]
- Screen size: [Desktop/Tablet/Mobile]
- User role: [Freelancer/Client/Admin]

## Screenshots
[If applicable]

## Additional Context
[Any other relevant info]
```

---

## 9. Test Deliverables

| Deliverable | Description | Owner |
|-------------|-------------|-------|
| **Test Plan** | This document | QA Lead |
| **Test Strategy** | [TEST_STRATEGY.md](TEST_STRATEGY.md) | QA Lead |
| **Test Cases (Manual)** | Spreadsheet in Google Sheets | QA Team |
| **Automated Tests** | Code in repository | Dev + QA |
| **Test Reports** | Generated by Jest/Playwright per run | CI |
| **Bug Reports** | GitHub Issues | All |
| **Coverage Reports** | Istanbul/nyc output | CI |
| **Performance Reports** | k6 HTML reports | Dev |
| **Security Reports** | OWASP ZAP / npm audit | Dev |
| **Release Sign-off** | QA checklist | QA Lead |

---

*For details on automation and frameworks, see [TEST_STRATEGY.md](TEST_STRATEGY.md). For security test cases, see [SECURITY_TESTING.md](SECURITY_TESTING.md). For performance benchmarks and load testing, see [PERFORMANCE_TESTING.md](PERFORMANCE_TESTING.md).*
