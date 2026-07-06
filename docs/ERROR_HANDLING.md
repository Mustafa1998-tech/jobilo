# Error Handling

All errors are intercepted by the global `AllExceptionsFilter` defined at `src/common/filters/all-exceptions.filter.ts`.

## Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "وصف الخطأ",
    "details": null,
    "traceId": "req-uuid-here"
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Always `false` for errors |
| `error.code` | string | Machine-readable error code |
| `error.message` | string | Human-readable error message |
| `error.details` | object\|null | Additional error details |
| `error.traceId` | string | Request ID for debugging |

## Common Error Codes

| HTTP Status | Code | Description | Cause |
|:-----------:|------|-------------|-------|
| 400 | `VALIDATION_ERROR` | طلب غير صالح | Invalid input, missing required fields |
| 401 | `UNAUTHORIZED` | غير مصرح | Missing/invalid token |
| 403 | `FORBIDDEN` | ممنوع | Insufficient permissions |
| 404 | `RESOURCE_NOT_FOUND` | غير موجود | Resource not found |
| 409 | `CONFLICT` | تعارض | Duplicate record (e.g., email already exists) |
| 422 | `UNPROCESSABLE_ENTITY` | غير قابل للمعالجة | Business logic violation |
| 429 | `RATE_LIMIT_EXCEEDED` | تجاوز الحد المسموح | Too many requests |
| 500 | `INTERNAL_ERROR` | خطأ داخلي | Server error |

## Validation Errors

Validation errors (400) include a `details` array:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "البريد الإلكتروني غير صالح",
        "constraints": {
          "isEmail": "email must be an email"
        }
      },
      {
        "field": "password",
        "message": "كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل",
        "constraints": {
          "minLength": "password must be longer than or equal to 8 characters"
        }
      }
    ],
    "traceId": "req-abc-123"
  }
}
```

Validation uses `class-validator` decorators on DTOs:

```typescript
export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
```

## Auth Errors

| Scenario | Status | Code |
|----------|--------|------|
| Invalid credentials | 401 | `UNAUTHORIZED` |
| Expired token | 401 | `TOKEN_EXPIRED` |
| Invalid token | 401 | `INVALID_TOKEN` |
| Account suspended | 403 | `ACCOUNT_SUSPENDED` |
| Account banned | 403 | `ACCOUNT_BANNED` |
| Email not verified | 403 | `EMAIL_NOT_VERIFIED` |

## Rate Limit Error

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "لقد تجاوزت الحد المسموح من الطلبات. الرجاء المحاولة بعد 60 ثانية",
    "traceId": "req-xyz-789"
  }
```

Rate limit headers are exposed:
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`

## Business Logic Errors (422)

```json
{
  "success": false,
  "error": {
    "code": "UNPROCESSABLE_ENTITY",
    "message": "لا يمكن تقديم عرض على مشروعك الخاص",
    "details": {
      "reason": "SELF_PROPOSAL"
    },
    "traceId": "req-def-456"
  }
}
```

Common 422 scenarios:
- Freelancer submitting proposal on own project
- Client accepting proposal on someone else's project
- Contract creation on already-contracted proposal
- Reviewing a contract that is not completed

## Global Exception Filter Implementation

```typescript
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let code = 'INTERNAL_ERROR';
    let details: any = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const resp = exceptionResponse as any;
        message = resp.message || exception.message;
        code = resp.code || this.getErrorCode(status);
        details = resp.details;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(status).json({
      success: false,
      error: { code, message, details, traceId: request.headers['x-request-id'] || '' },
    });
  }
}
```

## Logging Errors

Errors are logged centrally. The `ErrorLog` model stores:

| Field | Description |
|-------|-------------|
| `level` | `ERROR`, `WARN`, `CRITICAL` |
| `message` | Error message |
| `stack` | Stack trace |
| `context` | JSON metadata |
| `path` | Request path |
| `method` | HTTP method |
| `statusCode` | HTTP status |
| `ipAddress` | Client IP |
| `userId` | Authenticated user ID |
| `userAgent` | Browser/client info |
| `resolved` | Whether error has been reviewed |
| `resolvedBy` | Admin who resolved it |

**See:** [ENDPOINTS.md](./ENDPOINTS.md) for per-endpoint error scenarios, [API_OVERVIEW.md](./API_OVERVIEW.md) for response formats.
