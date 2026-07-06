# Code Review Guide

> Last Updated: 2026-07-06

This document defines the code review process for Jobilo. See [GOVERNANCE.md](./GOVERNANCE.md) for role definitions and [DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md) for PR submission workflow.

---

## 1. Review Timeline

```
PR Opened → Auto-assign reviewers (CODEOWNERS)
  ↓
Initial review within 24 hours
  ↓
Feedback loop (author + reviewer)
  ↓
Approval or Close
  ↓
Merge (by author or committer)
```

---

## 2. What Reviewers Should Check

### 2.1 Architecture and Design

| Check | Question |
|-------|---------|
| SRP | Does the module/class have a single responsibility? |
| DIP | Are dependencies injected via interfaces? |
| Layering | Does the code follow Clean Architecture layers? |
| Patterns | Is the correct pattern used (Service, Repository, etc.)? |

See [ARCHITECTURE_PRINCIPLES.md](./ARCHITECTURE_PRINCIPLES.md).

### 2.2 Functionality and Correctness

- Does the code meet the acceptance criteria?
- Are edge cases handled (empty lists, null values, boundary conditions)?
- Does the error handling cover expected failure modes?
- Are race conditions or timing issues possible?

### 2.3 Security Vulnerabilities

| Vulnerability | What to Look For |
|---------------|------------------|
| SQL injection | Raw queries with string interpolation (`query(${input})`) |
| XSS | Unsanitized `dangerouslySetInnerHTML`, `v-html` |
| CSRF | Missing CSRF tokens on state-changing requests |
| IDOR | Missing ownership checks on resource access |
| Mass assignment | Spreading user input directly to DB (`prisma.user.create({ data: body })`) |
| Secrets | Hardcoded API keys, passwords, tokens |

### 2.4 Performance Implications

- N+1 queries — check Prisma `.findMany()` inside loops
- Missing indexes — check `WHERE`/`ORDER BY` fields
- Unnecessary re-renders — check React `useCallback`/`useMemo`
- Large payloads — check response body sizes
- Missing pagination — check list endpoints

### 2.5 Code Style and Standards

See [CODING_STANDARDS.md](./CODING_STANDARDS.md):

- TypeScript strict mode compliance
- Naming conventions
- Import ordering
- Max line length (100 chars)
- Decorator order (NestJS)
- Server/Client component rules (Next.js)

### 2.6 Test Coverage

- Are there unit tests for new logic?
- Are there integration tests for API endpoints?
- Do tests cover edge cases and error paths?
- Are mocks appropriate (not over-mocked)?
- Is coverage >= 80%?

### 2.7 Documentation

- Are public APIs documented with JSDoc?
- Is OpenAPI spec updated for new endpoints?
- Are ADRs created for architectural decisions?
- Are README/guides updated if workflows changed?

### 2.8 Error Handling

```typescript
// ❌ Bad — silent failure
try {
  await this.sendEmail(user.email);
} catch {
  // do nothing
}

// ✅ Good — at least log and rethrow
try {
  await this.sendEmail(user.email);
} catch (error) {
  this.logger.error('Failed to send welcome email', error?.stack);
  throw new EmailDeliveryException('Welcome email failed', { cause: error });
}
```

### 2.9 Edge Cases

- Empty arrays / null values
- Very long strings (name, description)
- Unicode / special characters
- Concurrent requests on same resource
- User with no permissions
- Expired tokens / sessions

---

## 3. Review Process

### 3.1 Review Outcomes

| Outcome | Definition | Action |
|---------|------------|--------|
| **Approve** | Code is ready to merge | Reviewer clicks "Approve" |
| **Request Changes** | Blocking issues exist | Reviewer clicks "Request changes" |
| **Comment** | Suggestion or question | Reviewer adds comment without blocking |

### 3.2 Merging Rules

- `develop` merges: 1 approval required
- `main` merges: 2 approvals required
- Hotfix merges: at least 1 approval + maintainer sign-off
- Self-approval is prohibited

---

## 4. How to Write Good Review Comments

### Be Constructive

```
❌ "This is wrong."
✅ "This could throw if `user` is null. Consider adding a null check before accessing `user.email`."
```

### Explain Why

```
❌ "Use a different pattern here."
✅ "Using a raw SQL query here bypasses Prisma's type safety. Can we use `prisma.user.findUnique()` instead?"
```

### Offer Alternatives

```
✅ "Instead of a for-loop, `Promise.all()` would run these requests in parallel and improve performance."
```

### Use Prefix Labels

| Prefix | Meaning |
|--------|---------|
| **issue:** | Blocking problem |
| **question:** | Need clarification |
| **suggestion:** | Non-blocking improvement |
| **nit:** | Minor style preference |
| **praise:** | Positive feedback |

---

## 5. How to Respond to Reviews

1. **Acknowledge** — Thank the reviewer for their time
2. **Fix** — Address blocking issues
3. **Discuss** — If you disagree, explain your reasoning
4. **Resolve** — Mark conversations as resolved after addressing
5. **Re-request** — Request re-review when ready

```
@pixel
Great catch on the null user case. I've added a null check in
commit abc123. Can you take another look?
```

---

## 6. Escalation Process

```
Reviewer requests changes
  ↓
Author disagrees → Discussion in PR comments
  ↓
Still no consensus → Assign additional reviewer
  ↓
Still blocked → Escalate to Committer
  ↓
Still blocked → Final decision by Maintainer
```

---

## 7. Reviewer Checklist

- [ ] Code follows [CODING_STANDARDS.md](./CODING_STANDARDS.md)
- [ ] Architecture follows [ARCHITECTURE_PRINCIPLES.md](./ARCHITECTURE_PRINCIPLES.md)
- [ ] No security vulnerabilities introduced
- [ ] No N+1 queries or performance issues
- [ ] Error handling covers all failure modes
- [ ] Edge cases are handled
- [ ] Tests exist and pass
- [ ] Coverage >= 80%
- [ ] Documentation is updated
- [ ] PR description is complete
- [ ] Commit messages follow [COMMIT_CONVENTION.md](./COMMIT_CONVENTION.md)
- [ ] Branch name follows [BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md)

---

## 8. Related Documents

- [CODING_STANDARDS.md](./CODING_STANDARDS.md) — Style enforcement
- [ARCHITECTURE_PRINCIPLES.md](./ARCHITECTURE_PRINCIPLES.md) — Design review
- [DEFINITION_OF_DONE.md](./DEFINITION_OF_DONE.md) — Completion criteria
- [GOVERNANCE.md](./GOVERNANCE.md) — Role permissions
- [DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md) — PR submission
