# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of Jobilo seriously. If you discover a security vulnerability, please report it responsibly.

**Do not** open a public GitHub issue. Instead, use one of the following channels:

- **Email**: security@jobilo.com
- **GitHub**: Use the [Security Vulnerability Report](.github/ISSUE_TEMPLATE/security.md) template

You can expect:
- Acknowledgment within 24 hours
- A detailed response within 72 hours
- A fix timeline based on severity

## Disclosure Policy

We follow a coordinated disclosure process:
1. Reporter submits vulnerability details
2. Our security team validates and triages
3. A fix is developed and tested
4. The fix is deployed
5. Public disclosure (if agreed)

## Security Measures

- **Authentication**: JWT-based with short-lived access tokens (15 min) and refresh tokens (7 days)
- **Authorization**: Role-Based Access Control (RBAC) with granular permissions
- **Data Protection**: Passwords hashed with bcrypt (12 rounds), HTTPS enforced
- **API Security**: Rate limiting, CORS, Helmet headers, input validation
- **Database**: Parameterized queries via Prisma, no raw SQL
- **Session**: Server-session tracking with device monitoring

For detailed security documentation, see:
- [Security Architecture](docs/SECURITY.md)
- [Authentication](docs/AUTHENTICATION.md)
- [Authorization & RBAC](docs/AUTHORIZATION.md)
- [Security Testing](docs/SECURITY_TESTING.md)
- [OWASP Compliance](docs/OWASP.md)
