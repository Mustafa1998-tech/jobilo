# Error Codes Reference

> **Version:** 1.0 | **Last Updated:** 2026-07-06 | **Applies to:** Backend API (`backend/`)

## Table of Contents

1. [Standard HTTP Status Codes](#standard-http-status-codes)
2. [Custom Error Codes Table](#custom-error-codes-table)
3. [Validation Error Format](#validation-error-format)
4. [Business Logic Error Codes](#business-logic-error-codes)
5. [Authentication Error Codes](#authentication-error-codes)
6. [Authorization Error Codes](#authorization-error-codes)

---

## Standard HTTP Status Codes

| Status | Code | Name | When to Use |
|--------|------|------|-------------|
| 200 | `200` | OK | Successful GET, PUT, PATCH operations |
| 201 | `201` | Created | Successful POST operations (resource created) |
| 204 | `204` | No Content | Successful DELETE operations |
| 400 | `400` | Bad Request | Validation errors, malformed input |
| 401 | `401` | Unauthorized | Missing or invalid authentication |
| 403 | `403` | Forbidden | Authenticated but insufficient permissions |
| 404 | `404` | Not Found | Resource does not exist |
| 409 | `409` | Conflict | Duplicate resource, state conflict |
| 422 | `422` | Unprocessable Entity | Business logic validation failure |
| 429 | `429` | Too Many Requests | Rate limit exceeded |
| 500 | `500` | Internal Server Error | Unexpected server error |
| 502 | `502` | Bad Gateway | Upstream service failure |
| 503 | `503` | Service Unavailable | Maintenance, overload |

---

## Custom Error Codes Table

### Error Response Format

```json
{
  "statusCode": 400,
  "errorCode": "VALIDATION_ERROR",
  "message": "Validation failed",
  "details": {
    "email": "Invalid email format"
  },
  "timestamp": "2026-07-06T10:30:00Z",
  "path": "/api/auth/login",
  "correlationId": "req-abc-123-def"
}
```

### Code Prefixes

| Prefix | Category | Range |
|--------|----------|-------|
| `AUTH_` | Authentication | 1000–1999 |
| `AUTHZ_` | Authorization | 2000–2999 |
| `VAL_` | Validation | 3000–3999 |
| `BIZ_` | Business Logic | 4000–4999 |
| `RES_` | Resource | 5000–5999 |
| `SYS_` | System | 6000–6999 |
| `INT_` | Integration | 7000–7999 |

---

## Validation Error Codes

| Code | Numeric | Message | HTTP Status | Description | Resolution |
|------|---------|---------|-------------|-------------|------------|
| `VAL_REQUIRED` | 3001 | `{field} is required` | 400 | A required field is missing | Ensure all required fields are provided |
| `VAL_INVALID_FORMAT` | 3002 | `{field} has invalid format` | 400 | Field value does not match expected format | Check format constraints (email, URL, date) |
| `VAL_MIN_LENGTH` | 3003 | `{field} must be at least {min} characters` | 400 | Value is too short | Provide a longer value |
| `VAL_MAX_LENGTH` | 3004 | `{field} must not exceed {max} characters` | 400 | Value is too long | Provide a shorter value |
| `VAL_MIN_VALUE` | 3005 | `{field} must be at least {min}` | 400 | Numeric value is too low | Provide a higher value |
| `VAL_MAX_VALUE` | 3006 | `{field} must not exceed {max}` | 400 | Numeric value is too high | Provide a lower value |
| `VAL_INVALID_ENUM` | 3007 | `{field} must be one of: {values}` | 400 | Value is not in allowed list | Use one of the allowed values |
| `VAL_INVALID_EMAIL` | 3008 | `Invalid email address` | 400 | Email format is invalid | Provide a valid email |
| `VAL_INVALID_URL` | 3009 | `Invalid URL format` | 400 | URL format is invalid | Provide a valid URL |
| `VAL_INVALID_DATE` | 3010 | `Invalid date format` | 400 | Date cannot be parsed | Use ISO 8601 format (YYYY-MM-DD) |
| `VAL_DATE_RANGE` | 3011 | `End date must be after start date` | 400 | Date range is invalid | Ensure end date > start date |
| `VAL_INVALID_PHONE` | 3012 | `Invalid phone number` | 400 | Phone format is invalid | Provide a valid phone number |
| `VAL_INVALID_FILE_TYPE` | 3013 | `File type not supported` | 400 | Uploaded file type is not allowed | Upload a supported file type |
| `VAL_FILE_TOO_LARGE` | 3014 | `File exceeds maximum size` | 400 | File exceeds size limit | Upload a smaller file |
| `VAL_INVALID_SKILL` | 3015 | `Skill not found in system` | 400 | Skill does not exist in database | Use an existing skill from the catalog |

### Validation Error Format

```json
// Multiple field validation errors
{
  "statusCode": 400,
  "errorCode": "VALIDATION_ERROR",
  "message": "Validation failed",
  "details": [
    {
      "field": "email",
      "code": "VAL_INVALID_EMAIL",
      "message": "Invalid email address",
      "value": "not-an-email"
    },
    {
      "field": "password",
      "code": "VAL_MIN_LENGTH",
      "message": "password must be at least 8 characters",
      "value": "abc"
    }
  ],
  "timestamp": "2026-07-06T10:30:00Z",
  "correlationId": "req-abc-123-def"
}
```

---

## Business Logic Error Codes

| Code | Numeric | Message | HTTP | Description | Resolution |
|------|---------|---------|------|-------------|------------|
| `BIZ_DUPLICATE_EMAIL` | 4001 | `Email already registered` | 409 | Email already in use by another account | Use a different email or log in |
| `BIZ_DUPLICATE_USERNAME` | 4002 | `Username already taken` | 409 | Username is already registered | Choose a different username |
| `BIZ_PROJECT_CLOSED` | 4003 | `Project is closed for proposals` | 422 | Cannot submit proposal to closed project | Contact project owner |
| `BIZ_PROJECT_COMPLETED` | 4004 | `Project is already completed` | 422 | Cannot modify a completed project | — |
| `BIZ_BUDGET_EXCEEDED` | 4005 | `Proposal budget exceeds project budget` | 422 | Proposal amount > project budget | Reduce proposal amount |
| `BIZ_INSUFFICIENT_BALANCE` | 4006 | `Insufficient account balance` | 422 | User does not have enough funds | Add funds before proceeding |
| `BIZ_ALREADY_APPLIED` | 4007 | `Already submitted a proposal for this project` | 409 | Duplicate proposal submission | Update existing proposal instead |
| `BIZ_MAX_PROPOSALS` | 4008 | `Project has reached maximum proposals` | 422 | Proposal limit reached | The project owner closed submissions |
| `BIZ_HIRE_LIMIT` | 4009 | `Cannot hire more freelancers than positions` | 422 | Hire count exceeds available positions | — |
| `BIZ_ALREADY_HIRED` | 4010 | `Freelancer is already hired for this project` | 409 | Cannot hire someone already hired | — |
| `BIZ_CONTRACT_PENDING` | 4011 | `Contract is pending approval` | 422 | Contract has not been approved yet | Wait for approval |
| `BIZ_ALREADY_VERIFIED` | 4012 | `Account is already verified` | 409 | Cannot verify an already-verified account | — |
| `BIZ_RATING_PERIOD` | 4013 | `Cannot rate before project completion` | 422 | Rating not allowed until project is complete | Wait until project completion |
| `BIZ_ALREADY_RATED` | 4014 | `Already rated this user` | 409 | Duplicate rating | Edit existing rating instead |
| `BIZ_DISPUTE_OPEN` | 4015 | `A dispute is already open for this contract` | 409 | Duplicate dispute | — |
| `BIZ_DISPUTE_CLOSED` | 4016 | `Dispute has been resolved` | 422 | Cannot modify a closed dispute | — |
| `BIZ_DISPUTE_ESCALATED` | 4017 | `Dispute has been escalated to admin` | 422 | Dispute is under admin review | Wait for admin resolution |
| `BIZ_SKILL_MISMATCH` | 4018 | `Required skills not matching freelancer expertise` | 422 | Freelancer lacks required skills | Update skills or choose different freelancer |
| `BIZ_PROFILE_INCOMPLETE` | 4019 | `Profile is incomplete` | 422 | Required profile fields are empty | Complete profile before proceeding |
| `BIZ_WITHDRAWAL_MIN` | 4020 | `Withdrawal amount below minimum` | 422 | Withdrawal amount < minimum threshold | Withdraw at least the minimum amount |
| `BIZ_WITHDRAWAL_MAX` | 4021 | `Withdrawal amount exceeds balance` | 422 | Withdrawal amount > available balance | Withdraw a smaller amount |

---

## Authentication Error Codes

| Code | Numeric | Message | HTTP | Description | Resolution |
|------|---------|---------|------|-------------|------------|
| `AUTH_INVALID_CREDENTIALS` | 1001 | `Invalid email or password` | 401 | Login credentials do not match | Check email/password or reset password |
| `AUTH_ACCOUNT_LOCKED` | 1002 | `Account locked after too many attempts` | 401 | Account temporarily locked due to failed login attempts | Wait 30 minutes or reset password |
| `AUTH_ACCOUNT_DISABLED` | 1003 | `Account has been disabled` | 401 | Account disabled by admin | Contact support |
| `AUTH_ACCOUNT_SUSPENDED` | 1004 | `Account has been suspended` | 401 | Account suspended by admin | Contact support |
| `AUTH_TOKEN_EXPIRED` | 1005 | `Token has expired` | 401 | JWT token expired | Refresh the token or log in again |
| `AUTH_TOKEN_INVALID` | 1006 | `Invalid token` | 401 | JWT token is malformed or invalid | Obtain a new token |
| `AUTH_TOKEN_MISSING` | 1007 | `Authentication token is missing` | 401 | No token in Authorization header | Include Bearer token in header |
| `AUTH_REFRESH_EXPIRED` | 1008 | `Refresh token has expired` | 401 | Refresh token expired | Log in again |
| `AUTH_REFRESH_INVALID` | 1009 | `Invalid refresh token` | 401 | Refresh token is invalid | Log in again |
| `AUTH_EMAIL_NOT_VERIFIED` | 1010 | `Email not verified` | 401 | Account email is not verified | Check email for verification link |
| `AUTH_PASSWORD_WEAK` | 1011 | `Password does not meet security requirements` | 400 | Password too weak | Use min 8 chars, uppercase, number, special char |
| `AUTH_2FA_REQUIRED` | 1012 | `Two-factor authentication required` | 401 | 2FA code needed | Provide 2FA code |
| `AUTH_2FA_INVALID` | 1013 | `Invalid two-factor code` | 401 | 2FA code is wrong | Enter correct code or generate a new one |
| `AUTH_OAUTH_FAILED` | 1014 | `OAuth authentication failed` | 401 | Social login provider error | Try another login method |
| `AUTH_SESSION_EXPIRED` | 1015 | `Session has expired` | 401 | Server session timeout | Log in again |

---

## Authorization Error Codes

| Code | Numeric | Message | HTTP | Description | Resolution |
|------|---------|---------|------|-------------|------------|
| `AUTHZ_INSUFFICIENT_ROLE` | 2001 | `Insufficient role permissions` | 403 | User role does not match required roles | Contact admin for role upgrade |
| `AUTHZ_MISSING_PERMISSION` | 2002 | `Missing required permission: {module}:{action}` | 403 | User lacks module/action permission | Contact admin for permission grant |
| `AUTHZ_RESOURCE_OWNER` | 2003 | `You do not own this resource` | 403 | Cannot modify a resource owned by another user | Only modify your own resources |
| `AUTHZ_ADMIN_ONLY` | 2004 | `This action is restricted to administrators` | 403 | Non-admin user attempted admin action | — |
| `AUTHZ_SUPER_ADMIN_ONLY` | 2005 | `This action is restricted to super administrators` | 403 | Non-super-admin attempted super-admin action | — |
| `AUTHZ_RATE_LIMIT` | 2006 | `Too many requests. Try again later.` | 429 | Rate limit exceeded | Wait before making more requests |
| `AUTHZ_IP_BLOCKED` | 2007 | `Your IP address has been blocked` | 403 | IP banned due to suspicious activity | Contact support |
| `AUTHZ_SCOPE_MISMATCH` | 2008 | `Token scope does not match requested resource` | 403 | JWT scope insufficient for this endpoint | Obtain token with appropriate scope |
| `AUTHZ_PROFILE_INCOMPLETE` | 2009 | `Complete your profile to access this feature` | 403 | Missing required profile information | Complete your profile first |

---

## Cross-References

| Document | Link |
|----------|------|
| Error Handling | [ERROR_HANDLING.md](../ERROR_HANDLING.md) |
| RBAC / Permissions | [RBAC.md](./RBAC.md) |
| Logging | [LOGGING.md](./LOGGING.md) |
| Monitoring | [MONITORING.md](./MONITORING.md) |
| API Documentation | [ENDPOINTS.md](../ENDPOINTS.md) |
