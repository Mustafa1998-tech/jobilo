# Changelog — سجل التغييرات

> All notable changes to the Jobilo project will be documented in this file.
>
> The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
> and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased] — لم يُصدر بعد

### Added | تمت الإضافة
- Project initialization with Next.js 15 (App Router) and NestJS monorepo
- PostgreSQL 16 database schema with Prisma ORM
- Docker Compose setup for local development environment
- Authentication module with JWT access + refresh tokens
- Role-Based Access Control (RBAC) system with 4 roles: Freelancer, Client, Admin, Moderator
- User registration and login with email verification flow
- Profile management for freelancers and clients
- Multi-language support (Arabic RTL + English LTR) using next-intl
- Cairo font integration for Arabic typography
- Inter font integration for English typography
- Tailwind CSS RTL configuration with Cairo font family
- Admin dashboard base layout with sidebar navigation
- Prisma schema with 25+ models covering users, profiles, projects, proposals, skills, and messages
- API health check endpoint at `GET /api/health`
- Global error handling middleware with structured error responses
- Input validation using class-validator and NestJS pipes
- Rate limiting with express-rate-limit (100 req/min per IP)
- CORS configuration for development and production origins
- Helmet security headers middleware
- Environment configuration with validation using @nestjs/config and Joi
- ESLint and Prettier configuration for code quality
- Husky pre-commit hooks for linting

### Changed | تم التعديل
- N/A (initial project setup)

### Deprecated | تم الإهمال
- N/A

### Removed | تم الحذف
- N/A

### Fixed | تم الإصلاح
- N/A

### Security | الأمان
- JWT tokens signed with RS256 algorithm
- Refresh token rotation with revocation support
- Passwords hashed with bcrypt (salt rounds: 12)
- Rate limiting on auth endpoints (5 attempts per 15 minutes)
- SQL injection prevention via Prisma parameterized queries
- XSS protection via Helmet headers and input sanitization
- CSRF protection with double-submit cookie pattern

---

## [0.1.0] — 2026-07-06

### Added | تمت الإضافة
- Initial repository setup with monorepo structure
- Project documentation framework (README, docs directory)
- Development environment configuration
- Base Docker Compose file with PostgreSQL 16, Redis, and Nginx services
- Code of Conduct and Contributing guidelines
- MIT License file

### Notes
This is the first tracked release of Jobilo. The project is in early MVP development phase. See [ROADMAP.md](ROADMAP.md) for upcoming milestones.

---

## Future Release Template

The following sections will be populated as releases are deployed:

```markdown
## [1.0.0] — 2026-12-01

### Added
- [Feature description]

### Changed
- [Change description]

### Fixed
- [Bug fix description]

### Security
- [Security improvement description]
```

---

## Release History

| Version | الإصدار | Date | Highlights |
|---------|---------|------|------------|
| **v0.1.0** | 0.1.0 | 2026-07-06 | Initial project setup, documentation |
| **v1.0.0** | 1.0.0 | 2026-12-01 (planned) | MVP launch with core marketplace |
| **v2.0.0** | 2.0.0 | 2027-08 (planned) | Messaging, reviews, contracts |
| **v3.0.0** | 3.0.0 | 2028-06 (planned) | Financial module, AI features |
| **v4.0.0** | 4.0.0 | 2029-Q3 (planned) | Enterprise features, mobile apps |

---

## How to Update This Changelog

1. When making changes, add an entry to the `[Unreleased]` section under the appropriate category
2. Categories in order: Added, Changed, Deprecated, Removed, Fixed, Security
3. Write entries in both Arabic and English where applicable
4. Link to relevant issues/PRs using `[#123]`
5. When releasing, rename `[Unreleased]` to the version number and date
6. Create a new empty `[Unreleased]` section for the next release

### Example Entry
```markdown
### Added | تمت الإضافة
- Arabic full-text search for project listings [#42]
- دعم البحث باللغة العربية في قوائم المشاريع [#42]
```

---

## Links | روابط ذات صلة

- [Versioning Strategy](VERSIONING.md) — Semantic versioning conventions
- [Roadmap](ROADMAP.md) — Development phases and upcoming features
- [README.md](../README.md) — Main project readme
