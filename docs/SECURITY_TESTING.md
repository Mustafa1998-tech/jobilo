# Jobilo — Security Testing Guide

> **Version:** 1.0 | **Cross-Ref:** [NFR-2 (Security)](NON_FUNCTIONAL_REQUIREMENTS.md#NFR-2), [Test Plan](TEST_PLAN.md), [Test Strategy](TEST_STRATEGY.md)

---

## 1. OWASP Top 10 Testing

### A01: Broken Access Control

| Test Case | Expected Result | Test Method |
|-----------|----------------|-------------|
| Freelancer accesses admin endpoints | 403 Forbidden | Automated: Role guard test |
| User accesses another user's profile (IDOR) | 403 or filtered data | Automated: Integration test |
| Unauthenticated user calls protected API | 401 Unauthorized | Automated: E2E test |
| User modifies proposal belonging to another user | 403 Forbidden | Integration: IDOR check |

**Test Script (Integration):**
```typescript
it('should reject freelancer accessing admin endpoint', async () => {
  const freelancerToken = await getToken('freelancer@test.com');
  const res = await request(app.getHttpServer())
    .get('/api/admin/users')
    .set('Authorization', `Bearer ${freelancerToken}`);
  expect(res.status).toBe(403);
});
```

### A02: Cryptographic Failures

| Test Case | Expected Result |
|-----------|----------------|
| Password stored as bcrypt hash (not plaintext) | Hash != original, 12 rounds |
| JWT uses RS256 or HS256 with strong secret | Algorithm not 'none' |
| All API traffic over HTTPS (TLS 1.3) | HTTP → redirect to HTTPS |
| Encryption at rest for sensitive data | DB columns encrypted |

### A03: Injection

| Test Case | Expected Result | Test Method |
|-----------|----------------|-------------|
| SQL injection in search parameter | Prisma ORM parameterizes — no injection | Automated: OWASP ZAP |
| NoSQL injection attempt | Validation rejects malformed input | Manual |
| XSS in project description | HTML escaped on render, stored as text | Automated + Manual |
| XSS in user profile name (stored XSS) | Sanitized before display | Manual |

See Section 5 below for detailed XSS test cases.

### A04: Insecure Design

| Test Case | Expected Result |
|-----------|----------------|
| Rate limiting on login endpoint | 429 after 5 failed attempts |
| Account lockout after N failed OTP attempts | Locked for 15 minutes |
| No password in API response | Always excluded from serialization |
| Password reset token is single-use + expires | Cannot reuse link |

### A05: Security Misconfiguration

| Test Case | Expected Result |
|-----------|----------------|
| CORS configured for specific origins | Block cross-origin requests from unknown domains |
| Security headers present (X-Content-Type-Options, X-Frame-Options, CSP) | All headers returned |
| Debug/error stack traces hidden in production | Generic error messages |
| Default credentials changed | No default admin account |

### A06: Vulnerable & Outdated Components

| Test Case | Expected Result |
|-----------|----------------|
| npm audit run before each release | Zero critical vulnerabilities |
| Prisma version checked for known CVEs | Updated within 30 days of patch |
| Docker images scanned | No critical CVEs |

### A07: Identification & Authentication Failures

| Test Case | Expected Result |
|-----------|----------------|
| Weak passwords rejected | Min 8 chars, upper, lower, number |
| JWT token stolen — cannot be reused after logout | Token blacklisted |
| Refresh token rotation — old refresh token rejected | New token issued on each refresh |
| Session timeout after inactivity | 30 min idle → prompt re-login |
| Concurrent session management | Optional: limit to N sessions |

### A08: Software & Data Integrity Failures

| Test Case | Expected Result |
|-----------|----------------|
| File upload — type validation | Only allowed MIME types (jpg, png, pdf, docx) |
| File upload — size limit | Max 20MB per file |
| File upload — virus scan (future) | Infected file rejected |
| No untrusted deserialization | JSON only |

### A09: Security Logging & Monitoring

| Test Case | Expected Result |
|-----------|----------------|
| All admin actions logged | Audit trail with timestamp, user, IP, action |
| Failed login attempts logged | Visible in audit log |
| Suspicious activity alerts | Sentry error → Slack notification |

### A10: Server-Side Request Forgery (SSRF)

| Test Case | Expected Result |
|-----------|----------------|
| External URL fetch restricted | Only allowed domains |
| No internal network access via user input | IP/URL validation |

---

## 2. Authentication Testing

### 2.1 Registration Testing

| Test | Expected |
|------|----------|
| Register with valid data | Success, OTP sent |
| Register with existing email | 409 Conflict |
| Register with weak password | 422 Validation error |
| Register without accepting terms | 422 Validation error |
| Register with invalid email format | 422 Validation error |
| OAuth registration (Google) | Success, auto-verified |
| OAuth registration (Google, email exists) | 200, linked to existing account |

### 2.2 Login Testing

| Test | Expected |
|------|----------|
| Valid credentials | 200, JWT tokens |
| Invalid password | 401 Unauthorized |
| Non-existent user | 401 Unauthorized (not 404 — no user enumeration) |
| Unverified email | 403 "please verify your email" |
| Rate limit exceeded | 429 Too Many Requests |

### 2.3 JWT Testing

| Test | Expected |
|------|----------|
| Valid JWT access | 200 OK |
| Expired JWT access | 401 "token expired" |
| Invalid signature JWT | 401 "invalid token" |
| JWT with 'none' algorithm | 401 rejected |
| Blacklisted JWT | 401 "token revoked" |
| Missing JWT | 401 "unauthorized" |
| Refresh token rotation | Old refresh token invalidated |

---

## 3. Authorization Testing (RBAC)

### Permission Matrix Tests

| Action | Super Admin | Admin | Moderator | Support | Freelancer | Client |
|--------|-------------|-------|-----------|---------|------------|--------|
| Create admin user | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Delete user | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Suspend user | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| Moderate project | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| View reports | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ |
| View audit log | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| Post project | ✓ | ✓ | ✗ | ✗ | ✗ | ✓ |
| Submit proposal | ✓ | ✓ | ✗ | ✗ | ✓ | ✗ |

Each cell tested with automated integration tests.

---

## 4. Input Validation Testing

### 4.1 Common Injection Vectors

| Vector | Test Method |
|--------|-------------|
| `<script>alert('xss')</script>` in all text fields | API response sanitized |
| `' OR '1'='1` in search fields | Prisma parameterized query prevents injection |
| `../../etc/passwd` in file path params | Rejected — no path traversal |
| `{"$gt": ""}` in JSON body | Rejected — structured validation |
| Null bytes in strings | Truncated or rejected |
| Extremely long strings (10K+ chars) | Truncated to max length |

### 4.2 Numeric Field Testing

| Test | Expected |
|------|----------|
| Negative budget value | 422 Validation error |
| Budget = 0 | 422, min $10 |
| Budget > $1,000,000 | 422, max limit |
| Non-numeric in numeric field | 422 |
| Decimal precision > 2 | Rounded to 2 decimals |

---

## 5. XSS Testing

### 5.1 Stored XSS

| Input Field | Test Payload | Expected |
|-------------|-------------|----------|
| Project title | `<img src=x onerror=alert(1)>` | Escaped: rendered as text |
| Project description | `<script>document.cookie</script>` | Sanitized by DOMPurify |
| User bio | `<a href="javascript:alert(1)">click</a>` | `javascript:` URL removed |
| Review comment | `<iframe src="malicious.com"></iframe>` | iframe tag stripped |
| Message content | `<svg onload=alert(1)>` | SVG event handlers removed |

### 5.2 Reflected XSS

| Test | Expected |
|------|----------|
| Search query reflected on page | URL-encoded, escaped |
| Error message reflecting input | No HTML execution |
| Query params in URL rendered on page | Sanitized |

### 5.3 DOM-based XSS

| Test | Expected |
|------|----------|
| `innerHTML` usage in frontend | Replaced with `textContent` or sanitized |
| URL hash fragment renders content | Sanitized |
| `eval()` or `setTimeout(string)` | Never used |

---

## 6. CSRF Testing

| Test | Expected |
|------|----------|
| POST/PUT/DELETE without CSRF token | 403 Forbidden |
| Cross-origin form submission | Blocked by CORS + SameSite cookies |
| SameSite cookie attribute | `SameSite=Lax` or `SameSite=Strict` |
| Origin header validation | Server validates `Origin` header |

---

## 7. SQL Injection Testing

| Test | Expected |
|------|----------|
| `' UNION SELECT * FROM users--` in search | No error, no data leak |
| `'; DROP TABLE users;--` in any input | Blocked by ORM parameterization |
| `admin'--` in login email | Login fails |
| Time-based injection in filter params | No delay, response time consistent |

Since Prisma ORM is used with parameterized queries, SQL injection risk is minimal. Focus on:
- Raw SQL queries (if any) — must use parameterized inputs
- `Prisma.$queryRawUnsafe` — NEVER use in production code
- Report any `$queryRaw` usage for code review

---

## 8. JWT Security Testing

| Test | Expected |
|------|----------|
| Algorithm confusion (RS256 → HS256) | Rejected — key type validated |
| Token expiration bypass | Expired token rejected server-side |
| Token tampering (modify payload) | Signature invalid → rejected |
| Refresh token reuse detection | Old refresh token blacklisted on rotation |
| Token storage (frontend) | httpOnly cookie (not localStorage for MVP) |

---

## 9. Rate Limiting Testing

| Endpoint | Limit | Test |
|----------|-------|------|
| `/api/auth/login` | 5 attempts/min per IP | 6th attempt → 429 |
| `/api/auth/register` | 3 accounts/hour per IP | 4th registration → 429 |
| `/api/auth/verify-otp` | 5 attempts/15min | 6th → 429, lockout |
| `/api/projects` (POST) | 10 projects/day per client | 11th → 429 |
| `/api/proposals` (POST) | 20 proposals/day per freelancer | 21st → 429 |
| `/api/messages` (POST) | 100 messages/min | 101st → 429 |
| All other endpoints | 100 req/min per user | 101st → 429 |

---

## 10. Tools & Approaches

| Tool | Purpose | When Used |
|------|---------|-----------|
| **OWASP ZAP** | Automated vulnerability scanning | Every release (CI) |
| **Burp Suite** | Manual penetration testing | Quarterly |
| **npm audit** | Dependency vulnerability check | Every PR |
| **Snyk** (future) | Open-source vulnerability monitoring | Phase 2 |
| **ESLint plugin security** | Static analysis for security issues | Every commit |
| **Helmet** | Security headers middleware | Runtime — always on |
| **class-validator** + **Zod** | Input validation at API boundary | Runtime — always on |
| **Sentry** | Error tracking and alerting | Runtime — production |

### Automated Security Scan (CI) Checklist

| Scan | Command | Frequency |
|------|---------|-----------|
| Dependency audit | `npm audit` | Every PR |
| SAST (lint) | `npm run lint` | Every PR |
| OWASP ZAP baseline | `zap-baseline.py -t https://staging.jobilo.com` | Every release |
| Secret scanning | `gitleaks` | Every PR |

---

*For overall testing approach, see [TEST_PLAN.md](TEST_PLAN.md). For performance and load testing, see [PERFORMANCE_TESTING.md](PERFORMANCE_TESTING.md). Security requirements are defined in [NON_FUNCTIONAL_REQUIREMENTS.md — Security](NON_FUNCTIONAL_REQUIREMENTS.md#NFR-2).*
