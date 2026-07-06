# Developer Onboarding Guide

> **Version:** 1.0 | **Last Updated:** 2026-07-06 | **Applies to:** All New Developers

## Table of Contents

1. [First Day Checklist](#first-day-checklist)
2. [Repository Setup](#repository-setup)
3. [Environment Configuration](#environment-configuration)
4. [Local Development Workflow](#local-development-workflow)
5. [Project Tour](#project-tour)
6. [How to Run Tests](#how-to-run-tests)
7. [How to Create a PR](#how-to-create-a-pr)
8. [Where to Find Help](#where-to-find-help)
9. [Team Communication Channels](#team-communication-channels)

---

## First Day Checklist

### Before You Start

- [ ] Receive welcome email with GitHub, Slack, Notion, and email access
- [ ] Set up your GitHub account with 2FA enabled
- [ ] Accept GitHub organization invite: `github.com/jobilo-platform`
- [ ] Join Slack workspace: `jobilo.slack.com`
- [ ] Read the project README: `README.md`
- [ ] Read these docs: `ONBOARDING.md`, `TEAM_GUIDE.md`, `FAQ.md`
- [ ] Complete company HR onboarding (if applicable)

### Development Environment

- [ ] Install Node.js v20+ (use `nvm` or `fnm`)
- [ ] Install pnpm (`npm install -g pnpm`)
- [ ] Install Docker Desktop
- [ ] Install PostgreSQL 16
- [ ] Install Redis
- [ ] Install VS Code with recommended extensions (see `.vscode/extensions.json`)
- [ ] Configure Git: `git config --global user.name "Your Name"`
- [ ] Configure Git: `git config --global user.email "your@email.com"`
- [ ] Clone the repository: `git clone git@github.com:jobilo-platform/jobilo.git`

### First Week Goals

- [ ] Run the full stack locally (frontend + backend)
- [ ] Understand the project structure (see [Project Tour](#project-tour))
- [ ] Complete at least 2 small bug fixes or tickets
- [ ] Set up your local test database
- [ ] Run the test suite and confirm all tests pass
- [ ] Familiarize yourself with the API via Swagger docs
- [ ] Have first code review with a teammate

---

## Repository Setup

### Clone the Repository

```bash
git clone git@github.com:jobilo-platform/jobilo.git
cd jobilo
```

### Install Dependencies

```bash
# Install all project dependencies (frontend + backend)
pnpm install

# Or install individually
cd frontend && pnpm install
cd backend && pnpm install
```

### Database Setup

```bash
# Start PostgreSQL (if using Docker)
docker compose up -d postgres

# Create the database
pnpm --filter backend db:create

# Run migrations
pnpm --filter backend db:migrate

# Seed development data
pnpm --filter backend db:seed
```

### Start Development Servers

```bash
# Start both frontend and backend in development mode
pnpm dev

# Or start individually
pnpm --filter backend dev   # NestJS on port 3001
pnpm --filter frontend dev  # Next.js on port 3000
```

---

## Environment Configuration

### Environment Files

| File | Purpose | Committed? |
|------|---------|-----------|
| `frontend/.env.local` | Frontend environment variables | No |
| `backend/.env` | Backend environment variables | No |
| `backend/.env.example` | Backend environment template | Yes |
| `frontend/.env.example` | Frontend environment template | Yes |

### Backend Environment Variables

```bash
# backend/.env (copy from .env.example)
NODE_ENV=development
PORT=3001

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=jobilo
DATABASE_PASSWORD=jobilo_dev
DATABASE_NAME=jobilo_dev

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=dev-secret-change-in-production
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Frontend Environment Variables

```bash
# frontend/.env.local (copy from .env.example)
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SENTRY_DSN=
NEXT_PUBLIC_LOG_LEVEL=debug
```

---

## Local Development Workflow

### Daily Workflow

```bash
# 1. Pull latest changes
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/JOB-123-description

# 3. Make changes and commit frequently
git add .
git commit -m "feat: add project filtering by skills"

# 4. Write/update tests
pnpm test

# 5. Push branch
git push origin feature/JOB-123-description

# 6. Create PR through GitHub
```

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Example | When to Use |
|--------|---------|-------------|
| `feat:` | `feat: add proposal rating system` | New feature |
| `fix:` | `fix: correct budget calculation` | Bug fix |
| `refactor:` | `refactor: extract validation logic` | Code restructuring |
| `docs:` | `docs: update API documentation` | Documentation |
| `test:` | `test: add auth guard tests` | Adding tests |
| `style:` | `style: format according to prettier` | Formatting, linting |
| `chore:` | `chore: update dependencies` | Maintenance |
| `perf:` | `perf: optimize query performance` | Performance improvement |

### Branch Naming Convention

```
feature/JOB-123-short-description
bugfix/JOB-456-description
hotfix/JOB-789-urgent-fix
chore/update-dependencies
docs/api-documentation
```

---

## Project Tour

### Top-Level Structure

```
jobilo/
├── backend/                  # NestJS backend application
├── frontend/                 # Next.js frontend application
├── docs/                     # Documentation (this directory)
├── .github/                  # GitHub workflows and templates
├── docker-compose.yml        # Local development services
├── package.json              # Root workspace config
├── pnpm-workspace.yaml       # pnpm workspace definition
├── README.md                 # Project overview
└── CONTRIBUTING.md           # Contribution guidelines
```

### Backend Structure (`backend/`)

```
backend/src/
├── main.ts                   # Application entry point
├── app.module.ts             # Root module
├── common/                   # Shared code
│   ├── decorators/           # @Roles, @CurrentUser, etc.
│   ├── guards/               # AuthGuard, RolesGuard, etc.
│   ├── interceptors/         # Logging, transform interceptors
│   ├── filters/              # Exception filters
│   ├── pipes/                # Validation pipes
│   ├── dto/                  # Shared DTOs (pagination, etc.)
│   ├── enums/                # Shared enums (Role, Status, etc.)
│   └── helpers/              # Utility functions
├── modules/                  # Feature modules
│   ├── auth/                 # Authentication module
│   ├── users/                # User management
│   ├── projects/             # Projects module
│   ├── proposals/            # Proposals module
│   ├── payments/             # Payments module
│   ├── admin/                # Admin panel module
│   └── notifications/        # Notifications module
├── config/                   # Configuration files
└── database/
    ├── migrations/           # TypeORM migrations
    └── seeds/                # Database seeders
```

### Frontend Structure (`frontend/`)

```
frontend/src/
├── app/                      # Next.js App Router
│   ├── (auth)/               # Auth route group
│   ├── (public)/             # Public route group
│   ├── (admin)/              # Admin route group
│   └── api/                  # API routes (proxied)
├── components/               # React components
│   └── ui/                   # Design system components
│       ├── layout/           # Container, Grid, Stack
│       ├── navigation/       # Navbar, Sidebar, Tabs
│       ├── forms/            # Input, Select, Button
│       ├── data/             # Table, Card, Badge
│       ├── feedback/         # Alert, Toast, Modal
│       └── overlay/          # Dropdown, Dialog
├── hooks/                    # Custom React hooks
├── lib/                      # Utilities and constants
│   ├── utils/                # Helper functions
│   └── constants/            # Constant values
├── store/                    # Zustand stores
├── types/                    # TypeScript types
└── styles/                   # Global styles
```

### Key Configuration Files

| File | Purpose |
|------|---------|
| `backend/.eslintrc.js` | Backend linting rules |
| `backend/tsconfig.json` | Backend TypeScript config |
| `backend/nest-cli.json` | NestJS CLI config |
| `frontend/next.config.ts` | Next.js configuration |
| `frontend/tailwind.config.ts` | Tailwind CSS configuration |
| `frontend/tsconfig.json` | Frontend TypeScript config |
| `.prettierrc` | Prettier formatting rules |
| `.github/workflows/ci.yml` | CI pipeline |
| `docker-compose.yml` | Local Docker services |

---

## How to Run Tests

### Backend Tests

```bash
# Run all backend tests
pnpm --filter backend test

# Run tests with coverage
pnpm --filter backend test:cov

# Run specific test file
pnpm --filter backend test -- --testPathPattern="auth.service"

# Run tests in watch mode
pnpm --filter backend test:watch
```

### Frontend Tests

```bash
# Run all frontend tests
pnpm --filter frontend test

# Run tests with coverage
pnpm --filter frontend test -- --coverage

# Run specific test file
pnpm --filter frontend test -- --testPathPattern="ProjectForm"

# Run tests in watch mode
pnpm --filter frontend test -- --watch
```

### E2E Tests

```bash
# Run all E2E tests
pnpm --filter frontend test:e2e

# Run E2E tests with UI mode (Playwright)
pnpm --filter frontend test:e2e -- --ui
```

### Linting

```bash
# Lint all projects
pnpm lint

# Lint backend
pnpm --filter backend lint

# Lint frontend
pnpm --filter frontend lint

# Type checking
pnpm typecheck
```

---

## How to Create a PR

### PR Checklist

- [ ] Branch is up to date with `main`
- [ ] All tests pass locally
- [ ] Lint and typecheck pass
- [ ] Code is self-documented (no unnecessary comments)
- [ ] New components follow design system conventions (see [COMPONENTS.md](./COMPONENTS.md))
- [ ] Accessibility requirements met (see [ACCESSIBILITY.md](./ACCESSIBILITY.md))
- [ ] Responsive design checked (see [RESPONSIVE.md](./RESPONSIVE.md))
- [ ] RTL layout verified
- [ ] Error states handled
- [ ] Loading states included
- [ ] Translations added (if new text content)

### PR Template

```markdown
## Description
Brief description of the changes.

## Related Issue
Closes JOB-123

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Refactoring
- [ ] Documentation

## Testing
- [ ] Unit tests added/updated
- [ ] E2E tests added/updated
- [ ] Tested manually

## Screenshots
(if UI changes)

## Checklist
- [ ] Code follows project conventions
- [ ] Accessibility (WCAG 2.1 AA)
- [ ] Responsive design
- [ ] RTL support
- [ ] Error/loading/empty states
```

### PR Review Process

```
1. Developer creates PR     → Auto-assigns reviewer
2. CI checks run            → Must pass (lint, test, build)
3. Reviewer assigned         → Within 24 hours
4. Code review               → Comments and feedback
5. Developer addresses feedback
6. Reviewer approves
7. Merge to main             → Squash merge
8. Delete branch              → Automatic
```

---

## Where to Find Help

### Documentation

| Resource | Link |
|----------|------|
| Project README | `README.md` |
| API Documentation | Running at `http://localhost:3001/api/docs` (Swagger) |
| Design System | [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) |
| Component Library | [COMPONENTS.md](./COMPONENTS.md) |
| Architecture Docs | [ARCHITECTURE.md](../ARCHITECTURE.md) |
| FAQ | [FAQ.md](./FAQ.md) |

### Getting Help

| Need | Contact |
|------|---------|
| Technical questions | Slack `#dev` channel |
| Backend-specific | `#backend` Slack channel |
| Frontend-specific | `#frontend` Slack channel |
| Design questions | `#design` Slack channel |
| Product questions | `#product` Slack channel |
| Infrastructure/DevOps | `#ops` Slack channel |
| Blocked > 30 min | Ask in `#dev` or DM tech lead |
| Security concerns | DM `#security` or email security@jobilo.com |

---

## Team Communication Channels

| Channel | Purpose |
|---------|---------|
| `#general` | Company-wide announcements |
| `#dev` | General development discussion |
| `#backend` | Backend-specific discussion |
| `#frontend` | Frontend-specific discussion |
| `#design` | Design and UX discussion |
| `#product` | Product decisions and feedback |
| `#devops` | Infrastructure and deployments |
| `#incidents` | Production incident communication |
| `#random` | Non-work conversation |
| `#standup` | Daily standup updates |

---

## Cross-References

| Document | Link |
|----------|------|
| Team Guide | [TEAM_GUIDE.md](./TEAM_GUIDE.md) |
| FAQ | [FAQ.md](./FAQ.md) |
| Contributing | [CONTRIBUTING.md](../CONTRIBUTING.md) |
| Code of Conduct | [CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md) |
| Architecture Overview | [ARCHITECTURE.md](../ARCHITECTURE.md) |
