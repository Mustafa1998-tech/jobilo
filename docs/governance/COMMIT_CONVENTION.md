# Commit Convention

> Last Updated: 2026-07-06

This document defines the commit message format for Jobilo, based on [Conventional Commits 1.0.0](https://www.conventionalcommits.org/). See [DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md) for the overall workflow and [BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md) for branch naming.

---

## 1. Commit Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

Spacing is mandatory: a space after `type(scope):`.

---

## 2. Allowed Types

| Type | Emoji | Description | Bumps Version |
|------|-------|-------------|---------------|
| `feat` | ✨ | A new feature | minor |
| `fix` | 🐛 | A bug fix | patch |
| `docs` | 📝 | Documentation only | — |
| `style` | 💄 | Formatting, no logic change | — |
| `refactor` | ♻️ | Code restructuring | — |
| `perf` | ⚡️ | Performance improvement | — |
| `test` | ✅ | Adding or fixing tests | — |
| `build` | 📦 | Build system or dependencies | — |
| `ci` | 👷 | CI/CD configuration | — |
| `chore` | 🔧 | Routine tasks, maintenance | — |
| `revert` | ⏪ | Revert a previous commit | — |

---

## 3. Scope Specification

Scope identifies the area of the codebase the change affects:

| Scope | Area |
|-------|------|
| `api` | NestJS backend |
| `web` | Next.js frontend |
| `shared` | Shared packages |
| `prisma` | Database schema / migrations |
| `auth` | Authentication module |
| `jobs` | Job listings module |
| `users` | User management module |
| `infra` | Infrastructure / Docker |
| `config` | Configuration files |
| `deps` | Dependency updates |
| `release` | Release workflow |

### Examples

```
feat(api): add pagination to job listings endpoint
fix(web): correct date formatting in job cards
feat(auth): implement OAuth2 Google login
docs(api): update OpenAPI spec for user endpoints
chore(deps): upgrade NestJS to v10.4
```

---

## 4. Breaking Changes

Breaking changes are indicated with `!` before the `:` or with a `BREAKING CHANGE:` footer:

```
feat(api)!: remove deprecated v1 endpoints

BREAKING CHANGE: The /api/v1/* endpoints have been removed.
Migrate to /api/v2/* endpoints.
```

Version impact: **major** version bump.

---

## 5. Body and Footer Rules

| Section | Rules | Example |
|---------|-------|---------|
| **Description** | Max 72 chars, imperative mood, no period | `feat(auth): add refresh token rotation` |
| **Body** | Blank line after description, wrap at 72 chars | Explains _what_ and _why_, not _how_ |
| **Footer** | Blank line after body | `BREAKING CHANGE:`, `Refs:`, `Closes:` |

### Complete Example

```
feat(api): add pagination to job listings endpoint

Implement cursor-based pagination for the GET /api/jobs endpoint
to improve performance for large result sets. Uses Prisma's cursor
connection pattern with an opaque cursor token.

Closes JOB-456
Refs: #89
```

---

## 6. Examples by Type

| Type | Example |
|------|---------|
| `feat` | `feat(api): add job listing CRUD endpoints` |
| `fix` | `fix(web): handle null user profile image` |
| `docs` | `docs: add API authentication guide` |
| `style` | `style: format files with Prettier v3` |
| `refactor` | `refactor(api): extract email service from user module` |
| `perf` | `perf(web): lazy load job listings images` |
| `test` | `test(api): add unit tests for auth guard` |
| `build` | `build: configure Turborepo cache` |
| `ci` | `ci: add lint step to GitHub Actions` |
| `chore` | `chore(deps): upgrade Prisma to v5.10` |
| `revert` | `revert: feat(api): add job listing CRUD` |

---

## 7. Git Commit Template

Save as `.gitmessage` in the repo root:

```
# <type>(<scope>): <description> (72 chars max)
#
# Allowed types: feat, fix, docs, style, refactor, perf, test,
#                build, ci, chore, revert
# Allowed scopes: api, web, shared, prisma, auth, jobs, users,
#                 infra, config, deps, release
#
# Breaking: add ! after type/scope (e.g., feat!:) or add
# BREAKING CHANGE: footer
#
# Body: explain WHAT and WHY (not HOW). Wrap at 72 chars.
#
# Footer: Refs: JOB-123, Closes: JOB-456
#
# --- COMMIT END ---
```

Usage:
```bash
git config commit.template .gitmessage
```

---

## 8. Commit Hooks (commitlint)

Commit messages are validated via [commitlint](https://commitlint.js.org/) in a pre-commit hook:

```jsonc
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'feat', 'fix', 'docs', 'style', 'refactor',
      'perf', 'test', 'build', 'ci', 'chore', 'revert',
    ]],
    'scope-enum': [2, 'always', [
      'api', 'web', 'shared', 'prisma', 'auth',
      'jobs', 'users', 'infra', 'config', 'deps', 'release',
    ]],
    'header-max-length': [2, 'always', 72],
    'body-max-line-length': [2, 'always', 72],
  },
};
```

---

## 9. JIRA / Issue Reference

Reference issues in the footer:

| Prefix | Meaning | Example |
|--------|---------|---------|
| `Refs:` | Related issues | `Refs: JOB-123, JOB-456` |
| `Closes:` | Issues this commit resolves | `Closes: JOB-123` |
| `Fixes:` | Bug issues this resolves | `Fixes: JOB-456` |

Branch naming should include the JIRA ticket: `feature/JOB-123-user-auth`.

---

## 10. Related Documents

- [DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md) — Branch naming, PR workflow
- [BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md) — Branch lifecycle
- [CODE_REVIEW_GUIDE.md](./CODE_REVIEW_GUIDE.md) — Review expectations
