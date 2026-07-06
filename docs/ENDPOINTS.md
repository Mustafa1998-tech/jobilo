# API Endpoints

All endpoints are prefixed with `/api/v1`. Auth-protected endpoints require `Authorization: Bearer <token>`.

---

## Auth Endpoints

### Register
```
POST /auth/register
Auth: Public
```

**Request body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "أحمد",
  "lastName": "محمد",
  "role": "FREELANCER",
  "phone": "+249123456789"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": { "id": "uuid", "email": "...", "role": "FREELANCER" },
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}
```

### Login
```
POST /auth/login
Auth: Public
```

```json
{ "email": "user@example.com", "password": "SecurePass123!" }
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": { "id": "uuid", "email": "...", "role": "FREELANCER" },
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}
```

### Logout
```
POST /auth/logout
Auth: Bearer JWT
```

**Response (204):** No content

### Refresh Token
```
POST /auth/refresh
Auth: Public
```

```json
{ "refreshToken": "eyJ..." }
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}
```

### Verify Email
```
POST /auth/verify-email
Auth: Public
```

```json
{ "email": "user@example.com", "otp": "123456" }
```

### Resend Verification
```
POST /auth/resend-verification
Auth: Public
```

```json
{ "email": "user@example.com" }
```

### Forgot Password
```
POST /auth/forgot-password
Auth: Public
```

```json
{ "email": "user@example.com" }
```

### Reset Password
```
POST /auth/reset-password
Auth: Public
```

```json
{ "email": "user@example.com", "otp": "123456", "password": "NewPass123!" }
```

### Change Password
```
POST /auth/change-password
Auth: Bearer JWT
```

```json
{ "currentPassword": "OldPass123!", "newPassword": "NewPass123!" }
```

### List Sessions
```
GET /auth/sessions
Auth: Bearer JWT
```

```json
{
  "success": true,
  "data": [
    { "id": "uuid", "deviceInfo": "Chrome/Windows", "lastActivity": "...", "isActive": true }
  ]
}
```

### Terminate Session
```
DELETE /auth/sessions/:id
Auth: Bearer JWT
```
**Response (204)**

### Terminate All Sessions
```
DELETE /auth/sessions
Auth: Bearer JWT
```
**Response (204)**

---

## Users Endpoints

### Get Profile
```
GET /users/me
Auth: Bearer JWT
```

### Update Profile
```
PATCH /users/me
Auth: Bearer JWT
```

```json
{
  "firstName": "محمد",
  "lastName": "علي",
  "title": "مطور واجهات أمامية",
  "bio": "خبرة 5 سنوات في تطوير الويب"
}
```

### Delete Account
```
DELETE /users/me
Auth: Bearer JWT
```
**Response (204)**

### Get Public Profile
```
GET /users/:id
Auth: Public
```

### Get User Portfolio
```
GET /users/:id/portfolio
Auth: Public
```

### Get User Reviews
```
GET /users/:id/reviews
Auth: Public
```

### List Users (Admin)
```
GET /users?page=1&pageSize=10&role=FREELANCER&status=ACTIVE
Auth: Bearer JWT (ADMIN, SUPER_ADMIN)
```

### Change Role (Super Admin)
```
PATCH /users/:id/role
Auth: Bearer JWT (SUPER_ADMIN)
```
```json
{ "role": "ADMIN" }
```

### Change Status (Admin)
```
PATCH /users/:id/status
Auth: Bearer JWT (ADMIN, SUPER_ADMIN)
```
```json
{ "status": "SUSPENDED" }
```

### Verify User (Admin)
```
POST /users/:id/verify
Auth: Bearer JWT (ADMIN, SUPER_ADMIN)
```

---

## Projects Endpoints

### List Projects
```
GET /projects?page=1&pageSize=10&search=react&categoryId=...&status=OPEN&budgetMin=100&budgetMax=5000&experienceLevel=INTERMEDIATE&sortBy=newest
Auth: Public
```

### Featured Projects
```
GET /projects/featured
Auth: Public
```

### Create Project
```
POST /projects
Auth: Bearer JWT (CLIENT)
```

```json
{
  "title": "تطبيق ويب بلغة React",
  "description": "أبحث عن مطور React لبناء تطبيق...",
  "categoryId": "uuid",
  "projectType": "FIXED",
  "budgetFixed": 2000,
  "durationDays": 30,
  "experienceLevel": "INTERMEDIATE",
  "skillIds": ["uuid1", "uuid2"]
}
```

### Get Project
```
GET /projects/:id
Auth: Public
```

### Similar Projects
```
GET /projects/:id/similar
Auth: Public
```

### Update Project
```
PATCH /projects/:id
Auth: Bearer JWT
```

### Delete Project
```
DELETE /projects/:id
Auth: Bearer JWT
```
**Response (204)**

### Change Status
```
PATCH /projects/:id/status
Auth: Bearer JWT
```
```json
{ "status": "CANCELLED" }
```

### Feature/Unfeature (Admin)
```
POST /projects/:id/feature
Auth: Bearer JWT (ADMIN, SUPER_ADMIN)
```

### Bookmark Project
```
POST /projects/:id/bookmark
Auth: Bearer JWT
```

### Remove Bookmark
```
DELETE /projects/:id/bookmark
Auth: Bearer JWT
```

### Report Project
```
POST /projects/:id/report
Auth: Bearer JWT
```
```json
{ "reason": "مشروع غير حقيقي" }
```

---

## Proposals Endpoints

### Create Proposal
```
POST /proposals/projects/:projectId
Auth: Bearer JWT (FREELANCER)
```

```json
{
  "coverLetter": "أنا مهتم جداً بهذا المشروع...",
  "bidAmount": 1500,
  "durationDays": 20
}
```

### List My Proposals
```
GET /proposals?status=PENDING
Auth: Bearer JWT
```

### Get Proposal
```
GET /proposals/:id
Auth: Bearer JWT
```

### Update Proposal
```
PATCH /proposals/:id
Auth: Bearer JWT
```

### Withdraw Proposal
```
DELETE /proposals/:id
Auth: Bearer JWT
```
**Response (204)**

### Accept Proposal
```
PATCH /proposals/:id/accept
Auth: Bearer JWT (CLIENT)
```

### Reject Proposal
```
PATCH /proposals/:id/reject
Auth: Bearer JWT (CLIENT)
```

### Shortlist Proposal
```
PATCH /proposals/:id/shortlist
Auth: Bearer JWT (CLIENT)
```

---

## Messages Endpoints

### List Conversations
```
GET /messages/conversations
Auth: Bearer JWT
```

### Get Conversation
```
GET /messages/conversations/:userId
Auth: Bearer JWT
```

### Get Project Messages
```
GET /messages/projects/:projectId
Auth: Bearer JWT
```

### Send Message
```
POST /messages
Auth: Bearer JWT
```

```json
{
  "receiverId": "uuid",
  "content": "مرحباً، أنا مهتم بالمشروع",
  "projectId": "uuid (optional)"
}
```

### Mark as Read
```
PATCH /messages/:id/read
Auth: Bearer JWT
```

### WebSocket Events
```
Connection: ws://localhost:4000
Event: message:send    → { receiverId, content, projectId }
Event: message:new     ← { id, senderId, content, createdAt }
Event: message:typing  → { receiverId, isTyping: true }
```

---

## Contracts Endpoints

### Create Contract
```
POST /contracts
Auth: Bearer JWT
```

```json
{
  "proposalId": "uuid",
  "terms": "شروط العقد..."
}
```

### List Contracts
```
GET /contracts?status=IN_PROGRESS
Auth: Bearer JWT
```

### Get Contract
```
GET /contracts/:id
Auth: Bearer JWT
```

### Update Contract Status
```
PATCH /contracts/:id/status
Auth: Bearer JWT
```

```json
{ "status": "SIGNED" }
```

---

## Super Admin Endpoints

### Admin Auth
```
POST /super-admin/auth/login       → { email, password }
POST /super-admin/auth/logout      → (protected)
POST /super-admin/auth/refresh     → { refreshToken }
```

### Dashboard
```
GET  /super-admin/dashboard/stats   → platform statistics
```

### Analytics
```
GET  /super-admin/analytics/overview
GET  /super-admin/analytics/users?period=monthly
GET  /super-admin/analytics/projects?period=weekly
GET  /super-admin/analytics/revenue?period=daily
GET  /super-admin/analytics/proposals
GET  /super-admin/analytics/disputes
```

### User Management
```
GET    /super-admin/users?page=1&role=FREELANCER&status=SUSPENDED
GET    /super-admin/users/:id
PATCH  /super-admin/users/:id/status   → { status }
PATCH  /super-admin/users/:id/verify
DELETE /super-admin/users/:id
```

### Project Management
```
GET    /super-admin/projects?status=DISPUTED
GET    /super-admin/projects/:id
PATCH  /super-admin/projects/:id/status → { status }
DELETE /super-admin/projects/:id
```

### Proposal Management
```
GET    /super-admin/proposals?status=PENDING
GET    /super-admin/proposals/:id
```

### Roles & Permissions
```
GET    /super-admin/roles
POST   /super-admin/roles               → { name, nameAr, permissions[] }
PUT    /super-admin/roles/:id
DELETE /super-admin/roles/:id
GET    /super-admin/permissions
```

### Subscriptions
```
GET    /super-admin/subscriptions
GET    /super-admin/subscriptions/plans
POST   /super-admin/subscriptions/plans  → { name, nameAr, features }
PUT    /super-admin/subscriptions/plans/:id
```

### Content Management
```
GET    /super-admin/content/pages
POST   /super-admin/content/pages        → { title, titleAr, content, contentAr, slug }
PUT    /super-admin/content/pages/:id
DELETE /super-admin/content/pages/:id

GET    /super-admin/content/blog
POST   /super-admin/content/blog         → { title, titleAr, content, contentAr }
PUT    /super-admin/content/blog/:id
DELETE /super-admin/content/blog/:id

GET    /super-admin/content/faqs
POST   /super-admin/content/faqs
PUT    /super-admin/content/faqs/:id
```

### Disputes
```
GET  /super-admin/disputes?status=OPEN
GET  /super-admin/disputes/:id
POST /super-admin/disputes/:id/resolve   → { resolution, action }
```

### Reports
```
GET  /super-admin/reports?status=PENDING
GET  /super-admin/reports/:id
POST /super-admin/reports/:id/review     → { status, note, actionTaken }
```

### Platform Settings
```
GET    /super-admin/settings
PUT    /super-admin/settings/:key        → { value }
```

### Security
```
GET    /super-admin/security/whitelist
POST   /super-admin/security/whitelist   → { ipAddress, label }
DELETE /super-admin/security/whitelist/:id

GET    /super-admin/security/blacklist
POST   /super-admin/security/blacklist   → { ipAddress, reason }
DELETE /super-admin/security/blacklist/:id

GET    /super-admin/security/logs
```

### Audit & Error Logs
```
GET /super-admin/logs/audit?page=1&action=USER_DELETED
GET /super-admin/logs/errors?level=ERROR&resolved=false
```

### Banners
```
GET    /super-admin/banners
POST   /super-admin/banners              → { title, titleAr, imageUrl, linkUrl, position }
PUT    /super-admin/banners/:id
DELETE /super-admin/banners/:id
```

---

## HTTP Status Codes Used

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 204 | No Content (success, no body) |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Unprocessable Entity |
| 429 | Rate Limit Exceeded |
| 500 | Internal Server Error |

**See:** [ERROR_HANDLING.md](./ERROR_HANDLING.md) for error details.
