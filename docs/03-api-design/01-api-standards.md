# Jobilo - API Design Standards

---

## REST Standards

### Base URL
```
Development:  http://localhost:4000/api/v1
Staging:      https://api-staging.jobilo.com/api/v1
Production:   https://api.jobilo.com/api/v1
```

### API Versioning
- **Strategy**: URL-based versioning (`/api/v1/`, `/api/v2/`)
- **Headers**: `Accept: application/json`
- **Backward Compatibility**: Same version = backward compatible
- **Deprecation**: Sunset header with 6-month notice

### HTTP Methods
| Method | Action | Idempotent | Safe |
|--------|--------|-----------|------|
| `GET` | Read/Retrieve | Yes | Yes |
| `POST` | Create | No | No |
| `PUT` | Full Update | Yes | No |
| `PATCH` | Partial Update | No | No |
| `DELETE` | Delete | Yes | No |

### URL Structure
```
/{resource}                    # List/Create
/{resource}/{id}               # Read/Update/Delete
/{resource}/{id}/{subresource} # Nested resources
```

**Examples:**
```
GET    /api/v1/projects              # List projects
POST   /api/v1/projects              # Create project
GET    /api/v1/projects/:id          # Get project details
PUT    /api/v1/projects/:id          # Update project
DELETE /api/v1/projects/:id          # Delete project
GET    /api/v1/projects/:id/proposals # List project proposals
```

### Naming Conventions
| Element | Convention | Example |
|---------|-----------|---------|
| Resources | Plural nouns | `/users`, `/projects` |
| Endpoints | kebab-case | `/forgot-password` |
| Query Params | camelCase | `?page=1&pageSize=20` |
| JSON Fields | camelCase | `firstName`, `createdAt` |
| IDs | UUID | `550e8400-e29b-41d4-a716-446655440000` |

---

## Request/Response Format

### Standard Response Envelope

#### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully",
  "meta": {
    "page": 1,
    "pageSize": 20,
    "totalCount": 150,
    "totalPages": 8
  }
}
```

#### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "البريد الإلكتروني مطلوب",
        "code": "REQUIRED"
      }
    ],
    "traceId": "abc-123-def-456"
  }
}
```

### Pagination
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | الصفحة الحالية |
| `pageSize` | number | 20 | عدد العناصر (max 100) |
| `sortBy` | string | `createdAt` | حقل الترتيب |
| `sortOrder` | `asc`/`desc` | `desc` | اتجاه الترتيب |

**Response Meta:**
```json
{
  "meta": {
    "page": 1,
    "pageSize": 20,
    "totalCount": 150,
    "totalPages": 8,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

### Filtering
```
GET /api/v1/projects?status=OPEN&budgetMin=100&budgetMax=1000&category=web-development
```

**Filter Operators (for advanced queries):**
| Operator | Example | Description |
|----------|---------|-------------|
| eq | `status=eq:OPEN` | Equal |
| neq | `status=neq:CLOSED` | Not equal |
| gt | `budget=gt:500` | Greater than |
| gte | `budget=gte:100` | Greater or equal |
| lt | `budget=lt:1000` | Less than |
| lte | `budget=lte:500` | Less or equal |
| in | `status=in:OPEN,IN_PROGRESS` | In array |
| like | `title=like:react` | Contains |

### Searching
```
GET /api/v1/projects?search=react+developer&searchFields=title,description
```

Full-text search via PostgreSQL tsvector on `title` and `description` fields.

### Sorting
```
GET /api/v1/projects?sortBy=budgetMax&sortOrder=desc
```

**Allowed sort fields** per resource (to prevent injection attacks).

---

## HTTP Status Codes

| Code | Name | When |
|------|------|------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Validation error, malformed input |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Authenticated but not authorized |
| 404 | Not Found | Resource does not exist |
| 409 | Conflict | Duplicate resource, state conflict |
| 422 | Unprocessable Entity | Business rule violation |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unexpected server error |
| 503 | Service Unavailable | System maintenance |

---

## Error Codes

| Code | HTTP | Description |
|------|------|-------------|
| `VALIDATION_ERROR` | 400 | خطأ في التحقق من صحة البيانات |
| `INVALID_INPUT` | 400 | مدخل غير صحيح |
| `MISSING_FIELD` | 400 | حقل مطلوب غير موجود |
| `UNAUTHORIZED` | 401 | غير مصرح بالدخول |
| `TOKEN_EXPIRED` | 401 | انتهت صلاحية الجلسة |
| `TOKEN_INVALID` | 401 | رمز غير صالح |
| `FORBIDDEN` | 403 | ليس لديك صلاحية |
| `RESOURCE_NOT_FOUND` | 404 | المورد غير موجود |
| `USER_NOT_FOUND` | 404 | المستخدم غير موجود |
| `EMAIL_EXISTS` | 409 | البريد الإلكتروني موجود مسبقاً |
| `PROJECT_CLOSED` | 409 | المشروع مغلق للعروض |
| `ALREADY_APPLIED` | 409 | تقدمت بعرض مسبقاً |
| `INSUFFICIENT_BALANCE` | 422 | رصيد غير كافٍ |
| `RATE_LIMIT_EXCEEDED` | 429 | تجاوزت حد الطلبات |
| `INTERNAL_ERROR` | 500 | خطأ داخلي في الخادم |
| `SERVICE_UNAVAILABLE` | 503 | الخدمة غير متاحة حالياً |

---

## Rate Limiting

| Endpoint Group | Limit | Window | Burst |
|---------------|-------|--------|-------|
| Public (auth) | 20 req/min | 1 min | 30 |
| Authenticated (general) | 100 req/min | 1 min | 150 |
| AI endpoints | 10 req/min | 1 min | 20 |
| Admin endpoints | 200 req/min | 1 min | 300 |
| File upload | 5 req/min | 1 min | 10 |
| Search | 30 req/min | 1 min | 50 |

**Headers returned:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1625000000
Retry-After: 45
```

---

## Standard Headers

### Request Headers
| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | For auth | `Bearer <token>` |
| `Accept-Language` | No | `ar`, `en`, `fr` |
| `X-Request-Id` | No | Trace ID (auto-generated if not provided) |
| `Content-Type` | For POST/PUT | `application/json` |

### Response Headers
| Header | Description |
|--------|-------------|
| `X-Request-Id` | Request trace ID |
| `X-Response-Time` | Response time in ms |
| `X-RateLimit-*` | Rate limit info |
| `Sunset` | API deprecation notice |
| `Deprecation` | `true` if deprecated |

---

## HATEOAS Links

```json
{
  "data": {
    "id": "uuid",
    "title": "Build React App",
    "_links": {
      "self": { "href": "/api/v1/projects/uuid", "method": "GET" },
      "proposals": { "href": "/api/v1/projects/uuid/proposals", "method": "GET" },
      "client": { "href": "/api/v1/users/uuid", "method": "GET" }
    }
  }
}
```

---

## Security Headers

```typescript
// Applied via Helmet middleware
{
  "Content-Security-Policy": "default-src 'self'",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()"
}
```

---

## Logging & Monitoring

### Structured Logging
```json
{
  "timestamp": "2026-06-27T16:00:00.000Z",
  "level": "info",
  "traceId": "abc-123",
  "userId": "uuid",
  "method": "POST",
  "path": "/api/v1/projects",
  "statusCode": 201,
  "responseTime": 45,
  "ip": "196.158.x.x",
  "userAgent": "Mozilla/5.0..."
}
```

### Health Check Endpoint
```
GET /api/v1/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-06-27T16:00:00.000Z",
  "uptime": 3600,
  "database": "connected",
  "redis": "connected",
  "cloudinary": "connected",
  "stripe": "connected",
  "version": "1.0.0"
}
```

---

## Swagger/OpenAPI

- **URL**: `/api/docs` (Swagger UI)
- **URL**: `/api/docs-json` (OpenAPI JSON)
- **Auth**: Bearer JWT (Authorize button in Swagger UI)
- **Groups**: Tagged by module (Auth, Users, Projects, etc.)

```typescript
// @ApiTags('Projects')
// @ApiBearerAuth()
// @ApiOperation({ summary: 'Create a new project' })
```

---

## Cache Strategy

| Type | Cache | TTL | Invalidation |
|------|-------|-----|-------------|
| Project list | Memory/Redis | 60s | On create/update |
| Project detail | Memory/Redis | 120s | On update/delete |
| Categories | Memory | 1 hour | Admin action |
| Skills | Memory | 1 hour | Admin action |
| User profile | Memory/Redis | 300s | On profile update |
| Search results | Redis | 30s | N/A (short TTL) |
| Static assets | CDN (Vercel) | 1 year | Hash-based |

Cache headers:
```
Cache-Control: public, max-age=60, stale-while-revalidate=30
```
