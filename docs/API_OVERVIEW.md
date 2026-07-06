# API Overview

## Base URL

**Development:** `http://localhost:4000/api/v1`

**Production:** `https://api.jobilo.com/api/v1`

## Global Prefix

All API routes are prefixed with `/api` and versioned via URI:

```
/api/v1/auth/login
/api/v1/projects
/api/v1/users/me
```

## Authentication

Most endpoints require a Bearer JWT token:

```
Authorization: Bearer <access_token>
```

- Access tokens expire in **15 minutes** (configurable via `JWT_ACCESS_EXPIRY`)
- Refresh tokens expire in **7 days** (configurable via `JWT_REFRESH_EXPIRY`)
- Admin endpoints use a separate JWT token pair

**See:** [AUTHENTICATION.md](./AUTHENTICATION.md) for token flow details.

## Content-Type

All requests and responses use `application/json`.

```
Content-Type: application/json
Accept: application/json
```

For file uploads, use `multipart/form-data`.

## Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | For auth routes | `Bearer <token>` |
| `Content-Type` | Always | `application/json` |
| `Accept-Language` | Optional | Preferred language (`ar`, `en`) |
| `X-Request-Id` | Optional | Trace ID for request tracking |

## Rate Limiting

Global rate limiting via `@nestjs/throttler`:

| Window | Limit | Scope |
|--------|-------|-------|
| 60 seconds | 100 requests | Per IP |

Auth endpoints may have stricter limits. Configured in `AppModule`:

```typescript
ThrottlerModule.forRoot([{
  ttl: 60000,
  limit: 100,
}])
```

**See:** [ERROR_HANDLING.md](./ERROR_HANDLING.md) for rate limit error format.

## Pagination

Pagination uses offset-based pagination with `page` and `pageSize` parameters.

| Parameter | Type | Default | Max |
|-----------|------|---------|-----|
| `page` | number | 1 | — |
| `pageSize` | number | 10 | 100 |

Response format:

```json
{
  "success": true,
  "data": [...],
  "meta": {
    "page": 1,
    "pageSize": 10,
    "totalCount": 50,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

**See:** [PAGINATION.md](./PAGINATION.md) for details.

## Success Response Format

```json
{
  "success": true,
  "data": { ... },
  "meta": { }
}
```

For list endpoints, `data` is an array. For single resources, `data` is an object.

## Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "email must be a valid email address"
      }
    ],
    "traceId": "req-abc-123"
  }
}
```

**See:** [ERROR_HANDLING.md](./ERROR_HANDLING.md) for all error codes.

## Versioning Strategy

- URI-based versioning (`/api/v1/...`)
- Default version: `1`
- Headers: `Accept: application/json; version=1` (alternative)
- Backward compatibility maintained within major versions
- Deprecated versions announced 3 months before removal

## Swagger Documentation

Interactive API documentation is available at:

```
http://localhost:4000/api/docs
```

The Swagger UI provides:
- Endpoint listing with request/response schemas
- Try-it-out functionality
- Bearer token authentication
- Schema definitions for all DTOs

Configured in `src/main.ts`:

```typescript
const config = new DocumentBuilder()
  .setTitle('Jobilo API')
  .setDescription('Jobilo Freelance Marketplace API')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, document);
```

## CORS

Allowed origins are configured via `CORS_ORIGINS` environment variable (comma-separated). Default: `http://localhost:3000`.

```typescript
app.enableCors({
  origin: configService.get<string[]>('cors.origins'),
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id', 'Accept-Language'],
  exposedHeaders: ['X-Request-Id'],
});
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 4000 | Server port |
| `DATABASE_URL` | — | PostgreSQL connection |
| `JWT_ACCESS_SECRET` | — | Access token signing key |
| `JWT_REFRESH_SECRET` | — | Refresh token signing key |
| `JWT_ACCESS_EXPIRY` | 15m | Access token TTL |
| `JWT_REFRESH_EXPIRY` | 7d | Refresh token TTL |
| `CORS_ORIGINS` | http://localhost:3000 | Allowed origins |
| `OPENAI_API_KEY` | — | OpenAI API key |
| `RESEND_API_KEY` | — | Email service key |
| `CLOUDINARY_*` | — | File upload config |
| `STRIPE_*` | — | Payment processor |

**See:** [ENDPOINTS.md](./ENDPOINTS.md) for all available endpoints.
