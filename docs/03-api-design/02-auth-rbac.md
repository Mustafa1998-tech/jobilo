# Jobilo - Authentication, Authorization & RBAC

---

## Authentication Strategy

### JWT Token Based Authentication

| Token | Location | Lifetime | Purpose |
|-------|----------|----------|---------|
| **Access Token** | Authorization Header (`Bearer`) | 15 minutes | API access |
| **Refresh Token** | HTTP-Only Secure Cookie | 7 days | Get new access token |
| **Email Verification Token** | Query Param (email link) | 1 hour | Verify email |
| **Password Reset Token** | Query Param (email link) | 30 minutes | Reset password |

### Token Payload

#### Access Token
```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "role": "FREELANCER",
  "iat": 1625000000,
  "exp": 1625000900
}
```

#### Refresh Token
```json
{
  "sub": "user-uuid",
  "tokenId": "session-uuid",
  "type": "refresh",
  "iat": 1625000000,
  "exp": 1625604800
}
```

### Auth Flow

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Client  │    │  API     │    │  DB      │    │  Redis   │
└────┬─────┘    └────┬─────┘    └────┬─────┘    └────┬─────┘
     │                │               │               │
     │ POST /auth/    │               │               │
     │ login          │               │               │
     │───────────────►│               │               │
     │                │ Verify        │               │
     │                │ Credentials   │               │
     │                │──────────────►│               │
     │                │◄──────────────│               │
     │                │               │               │
     │                │ Generate      │               │
     │                │ Tokens        │               │
     │                │ Store Refresh │               │
     │                │──────────────►│               │
     │                │               │               │
     │◄───────────────│               │               │
     │ {accessToken,  │               │               │
     │  refreshToken  │               │               │
     │  in cookie}    │               │               │
     │                │               │               │
     │ GET /projects  │               │               │
     │ (with Bearer)  │               │               │
     │───────────────►│               │               │
     │                │ Validate JWT  │               │
     │                │ & Check Redis │               │
     │                │──────────────►│               │
     │                │◄──────────────│               │
     │                │               │               │
     │◄───────────────│               │               │
     │ Projects Data  │               │               │
```

### Refresh Token Flow
```
POST /auth/refresh
Cookie: refreshToken=<token>

Response:
{ "accessToken": "new-jwt-token" }
```

### Logout Flow
```
POST /auth/logout
→ Blacklist refresh token in Redis
→ Clear refresh cookie
→ Invalidate all user sessions (optional)
```

---

## RBAC (Role Based Access Control)

### Roles Hierarchy
```
SUPER_ADMIN → ADMIN → CLIENT → FREELANCER
                  ↓
              (extends)
```

### Permission Matrix

| Module | Action | Public | Freelancer | Client | Admin | Super Admin |
|--------|--------|--------|-----------|--------|-------|------------|
| **Auth** | Register | ✅ | - | - | - | - |
| | Login | ✅ | - | - | - | - |
| | Refresh Token | ✅ | - | - | - | - |
| | Logout | - | ✅ | ✅ | ✅ | ✅ |
| **Users** | View own profile | - | ✅ | ✅ | ✅ | ✅ |
| | View any profile | - | ✅ | ✅ | ✅ | ✅ |
| | Update own profile | - | ✅ | ✅ | - | - |
| | Update any profile | - | - | - | ✅ | ✅ |
| | Delete account | - | ✅ | ✅ | - | - |
| | Suspend user | - | - | - | ✅ | ✅ |
| | Verify user | - | - | - | ✅ | ✅ |
| **Projects** | Browse projects | ✅ | ✅ | ✅ | ✅ | ✅ |
| | View project detail | ✅ | ✅ | ✅ | ✅ | ✅ |
| | Create project | - | - | ✅ | - | - |
| | Update own project | - | - | ✅ | - | - |
| | Update any project | - | - | - | ✅ | ✅ |
| | Delete own project | - | - | ✅ | - | - |
| | Delete any project | - | - | - | ✅ | ✅ |
| | Close project | - | - | ✅ | - | - |
| | Feature project | - | - | - | ✅ | ✅ |
| **Proposals** | Submit proposal | - | ✅ | - | - | - |
| | View own proposals | - | ✅ | - | - | - |
| | View project proposals | - | - | ✅ | ✅ | ✅ |
| | Accept/reject proposal | - | - | ✅ | ✅ | ✅ |
| **Contracts** | View own contracts | - | ✅ | ✅ | ✅ | ✅ |
| | View any contract | - | - | - | ✅ | ✅ |
| | Sign contract | - | ✅ | ✅ | - | - |
| | Cancel contract | - | ✅ | ✅ | - | - |
| | Force cancel | - | - | - | ✅ | ✅ |
| **Payments** | View own transactions | - | ✅ | ✅ | ✅ | ✅ |
| | Fund escrow | - | - | ✅ | - | - |
| | Release payment | - | - | ✅ | - | - |
| | Force release/refund | - | - | - | ✅ | ✅ |
| | View platform revenue | - | - | - | ✅ | ✅ |
| **Messages** | Send message | - | ✅ | ✅ | ✅ | ✅ |
| | Read own messages | - | ✅ | ✅ | ✅ | ✅ |
| | Read any message | - | - | - | ✅ | ✅ |
| | Report message | - | ✅ | ✅ | ✅ | - |
| **Reviews** | Submit review | - | ✅ | ✅ | - | - |
| | View reviews | ✅ | ✅ | ✅ | ✅ | ✅ |
| | Flag review | - | ✅ | ✅ | ✅ | ✅ |
| | Delete review | - | - | - | ✅ | ✅ |
| **Disputes** | Open dispute | - | ✅ | ✅ | - | - |
| | Submit evidence | - | ✅ | ✅ | - | - |
| | View dispute | - | ✅ | ✅ | ✅ | ✅ |
| | Resolve dispute | - | - | - | ✅ | ✅ |
| **Admin** | View dashboard | - | - | - | ✅ | ✅ |
| | Manage categories | - | - | - | ✅ | ✅ |
| | Manage skills | - | - | - | ✅ | ✅ |
| | Manage platform settings | - | - | - | - | ✅ |
| | View audit logs | - | - | - | ✅ | ✅ |
| **AI** | Use AI features | - | ✅ | ✅ | ✅ | ✅ |
| | Configure AI | - | - | - | - | ✅ |

---

## Guards & Decorators

### NestJS Guard Implementation

```typescript
// Guards
@UseGuards(JwtAuthGuard)           // Must be authenticated
@UseGuards(RolesGuard)             // Check roles
@UseGuards(ThrottlerGuard)         // Rate limiting
@UseGuards(EmailVerifiedGuard)     // Must verify email

// Decorators
@Roles(UserRole.ADMIN)             // Require specific role
@CurrentUser() user               // Inject current user
@Public()                          // Skip auth (e.g., login)
@Throttle({ default: { limit: 10, ttl: 60000 } })
```

### Example Usage
```typescript
@Controller('projects')
export class ProjectsController {
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CLIENT)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async create(
    @Body() dto: CreateProjectDto,
    @CurrentUser() user: JwtPayload
  ) {
    return this.projectsService.create(user.sub, dto);
  }

  @Get()
  @Public()
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  async findAll(@Query() query: QueryProjectsDto) {
    return this.projectsService.findAll(query);
  }
}
```

---

## Email Verification Flow

```
1. User registers → Account status = PENDING
2. Email sent with OTP (6 digits) or magic link
3. User enters OTP or clicks link
4. POST /auth/verify-email { email, otp }
5. Account status → ACTIVE
6. User can now use platform features
```

### OTP Rules
- 6-digit numeric code
- Expires in 10 minutes
- Max 3 attempts per code
- New code can be requested every 60 seconds
- Max 5 codes per email per day

---

## Password Policy

| Requirement | Rule |
|------------|------|
| Minimum length | 8 characters |
| Maximum length | 128 characters |
| Uppercase | At least 1 |
| Lowercase | At least 1 |
| Digit | At least 1 |
| Special character | Optional (encouraged) |
| Common passwords | Checked against common password list |
| Password history | Last 5 passwords prevented |
| Max attempts before lockout | 5 failed attempts |
| Lockout duration | 15 minutes |

---

## Session Management

| Feature | Implementation |
|---------|---------------|
| Active sessions tracking | Redis set per user |
| Max concurrent sessions | 5 per user |
| Remote logout | DELETE /auth/sessions/:id |
| Logout all devices | DELETE /auth/sessions |
| Session inactivity timeout | 24 hours |
| Remember me | 30 days (longer refresh token) |

---

## OAuth 2.0 / Social Login

| Provider | Scopes | Use Case |
|----------|--------|---------|
| Google | email, profile | Quick registration |
| LinkedIn | email, profile, w_member_social | Professional network |
| GitHub | read:user, user:email | Developer community |

### OAuth Flow
```
1. Frontend redirects to provider's consent screen
2. Provider redirects back with auth code
3. Backend exchanges code for access token
4. Backend fetches user info from provider
5. If user exists → Login; If new → Create account
6. Return JWT tokens
```
