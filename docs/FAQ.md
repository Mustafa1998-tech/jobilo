# Frequently Asked Questions (FAQ)

> **Version:** 1.0 | **Last Updated:** 2026-07-06

## Table of Contents

1. [Technical FAQ](#technical-faq)
2. [Business FAQ](#business-faq)
3. [Development FAQ](#development-faq)

---

## Technical FAQ

### Setup & Environment

**Q: How do I set up the project locally?**

Follow the steps in [ONBOARDING.md](./ONBOARDING.md#repository-setup):

```bash
git clone git@github.com:jobilo-platform/jobilo.git
cd jobilo
pnpm install
# Copy .env files from .env.example
pnpm dev
```

**Q: What versions of Node.js and pnpm do I need?**

- Node.js v20+ (LTS recommended)
- pnpm v8+ (`npm install -g pnpm`)

Check your versions:
```bash
node --version   # Should be >= 20
pnpm --version   # Should be >= 8
```

**Q: I get "port 3000 already in use" error. What do I do?**

Kill the process using that port:
```bash
# Find process on port 3000
netstat -ano | findstr :3000
# Kill by PID
taskkill /PID <PID> /F

# Or use a different port
# frontend/.env.local: NEXT_PUBLIC_APP_URL=http://localhost:3001
```

**Q: How do I reset the database?**

```bash
pnpm --filter backend db:drop
pnpm --filter backend db:create
pnpm --filter backend db:migrate
pnpm --filter backend db:seed
```

**Q: Docker doesn't start on Windows. What should I check?**

- Ensure WSL2 is installed: `wsl --status`
- Ensure Docker Desktop is using WSL2 backend
- Check that virtualization is enabled in BIOS
- Run Docker Desktop as administrator
- See [Docker troubleshooting](https://docs.docker.com/desktop/troubleshoot/)

### Common Errors

**Q: I get "Cannot find module" errors after pulling latest changes.**

```bash
pnpm install  # Dependencies may have changed
```

**Q: Database migration fails with "relation already exists".**

```bash
pnpm --filter backend db:drop   # Drop all tables
pnpm --filter backend db:migrate # Run fresh migrations
pnpm --filter backend db:seed    # Re-seed data
```

**Q: ESLint is failing on pre-commit hook.**

```bash
pnpm lint  # Check which files have issues
pnpm lint --fix  # Auto-fix where possible
```

**Q: TypeScript error: "Type 'X' is not assignable to type 'Y'".**

Check that the types match the API response. If the API changed, update the types:
- Frontend types: `frontend/src/types/`
- Backend DTOs: `backend/src/modules/*/dto/`

**Q: Tests fail with "Timeout" error.**

Increase the test timeout in jest config or use:
```bash
pnpm test -- --testTimeout=30000
```

**Q: "Connection refused" to PostgreSQL.**

```bash
# Ensure PostgreSQL is running
docker compose up -d postgres
# Or check local PostgreSQL service
net start postgresql
```

**Q: How do I debug a failing API request?**

1. Check the browser DevTools Network tab
2. Check the backend logs (`logs/combined.log` or console output)
3. Check the correlation ID and search in logs
4. Check [ERROR_CODES.md](./ERROR_CODES.md) for the error code
5. For API documentation, visit `http://localhost:3001/api/docs`

### Performance

**Q: The frontend dev server is slow. How can I speed it up?**

- Use `pnpm --filter frontend dev` instead of the full `pnpm dev`
- Increase Node.js memory: `NODE_OPTIONS=--max-old-space-size=4096`
- Use `next/font` with `display: 'swap'` (already configured)
- Disable React Strict Mode in development if needed

**Q: Why is the API responding slowly in development?**

- Check if a lot of seed data was loaded
- Check for missing database indexes
- Enable query logging: set `DEBUG=true` in `backend/.env`
- See [MONITORING.md](./MONITORING.md) for performance metrics

---

## Business FAQ

**Q: What is Jobilo?**

Jobilo is a professional freelancing platform connecting businesses (clients) with skilled freelancers. It supports both Arabic and English with full RTL support. The platform facilitates project posting, proposal submission, hiring, contract management, payments, and dispute resolution.

**Q: Is Jobilo free to use?**

- **Freelancers**: Free to create profiles, browse projects, and submit proposals. Jobilo takes a commission (10%) on completed projects.
- **Clients**: Free to post projects and browse freelancers. A service fee (5%) is added to project payments.
- **Admin panel**: Internal use only, not customer-facing.

**Q: How does the matching system work?**

The platform does not use AI-based matching. Instead, matching is based on:
- Skills matching (freelancer skills vs project requirements)
- Category filtering
- Budget range compatibility
- Location preferences
- Manual search by clients

**Q: How are payments handled?**

Payments are processed through a third-party payment gateway (Stripe). Funds are held in escrow until the project is approved by the client. Commission is deducted before the freelancer receives payment.

**Q: Can I cancel a project after hiring?**

- Before work starts: Full refund minus processing fee
- During work: Proportional refund based on completed milestones
- After completion: No refund; disputes handled through the resolution center

**Q: How is dispute resolution handled?**

1. Client and freelancer attempt to resolve directly
2. If no resolution, either party can open a formal dispute
3. Admin reviews the dispute and makes a decision
4. Funds are released per admin decision

**Q: Is there a mobile app?**

Currently, Jobilo is a **web-only** platform optimized for mobile browsers. A native mobile app is on the roadmap.

**Q: What languages are supported?**

Arabic (RTL) and English (LTR). The platform detects the user's browser language and defaults to Arabic for users in the MENA region.

---

## Development FAQ

### Coding Standards

**Q: What coding standards do we follow?**

| Aspect | Standard |
|--------|----------|
| TypeScript | Strict mode enabled |
| Naming | camelCase for variables/functions, PascalCase for components/classes |
| File naming | kebab-case for files |
| CSS | Tailwind utility classes (no CSS-in-JS libraries) |
| Imports | Absolute imports with `@/` prefix |
| Comments | Minimal; code should be self-documenting |
| Exports | Named exports for components |

**Q: Should I use functional or class components?**

**Functional components only** with hooks. No class components.

**Q: Should I use `any` in TypeScript?**

No. Avoid `any` unless absolutely necessary and justified in a comment. Use `unknown` instead if the type is truly unknown.

**Q: How should I handle errors in the frontend?**

1. Use try/catch in async functions
2. Use `ErrorBoundary` for component errors
3. Use React Query's `onError` for server errors
4. Use `showToast` for user-facing notifications
5. See [ERROR_CODES.md](./ERROR_CODES.md) for error handling patterns

**Q: How do I add a new environment variable?**

1. Add to `.env.local` (local) or `.env.example` (committed)
2. For frontend: prefix with `NEXT_PUBLIC_` to expose to client
3. For backend: add validation in `config/` module
4. Update the relevant docs if applicable

### Testing

**Q: What testing framework do we use?**

| Layer | Framework | Location |
|-------|-----------|----------|
| Unit tests (backend) | Jest | `backend/src/**/*.spec.ts` |
| Unit tests (frontend) | Jest + Testing Library | `frontend/src/**/*.test.tsx` |
| E2E tests | Playwright | `frontend/e2e/` |
| API tests | Supertest | `backend/test/` |

**Q: Should I write tests for everything?**

Target 80%+ coverage for new code. Priority on:

- Business logic / services
- API endpoints / controllers
- Complex UI components (forms, data tables)
- Authentication and authorization flows
- Edge cases and error states

**Q: How do I run only specific tests?**

```bash
# Backend: test file matching pattern
pnpm --filter backend test -- --testPathPattern="auth.service"

# Frontend: test file matching pattern
pnpm --filter frontend test -- --testPathPattern="ProjectForm"
```

### PR & Code Review

**Q: What makes a good PR?**

- Small scope (1 feature or 1 bug fix)
- Descriptive title and description
- Linked to Linear ticket
- All tests passing
- Screenshots for UI changes
- No unrelated changes

**Q: How long should a PR review take?**

Reviewers should respond within **24 hours**. Small PRs (< 200 lines) should be reviewed within **4 hours**.

**Q: What if my PR is urgent?**

Tag the PR with the `urgent` label and ping in `#dev` Slack channel with a reason.

**Q: Can I merge my own PR?**

No. Every PR requires at least one approval from a teammate. The reviewer must be someone other than the author.

### Git & Branching

**Q: What branch should I base my work on?**

Always base your feature branch on `main`:

```bash
git checkout main
git pull origin main
git checkout -b feature/JOB-123-description
```

**Q: Should I rebase or merge?**

Use **rebase** to keep a clean history:

```bash
git rebase main  # Before pushing, rebase on latest main
git push origin feature/JOB-123-description --force-with-lease
```

**Q: What if there are merge conflicts during rebase?**

```bash
git rebase main
# Fix conflicts in affected files
git add .
git rebase --continue
# If stuck: git rebase --abort
```

**Q: How do I undo a commit?**

```bash
# Undo last commit but keep changes
git reset --soft HEAD~1

# Undo last commit and discard changes
git reset --hard HEAD~1
```

### Deployment

**Q: How do I deploy to staging?**

Pushing to the `main` branch automatically deploys to staging via GitHub Actions. Check the Actions tab for status.

**Q: How do I deploy to production?**

Production deployments are manual and require:

1. Release Manager approval
2. All tests passing
3. QA sign-off
4. Create a release tag: `git tag v1.2.3 && git push origin v1.2.3`

**Q: How do I rollback a deployment?**

```bash
# Via GitHub: use "Re-run job" with previous successful workflow
# Or manually: deploy the previous Docker image tag
docker pull jobilo/api:previous-version
docker compose up -d
```

---

## Cross-References

| Document | Link |
|----------|------|
| Onboarding Guide | [ONBOARDING.md](./ONBOARDING.md) |
| Team Guide | [TEAM_GUIDE.md](./TEAM_GUIDE.md) |
| Contributing | [CONTRIBUTING.md](../CONTRIBUTING.md) |
| Error Codes | [ERROR_CODES.md](./ERROR_CODES.md) |
| UI Guidelines | [UI_GUIDELINES.md](./UI_GUIDELINES.md) |
| Design System | [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) |
