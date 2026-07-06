# Development Guidelines

> Last Updated: 2026-07-06

This document covers day-to-day development workflows. For higher-level policies, see [GOVERNANCE.md](./GOVERNANCE.md). For commit format specifics, see [COMMIT_CONVENTION.md](./COMMIT_CONVENTION.md).

---

## 1. Development Environment Setup

### Prerequisites

| Tool | Version | Verification |
|------|---------|-------------|
| Node.js | >= 20 LTS | `node --version` |
| pnpm | >= 9 | `pnpm --version` |
| Docker Desktop | Latest | `docker --version` |
| Git | >= 2.40 | `git --version` |

### Setup Steps

```powershell
# Clone the repository
git clone https://github.com/jobilo/jobilo.git
cd jobilo

# Install dependencies
pnpm install

# Copy environment files
cp .env.example .env

# Start local infrastructure (PostgreSQL, Redis)
docker compose up -d

# Run database migrations
pnpm --filter @jobilo/api exec prisma migrate dev

# Start development servers
pnpm dev
```

---

## 2. Branch Naming Convention

All branches must follow this naming pattern:

| Prefix | Purpose | Pattern |
|--------|---------|---------|
| `feature/` | New features | `feature/JOB-123-description` |
| `fix/` | Bug fixes | `fix/JOB-456-login-error` |
| `chore/` | Maintenance | `chore/update-deps` |
| `docs/` | Documentation | `docs/api-contract-v2` |
| `refactor/` | Code refactoring | `refactor/user-service` |
| `hotfix/` | Urgent production fix | `hotfix/JOB-789-critical` |
| `release/` | Release preparation | `release/v1.2.3` |

See [BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md) for the complete workflow.

---

## 3. Conventional Commits

Every commit must follow the [Conventional Commits 1.0.0](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Allowed Types

| Type | Usage |
|------|-------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no logic change |
| `refactor` | Code restructuring |
| `perf` | Performance improvement |
| `test` | Adding or fixing tests |
| `build` | Build system or dependencies |
| `ci` | CI/CD configuration |
| `chore` | Routine tasks |
| `revert` | Revert a previous commit |

### Examples

```
feat(auth): add JWT refresh token rotation
fix(api): handle null user in profile endpoint
docs(api): update OpenAPI schema for job listing
refactor(user-service): extract email logic to own service
test(job-listing): add E2E tests for publish flow
ci: add lint step to GitHub Actions workflow
```

See [COMMIT_CONVENTION.md](./COMMIT_CONVENTION.md) for full details.

---

## 4. Code Review Expectations

| Aspect | Expectation |
|--------|-------------|
| **Self-review** | Run `pnpm lint` and `pnpm typecheck` before pushing |
| **Test coverage** | Minimum 80% coverage for new code |
| **PR description** | Fill template: summary, testing, screenshots |
| **Max PR size** | 400 lines changed (excluding generated files) |
| **Reviewers** | At least 1, minimum 2 for backend DB changes |
| **Turnaround** | Review within 24 hours |

See [CODE_REVIEW_GUIDE.md](./CODE_REVIEW_GUIDE.md) for the reviewer checklist.

---

## 5. Testing Requirements Before PR

```bash
# Required checks before every PR
pnpm lint              # No lint errors
pnpm typecheck         # No TypeScript errors
pnpm test              # All tests passing (unit + integration)
pnpm test -- --coverage  # Coverage >= 80%
```

| Test Type | Required | Command |
|-----------|----------|---------|
| Unit tests | Always | `pnpm --filter <package> test:unit` |
| Integration tests | If touching DB/API | `pnpm --filter <package> test:int` |
| E2E tests | For critical paths | `pnpm test:e2e` |

---

## 6. Documentation Requirements

Documentation must be updated when:

- Adding a new API endpoint (update OpenAPI spec)
- Changing database schema (update ERD in `docs/db/`)
- Introducing a new concept or flow (update relevant docs)
- Making architectural decisions (write ADR)

See [DEFINITION_OF_DONE.md](./DEFINITION_OF_DONE.md) for the full completion checklist.

---

## 7. PR Size Guidelines

- **Max 400 lines** of code changes per PR (excludes generated files, lockfiles, config)
- Larger changes must be broken into multiple PRs
- If a feature requires > 400 lines, create a feature flag and ship incrementally
- Use `docs/` PRs for large documentation rewrites

---

## 8. Merge Policy

| Branch | Into | Strategy |
|--------|------|----------|
| Feature branch | `develop` | Squash merge (1 commit = 1 feature) |
| Hotfix branch | `main` + `develop` | Squash merge |
| Release branch | `main` | Merge commit (preserves history) |
| `develop` | `main` | Merge commit (at release) |

See [BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md) for the lifecycle.

---

## 9. Related Documents

- [GOVERNANCE.md](./GOVERNANCE.md) — Roles, voting, communication
- [BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md) — Git flow, protection rules
- [COMMIT_CONVENTION.md](./COMMIT_CONVENTION.md) — Full commit spec
- [CODING_STANDARDS.md](./CODING_STANDARDS.md) — Code style enforcement
- [CODE_REVIEW_GUIDE.md](./CODE_REVIEW_GUIDE.md) — Review process
- [DEFINITION_OF_DONE.md](./DEFINITION_OF_DONE.md) — Completion criteria
- [DEFINITION_OF_READY.md](./DEFINITION_OF_READY.md) — Story readiness criteria
