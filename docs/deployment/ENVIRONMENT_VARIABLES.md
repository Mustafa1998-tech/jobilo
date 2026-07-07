# Environment Variables Reference

> Complete reference of all environment variables used by the Jobilo platform.

## Variable Categories Overview

```mermaid
mindmap
  root((Env Variables))
    Database
      DATABASE_URL
      POSTGRES_DB
      POSTGRES_USER
      POSTGRES_PASSWORD
      PGHOST
      PGPORT
    JWT & Auth
      JWT_ACCESS_SECRET
      JWT_REFRESH_SECRET
      JWT_ACCESS_EXPIRY
      JWT_REFRESH_EXPIRY
    Server
      NODE_ENV
      PORT
      CORS_ORIGINS
      APP_URL
      API_URL
    AI Services
      OPENAI_API_KEY
      OPENAI_MODEL
      OPENAI_MAX_TOKENS
    Media Storage
      CLOUDINARY_CLOUD_NAME
      CLOUDINARY_API_KEY
      CLOUDINARY_API_SECRET
      CLOUDINARY_FOLDER
    Email
      RESEND_API_KEY
      RESEND_FROM
    Rate Limiting
      RATE_LIMIT_TTL
      RATE_LIMIT_MAX
    Monitoring
      SENTRY_DSN
```

## Database Variables

| Variable | Type | Required | Default | Example | Security |
|----------|------|----------|---------|---------|----------|
| `DATABASE_URL` | string | Yes | — | `postgresql://jobilo:pass@postgres:5432/jobilo` | **CRITICAL** — contains password |
| `POSTGRES_DB` | string | Yes | `jobilo` | `jobilo` | Low |
| `POSTGRES_USER` | string | Yes | `jobilo` | `jobilo` | Low |
| `POSTGRES_PASSWORD` | string | Yes | — | `a3f8c2...` (64 hex chars) | **CRITICAL** — database superuser |
| `PGHOST` | string | No | `localhost` | `postgres` | Low |
| `PGPORT` | integer | No | `5432` | `5432` | Low |

**Description:** Connection credentials for PostgreSQL. `DATABASE_URL` is used by Prisma in the backend. Individual `POSTGRES_*` vars are used by Docker Compose for container setup and by backup/restore scripts. `DATABASE_URL` format: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`.

---

## JWT Variables

| Variable | Type | Required | Default | Example | Security |
|----------|------|----------|---------|---------|----------|
| `JWT_ACCESS_SECRET` | string | Yes | — | `a3f8c2...` (64 hex chars) | **CRITICAL** — token signing |
| `JWT_REFRESH_SECRET` | string | Yes | — | `b4e9d3...` (64 hex chars) | **CRITICAL** — token signing |
| `JWT_ACCESS_EXPIRY` | string | Yes | `15m` | `15m` | Medium |
| `JWT_REFRESH_EXPIRY` | string | Yes | `7d` | `7d` | Medium |

**Description:** JWT authentication secrets and token lifetimes. Access tokens are short-lived (minutes), refresh tokens are long-lived (days/weeks).

**Security Notes on Secret Generation:**

```bash
# RECOMMENDED: Generate cryptographically random secrets
openssl rand -hex 32    # 64 char hex string (256 bits)
# Output: a3f8c2d1e4b5...

# Alternative: Using node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# NEVER use:
# - Hardcoded values like "secret" or "changeme"
# - Simple words or phrases
# - The same secret for both access and refresh tokens
# - Secrets committed to version control
```

**Expiry recommendations:**

| Environment | Access Expiry | Refresh Expiry |
|-------------|--------------|----------------|
| Development | `15m` | `7d` |
| Staging | `15m` | `7d` |
| Production | `15m` | `7d` |

---

## Server Variables

| Variable | Type | Required | Default | Example | Security |
|----------|------|----------|---------|---------|----------|
| `NODE_ENV` | string | Yes | `development` | `production` | Low |
| `PORT` | integer | Yes | `4000` | `4000` | Low |
| `CORS_ORIGINS` | string | Yes | `*` | `https://jobilo.com,https://www.jobilo.com` | Medium |
| `APP_URL` | string | Yes | — | `https://jobilo.com` | Low |
| `API_URL` | string | Yes | — | `https://api.jobilo.com` | Low |

**Description:** Runtime server configuration. `CORS_ORIGINS` is a comma-separated list of allowed origins. `APP_URL` is the frontend URL (used for redirects). `API_URL` is the backend URL (used for self-referencing).

---

## OpenAI Variables

| Variable | Type | Required | Default | Example | Security |
|----------|------|----------|---------|---------|----------|
| `OPENAI_API_KEY` | string | Yes | — | `sk-proj-...` | **CRITICAL** — paid API access |
| `OPENAI_MODEL` | string | No | `gpt-4o-mini` | `gpt-4o-mini` | Low |
| `OPENAI_MAX_TOKENS` | integer | No | `2000` | `2000` | Low |

**Description:** OpenAI API configuration. Used for AI-powered features (resume matching, job descriptions, etc.). The API key is a paid resource — protect it as a **secret**. Model selection affects cost and capability.

**Model pricing comparison:**

| Model | Cost (input/1M tokens) | Cost (output/1M tokens) | Best for |
|-------|----------------------|-----------------------|----------|
| `gpt-4o-mini` | $0.15 | $0.60 | Default — balanced |
| `gpt-4o` | $2.50 | $10.00 | Complex reasoning |

---

## Cloudinary Variables

| Variable | Type | Required | Default | Example | Security |
|----------|------|----------|---------|---------|----------|
| `CLOUDINARY_CLOUD_NAME` | string | Yes | — | `your-cloud` | Low |
| `CLOUDINARY_API_KEY` | string | Yes | — | `123456789012345` | Medium |
| `CLOUDINARY_API_SECRET` | string | Yes | — | `abc123...` | **HIGH** — media API access |
| `CLOUDINARY_FOLDER` | string | No | `jobilo` | `jobilo` | Low |

**Description:** Cloudinary configuration for media uploads (profile pictures, job attachments, etc.). `CLOUDINARY_CLOUD_NAME` is public. `CLOUDINARY_API_SECRET` must be kept confidential.

---

## Email Variables (Resend)

| Variable | Type | Required | Default | Example | Security |
|----------|------|----------|---------|---------|----------|
| `RESEND_API_KEY` | string | Yes | — | `re_123abc...` | **HIGH** — email sending |
| `RESEND_FROM` | string | Yes | — | `noreply@jobilo.com` | Low |

**Description:** Resend.com configuration for transactional emails (verification, password reset, notifications). The API key controls email sending ability and can incur costs.

---

## Rate Limiting Variables

| Variable | Type | Required | Default | Example | Security |
|----------|------|----------|---------|---------|----------|
| `RATE_LIMIT_TTL` | integer | No | `60` | `60` | Low |
| `RATE_LIMIT_MAX` | integer | No | `100` | `100` | Low |

**Description:** API rate limiting configuration. `RATE_LIMIT_TTL` is the time window in seconds. `RATE_LIMIT_MAX` is the maximum number of requests per window per IP.

```mermaid
graph LR
    subgraph "Rate Limit Window"
        TTL[TTL: 60s]
        MAX[Max: 100 requests]
    end
    REQ[Client Request] --> COUNTER{Under limit?}
    COUNTER -->|Yes| API[Process Request]
    COUNTER -->|No| BLOCK[429 Too Many Requests]
    TTL --> COUNTER
    MAX --> COUNTER
```

**Recommended values by endpoint:**

| Endpoint | TTL | Max | Rationale |
|----------|-----|-----|-----------|
| Global API | 60s | 100 | General traffic |
| Auth endpoints | 60s | 10 | Brute force protection |
| AI endpoints | 60s | 20 | Cost control |
| File upload | 60s | 5 | Resource protection |

---

## Monitoring Variables

| Variable | Type | Required | Default | Example | Security |
|----------|------|----------|---------|---------|----------|
| `SENTRY_DSN` | string | No | — | `https://key@o123.ingest.sentry.io/project` | Low (public by design) |

**Description:** Sentry error tracking DSN. If empty, Sentry is disabled. The DSN is safe to expose in client-side code — it only allows submitting events, not reading them.

---

## Security Classification Legend

| Level | Description | Examples | Storage |
|-------|-------------|----------|---------|
| **CRITICAL** | Full system compromise if leaked | Passwords, JWT secrets, API keys | Vault / encrypted store |
| **HIGH** | Significant feature/access compromise | Cloudinary secret, Resend key | Encrypted env file |
| **Medium** | Limited impact if leaked | Cloudinary key, CORS origins | Standard env file |
| **Low** | Public information | DB names, model names | Can be in code |

## Next.js Public Variables (Frontend)

| Variable | Required | Example | Notes |
|----------|----------|---------|-------|
| `NEXT_PUBLIC_API_URL` | Yes | `https://jobilo-api.onrender.com/api/v1` | Must be prefixed with `NEXT_PUBLIC_` |

---

## `.env.production` Template

```bash
# See .env.production at project root for full template
# Copy and fill in all values:
cp .env.production .env.production.local

# Verify all required vars are set:
grep -c "=" .env.production.local
# Expected: 25+ variables set
```

---

**See also:**
- [PRODUCTION_DEPLOYMENT.md](./PRODUCTION_DEPLOYMENT.md) — Where to set these in deployment
- [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) — Setting env vars in Render dashboard
- [CLOUDFLARE_DEPLOYMENT.md](./CLOUDFLARE_DEPLOYMENT.md) — Setting env vars in Cloudflare Pages
