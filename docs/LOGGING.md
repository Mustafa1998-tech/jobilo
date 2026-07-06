# Logging Guide

> **Version:** 1.0 | **Last Updated:** 2026-07-06 | **Applies to:** Backend (`backend/`) & Frontend (`frontend/`)

## Table of Contents

1. [Backend Logging](#backend-logging)
2. [Frontend Logging](#frontend-logging)
3. [Log Levels and When to Use Each](#log-levels-and-when-to-use-each)
4. [Sensitive Data Masking Rules](#sensitive-data-masking-rules)
5. [Log Storage and Retention](#log-storage-and-retention)
6. [Log Analysis Tools](#log-analysis-tools)
7. [Correlation IDs](#correlation-ids)
8. [Audit Trail Logging](#audit-trail-logging)
9. [Error Tracking Integration](#error-tracking-integration)

---

## Backend Logging

### NestJS Logger Setup

```ts
// backend/src/common/logger/logger.service.ts
import { Injectable, LoggerService } from '@nestjs/common'
import * as winston from 'winston'

@Injectable()
export class AppLogger implements LoggerService {
  private logger: winston.Logger

  constructor() {
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'ISO' }),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
      defaultMeta: { service: 'jobilo-api' },
      transports: [
        new winston.transports.Console({
          format: process.env.NODE_ENV === 'production'
            ? winston.format.json()
            : winston.format.combine(
                winston.format.colorize(),
                winston.format.printf(({ timestamp, level, message, context, ...meta }) => {
                  return `${timestamp} [${level}] ${context ? `[${context}] ` : ''}${message} ${
                    Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
                  }`
                }),
              ),
        }),
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
          maxsize: 10 * 1024 * 1024, // 10MB
          maxFiles: 10,
        }),
        new winston.transports.File({
          filename: 'logs/combined.log',
          maxsize: 10 * 1024 * 1024,
          maxFiles: 5,
        }),
      ],
    })
  }

  log(message: string, context?: string, meta?: Record<string, any>) {
    this.logger.info(message, { context, ...meta })
  }

  error(message: string, trace?: string, context?: string, meta?: Record<string, any>) {
    this.logger.error(message, { trace, context, ...meta })
  }

  warn(message: string, context?: string, meta?: Record<string, any>) {
    this.logger.warn(message, { context, ...meta })
  }

  debug(message: string, context?: string, meta?: Record<string, any>) {
    this.logger.debug(message, { context, ...meta })
  }

  verbose(message: string, context?: string, meta?: Record<string, any>) {
    this.logger.verbose(message, { context, ...meta })
  }
}
```

### Structured JSON Log Format

```json
{
  "timestamp": "2026-07-06T10:30:00.123Z",
  "level": "info",
  "message": "User logged in successfully",
  "service": "jobilo-api",
  "context": "AuthController",
  "correlationId": "req-abc-123-def",
  "userId": "user-456",
  "ip": "192.168.1.1",
  "duration_ms": 42,
  "environment": "production"
}
```

### Database Logging

```ts
// backend/src/common/logger/query-logger.ts
@Injectable()
export class QueryLogger implements TypeOrmLogger {
  logQuery(query: string, parameters?: any[]) {
    logger.debug('SQL Query', 'TypeORM', {
      query: this.truncateQuery(query),
      parameters: parameters?.length,
    })
  }

  logQueryError(error: string, query: string, parameters?: any[]) {
    logger.error('SQL Query Error', error, 'TypeORM', {
      query: this.truncateQuery(query),
      error,
    })
  }

  logQuerySlow(time: number, query: string, parameters?: any[]) {
    logger.warn('Slow Query', 'TypeORM', {
      query: this.truncateQuery(query),
      duration_ms: time,
      threshold_ms: 1000,
    })
  }

  private truncateQuery(query: string): string {
    return query.length > 500 ? query.substring(0, 500) + '...' : query
  }
}
```

---

## Frontend Logging

### Console Logging Pattern

```ts
// frontend/src/lib/logger.ts
type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

const currentLevel = LOG_LEVELS[process.env.NEXT_PUBLIC_LOG_LEVEL as LogLevel] || LOG_LEVELS.info

class Logger {
  private prefix: string

  constructor(context: string) {
    this.prefix = `[${context}]`
  }

  debug(message: string, data?: Record<string, any>) {
    if (currentLevel <= LOG_LEVELS.debug) {
      console.debug(this.prefix, message, data || '')
    }
  }

  info(message: string, data?: Record<string, any>) {
    if (currentLevel <= LOG_LEVELS.info) {
      console.info(this.prefix, message, data || '')
    }
  }

  warn(message: string, data?: Record<string, any>) {
    if (currentLevel <= LOG_LEVELS.warn) {
      console.warn(this.prefix, message, data || '')
    }
  }

  error(message: string, error?: Error, data?: Record<string, any>) {
    if (currentLevel <= LOG_LEVELS.error) {
      console.error(this.prefix, message, {
        error: {
          message: error?.message,
          stack: error?.stack,
          name: error?.name,
        },
        ...data,
      })
      // Send to error tracking service
      ErrorTracker.captureException(error || new Error(message), {
        context: this.prefix,
        ...data,
      })
    }
  }
}

export const createLogger = (context: string) => new Logger(context)
```

### Frontend Usage

```tsx
// components/ProjectsList.tsx
const logger = createLogger('ProjectsList')

export function ProjectsList() {
  useEffect(() => {
    logger.info('ProjectsList mounted')
    return () => logger.debug('ProjectsList unmounted')
  }, [])

  const { data, error, isLoading } = useProjects()

  if (error) {
    logger.error('Failed to fetch projects', error, { filters: currentFilters })
    return <ErrorState />
  }

  return <ProjectGrid data={data} />
}
```

---

## Log Levels and When to Use Each

| Level | Priority | Color | When to Use |
|-------|----------|-------|-------------|
| **ERROR** | 1 | Red | Application crashes, unhandled exceptions, database failures, external service failures, authentication failures |
| **WARN** | 2 | Yellow | Deprecated API usage, slow queries (>1s), rate limit approaching, retry attempts, non-critical failures |
| **INFO** | 3 | Green | User login/logout, resource creation/deletion, state transitions (project approved), scheduled jobs |
| **DEBUG** | 4 | Blue | Development only: function entry/exit, variable values, API request/response bodies |
| **VERBOSE** | 5 | Gray | Detailed tracing: SQL queries, loop iterations, database transactions |

### Log Level Configuration by Environment

| Environment | Log Level | Details |
|-------------|-----------|---------|
| Production | `info` | Errors + warnings + info. No debug. |
| Staging | `debug` | All logs including debug. |
| Development | `debug` | All logs. Console format (not JSON). |
| Testing | `warn` | Only warnings and errors. |

---

## Sensitive Data Masking Rules

### Masked Fields (Never Log)

| Category | Fields | Mask |
|----------|--------|------|
| Passwords | `password`, `passwordConfirmation`, `currentPassword` | `[REDACTED]` |
| Tokens | `accessToken`, `refreshToken`, `jwt`, `apiKey`, `secret` | `[REDACTED]` |
| Financial | `creditCard`, `cvv`, `iban`, `bankAccount` | `[REDACTED]` or last 4 digits |
| Personal | `ssn`, `nationalId`, `passportNumber` | `[REDACTED]` |
| Contact | `phoneNumber` | `+XX-XXX-XXX-` + last 2 digits |
| Biometrics | `fingerprint`, `faceData` | `[REDACTED]` |

### Masking Implementation

```ts
// backend/src/common/logger/masker.ts
const SENSITIVE_FIELDS = [
  'password', 'token', 'secret', 'creditCard', 'cvv',
  'ssn', 'nationalId', 'apiKey', 'authorization',
]

export function maskSensitiveData(data: Record<string, any>): Record<string, any> {
  if (!data || typeof data !== 'object') return data

  const masked = { ...data }
  for (const key of Object.keys(masked)) {
    if (SENSITIVE_FIELDS.some((f) => key.toLowerCase().includes(f))) {
      masked[key] = '[REDACTED]'
    } else if (typeof masked[key] === 'object' && masked[key] !== null) {
      masked[key] = maskSensitiveData(masked[key])
    }
  }
  return masked
}

// Usage in logger
this.logger.info('User registered', { ...maskSensitiveData(body) })
```

### Request/Response Sanitization

```ts
// backend/src/common/interceptors/logging.interceptor.ts
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()
    const { method, url, body, headers } = request

    logger.debug('Incoming request', 'HTTP', {
      method,
      url,
      body: method !== 'GET' ? maskSensitiveData(body) : undefined,
      userId: request.user?.id,
    })

    const startTime = Date.now()

    return next.handle().pipe(
      tap((response) => {
        const duration = Date.now() - startTime
        logger.debug('Response sent', 'HTTP', {
          method,
          url,
          duration_ms: duration,
          statusCode: context.switchToHttp().getResponse().statusCode,
        })
      }),
    )
  }
}
```

---

## Log Storage and Retention

### Storage Strategy

| Environment | Storage | Retention | Format |
|-------------|---------|-----------|--------|
| Development | Local filesystem (`logs/`) | 7 days | Human-readable |
| Staging | Elasticsearch | 30 days | JSON |
| Production | Elasticsearch + S3 cold storage | 90 days hot, 1 year cold | JSON |

### Log Rotation (Local)

Configured in Winston transport:

```ts
new winston.transports.File({
  filename: 'logs/error.log',
  maxsize: 10 * 1024 * 1024, // Rotate at 10MB
  maxFiles: 10,
  tailable: true,
})
```

### Cloud Storage

Production logs are shipped to Elasticsearch via Filebeat:

```yaml
# filebeat.yml
filebeat.inputs:
  - type: log
    paths:
      - /var/log/jobilo/*.log
    json.keys_under_root: true
    json.add_error_key: true

output.elasticsearch:
  hosts: ["${ELASTICSEARCH_HOST}:9200"]
  index: "jobilo-logs-%{+yyyy.MM.dd}"
```

---

## Log Analysis Tools

| Tool | Purpose | Access |
|------|---------|--------|
| Elasticsearch + Kibana | Log storage, search, visualization, dashboards | Operations team |
| Grafana Loki | Lightweight log aggregation (staging) | Developers |
| Kibana Discover | Ad-hoc log queries and debugging | Developers + Ops |
| Logstash | Log parsing and enrichment | Ops |

### Common Kibana Queries

```text
# Find all errors for a specific user
level:error AND userId:"user-456"

# Trace a specific request
correlationId:"req-abc-123-def"

# Slow queries
level:warn AND "Slow Query"

# Authentication failures in last hour
level:warn AND context:"AuthController" AND @timestamp > now-1h

# API response times > 2 seconds
duration_ms > 2000
```

---

## Correlation IDs

### Generation

Every HTTP request gets a unique correlation ID:

```ts
// backend/src/common/middleware/correlation-id.middleware.ts
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const correlationId = req.headers['x-correlation-id'] || uuidv4()
    req['correlationId'] = correlationId
    res.setHeader('x-correlation-id', correlationId)
    next()
  }
}
```

### Propagation

The correlation ID is propagated to:

- All downstream service calls (HTTP headers)
- Database queries (comment in SQL)
- Log entries (as metadata field)
- Error responses (returned to client)

### Frontend Correlation ID

```ts
// frontend/src/lib/api-client.ts
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

apiClient.interceptors.request.use((config) => {
  config.headers['x-correlation-id'] = generateUUID()
  return config
})

apiClient.interceptors.response.use(
  (response) => {
    const correlationId = response.headers['x-correlation-id']
    if (correlationId) {
      logger.debug(`Request completed`, { correlationId })
    }
    return response
  },
  (error) => {
    const correlationId = error.response?.headers['x-correlation-id']
    logger.error('API Error', error, { correlationId })
    return Promise.reject(error)
  },
)
```

---

## Audit Trail Logging

### What Gets Audited

| Event | Details | Retention |
|-------|---------|-----------|
| User login/logout | userId, IP, timestamp, device | 1 year |
| Admin actions | adminId, action, resource, changes | 2 years |
| Payment events | paymentId, amount, status, userId | 5 years |
| Permission changes | adminId, targetUserId, old/new permissions | 2 years |
| Data exports | userId, resource, record count, timestamp | 1 year |
| Profile changes | userId, changed fields, old/new values | 1 year |
| Content moderation | adminId, action, resourceId, reason | 2 years |

### Audit Log Implementation

```ts
// backend/src/modules/audit/audit.service.ts
@Injectable()
export class AuditService {
  async log(event: AuditEvent) {
    await this.auditRepository.save({
      eventType: event.type,
      actorId: event.actorId,
      actorRole: event.actorRole,
      resourceType: event.resourceType,
      resourceId: event.resourceId,
      action: event.action,
      changes: event.changes,
      ipAddress: event.ipAddress,
      userAgent: event.userAgent,
      correlationId: event.correlationId,
      timestamp: new Date(),
    })
  }

  async getAuditTrail(resourceType: string, resourceId: string): Promise<AuditEntry[]> {
    return this.auditRepository.find({
      where: { resourceType, resourceId },
      order: { timestamp: 'DESC' },
    })
  }
}
```

### Audit Table Schema

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(50) NOT NULL,
  actor_id UUID NOT NULL,
  actor_role VARCHAR(20),
  resource_type VARCHAR(50) NOT NULL,
  resource_id UUID,
  action VARCHAR(50) NOT NULL,
  changes JSONB,
  ip_address INET,
  user_agent TEXT,
  correlation_id UUID,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB
);

CREATE INDEX idx_audit_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_actor ON audit_logs(actor_id);
CREATE INDEX idx_audit_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX idx_audit_event_type ON audit_logs(event_type);
```

---

## Error Tracking Integration

### Sentry Setup

```ts
// backend/src/main.ts
import * as Sentry from '@sentry/node'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
  ],
  beforeSend(event) {
    if (event.exception) {
      logger.error('Sentry captured exception', undefined, 'Sentry', {
        eventId: event.event_id,
        exception: event.exception.values?.[0]?.type,
      })
    }
    return event
  },
})
```

```ts
// frontend/src/lib/sentry.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_ENV,
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  beforeSend(event) {
    if (event.request?.headers) {
      delete event.request.headers['Authorization']
      delete event.request.headers['Cookie']
    }
    return event
  },
})
```

### Error Grouping Rules

| Rule | Action |
|------|--------|
| 4xx errors < 100/min | Log only |
| 4xx errors > 100/min | Sentry warning |
| 5xx errors any count | Sentry error + page Ops |
| New error type | Sentry alert to #dev-channel |
| Error affecting >10 users | PagerDuty notification |

---

## Cross-References

| Document | Link |
|----------|------|
| Error Handling | [ERROR_HANDLING.md](../ERROR_HANDLING.md) |
| Error Codes | [ERROR_CODES.md](./ERROR_CODES.md) |
| Monitoring | [MONITORING.md](./MONITORING.md) |
| Security | [SECURITY.md](../SECURITY.md) |
| Deployment | [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md) |
