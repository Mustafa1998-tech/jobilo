# Module Documentation

Each NestJS module in Jobilo follows a consistent structure: `module.ts`, `controller.ts`, `service.ts`, and a `dto/` directory for request validation.

---

## AuthModule

**Purpose:** Handle registration, login, token management, email verification, password reset, and session management.

**Endpoints:**

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/register` | Public | Register new user |
| POST | `/auth/login` | Public | Login |
| POST | `/auth/logout` | JWT | Logout |
| POST | `/auth/refresh` | Public | Refresh access token |
| POST | `/auth/verify-email` | Public | Verify email with OTP |
| POST | `/auth/resend-verification` | Public | Resend OTP |
| POST | `/auth/forgot-password` | Public | Send password reset OTP |
| POST | `/auth/reset-password` | Public | Reset password with token |
| POST | `/auth/change-password` | JWT | Change password (authenticated) |
| GET | `/auth/sessions` | JWT | List active sessions |
| DELETE | `/auth/sessions/:id` | JWT | Terminate a session |
| DELETE | `/auth/sessions` | JWT | Terminate all sessions |

**Key Services:** `AuthService`, `AuthHelpersService`

**Dependencies:** `PrismaService`, `JwtService`, `ConfigService`

**See:** [AUTHENTICATION.md](./AUTHENTICATION.md) for full flow documentation.

---

## UsersModule

**Purpose:** User profile CRUD, public profiles, portfolio, reviews display, admin user management.

**Endpoints:**

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| GET | `/users/me` | JWT | — | Get own profile |
| PATCH | `/users/me` | JWT | — | Update profile |
| DELETE | `/users/me` | JWT | — | Delete account |
| GET | `/users/:id` | Public | — | Public profile |
| GET | `/users/:id/portfolio` | Public | — | User portfolio |
| GET | `/users/:id/reviews` | Public | — | User reviews |
| GET | `/users` | JWT | ADMIN, SUPER_ADMIN | List all users |
| PATCH | `/users/:id/role` | JWT | SUPER_ADMIN | Change role |
| PATCH | `/users/:id/status` | JWT | ADMIN, SUPER_ADMIN | Change status |
| POST | `/users/:id/verify` | JWT | ADMIN, SUPER_ADMIN | Verify user |

**Key Services:** `UsersService`

**Support for Arabic:** Profile fields store Arabic text natively. The `locale` field on User determines display language.

---

## ProjectsModule

**Purpose:** Project CRUD with search, filter, pagination, featured projects, bookmarks, reporting.

**Endpoints:**

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| GET | `/projects` | Public | — | List/search/paginate |
| GET | `/projects/featured` | Public | — | Featured projects |
| POST | `/projects` | JWT | CLIENT | Create project |
| GET | `/projects/:id` | Public | — | Get project |
| GET | `/projects/:id/similar` | Public | — | AI-based similar projects |
| PATCH | `/projects/:id` | JWT | — | Update project |
| DELETE | `/projects/:id` | JWT | — | Delete project |
| PATCH | `/projects/:id/status` | JWT | — | Change project status |
| POST | `/projects/:id/feature` | JWT | ADMIN, SUPER_ADMIN | Feature/unfeature |
| POST | `/projects/:id/bookmark` | JWT | — | Bookmark project |
| DELETE | `/projects/:id/bookmark` | JWT | — | Remove bookmark |
| POST | `/projects/:id/report` | JWT | — | Report project |

**Key Services:** `ProjectsService`

**Search/Filter:** Supports `search`, `categoryId`, `status`, `budgetMin`, `budgetMax`, `experienceLevel`, `isUrgent`, `sortBy`, `page`, `pageSize`.

**See:** [PAGINATION.md](./PAGINATION.md) for response format.

---

## ProposalsModule

**Purpose:** Freelancers submit proposals on projects; clients accept/reject/shortlist.

**Endpoints:**

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| POST | `/proposals/projects/:projectId` | JWT | FREELANCER | Submit proposal |
| GET | `/proposals` | JWT | — | List my proposals |
| GET | `/proposals/:id` | JWT | — | Get proposal |
| PATCH | `/proposals/:id` | JWT | — | Update proposal |
| DELETE | `/proposals/:id` | JWT | — | Withdraw proposal |
| PATCH | `/proposals/:id/accept` | JWT | CLIENT | Accept proposal |
| PATCH | `/proposals/:id/reject` | JWT | CLIENT | Reject proposal |
| PATCH | `/proposals/:id/shortlist` | JWT | CLIENT | Shortlist proposal |

**Key Services:** `ProposalsService`

**Constraints:** One proposal per freelancer per project (unique constraint on `[projectId, freelancerId]`).

---

## ContractsModule

**Purpose:** Create contracts from accepted proposals, manage contract lifecycle.

**Endpoints:**

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/contracts` | JWT | Create contract from accepted proposal |
| GET | `/contracts` | JWT | List my contracts |
| GET | `/contracts/:id` | JWT | Get contract details |
| PATCH | `/contracts/:id/status` | JWT | Update contract status |

**Key Services:** Contract service within the module.

**Status Flow:** DRAFT → SIGNED → IN_PROGRESS → COMPLETED (or CANCELLED, DISPUTED).

**See:** [DATABASE.md](./DATABASE.md) for full Contract model.

---

## MessagesModule

**Purpose:** Real-time chat between clients and freelancers via WebSocket (Socket.IO).

**Endpoints:**

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/messages/conversations` | JWT | List conversations |
| GET | `/messages/conversations/:userId` | JWT | Get conversation with user |
| GET | `/messages/projects/:projectId` | JWT | Get project messages |
| POST | `/messages` | JWT | Send a message |
| PATCH | `/messages/:id/read` | JWT | Mark as read |

**WebSocket Events:**

| Event | Direction | Description |
|-------|-----------|-------------|
| `message:send` | Client → Server | Send new message |
| `message:new` | Server → Client | Receive new message |
| `message:read` | Bidirectional | Read receipt |
| `message:typing` | Bidirectional | Typing indicator |
| `conversation:join` | Client → Server | Join conversation room |

**Key Services:** Messages service, MessagesGateway (WebSocket)

---

## ReviewsModule

**Purpose:** Post reviews after contract completion, rating system with sub-scores.

**Endpoints:**

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/contracts/:id/review` | JWT | Submit review |
| GET | `/contracts/:id/reviews` | Public | List contract reviews |
| GET | `/users/:id/reviews` | Public | List user reviews |

**Sub-scores:** `quality`, `communication`, `adherence`, `timeliness` (each 1–5).

**Type:** `CLIENT_TO_FREELANCER` or `FREELANCER_TO_CLIENT`.

---

## NotificationsModule

**Purpose:** In-app notifications and email notifications via Resend.

**Notification Types:**

| Type | Trigger |
|------|---------|
| `NEW_PROPOSAL` | Freelancer submits proposal |
| `PROPOSAL_ACCEPTED` | Client accepts proposal |
| `PROPOSAL_REJECTED` | Client rejects proposal |
| `NEW_MESSAGE` | New message received |
| `PROJECT_STATUS_CHANGE` | Project status updated |
| `MILESTONE_COMPLETED` | Milestone marked complete |
| `REVIEW_RECEIVED` | Review posted |
| `DISPUTE_OPENED` | Dispute opened |
| `DISPUTE_RESOLVED` | Dispute resolved |
| `SYSTEM_ANNOUNCEMENT` | System-wide announcement |

**Key Services:** `NotificationsService`

**Email Provider:** Resend (`noreply@jobilo.com`)

**See:** [DATABASE.md](./DATABASE.md) for Notification model.

---

## CategoriesModule

**Purpose:** Manage project categories and skills taxonomy.

**Endpoints:**

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/categories` | Public | List categories |
| GET | `/categories/:id` | Public | Get category with skills |
| GET | `/skills` | Public | List all skills |

**Key Services:** Categories service.

---

## SuperAdminModule

**Purpose:** Full administrative control — dashboard, analytics, user management, roles, permissions, content, subscriptions, disputes, reports, settings, security, logs, banners.

**Sub-modules:**

| Sub-module | Endpoints | Description |
|------------|-----------|-------------|
| **Auth** | `/super-admin/auth/login`, `/logout`, `/refresh` | Admin authentication with separate JWT |
| **Dashboard** | `/super-admin/dashboard/stats` | Platform statistics (users, projects, revenue) |
| **Analytics** | `/super-admin/analytics/*` | Time-series analytics |
| **Users** | `/super-admin/users/*` | Full user management |
| **Projects** | `/super-admin/projects/*` | Project oversight |
| **Proposals** | `/super-admin/proposals/*` | Proposal oversight |
| **Roles** | `/super-admin/roles/*` | Create/edit admin roles and permissions |
| **Permissions** | `/super-admin/permissions/*` | Permission management |
| **Subscriptions** | `/super-admin/subscriptions/*` | Plans and subscriptions |
| **Content** | `/super-admin/content/*` | Manage pages, blog, FAQ |
| **Disputes** | `/super-admin/disputes/*` | Resolve disputes |
| **Reports** | `/super-admin/reports/*` | User reports management |
| **Settings** | `/super-admin/settings/*` | Platform settings |
| **Security** | `/super-admin/security/*` | IP whitelist/blacklist, security logs |
| **Logs** | `/super-admin/logs/*` | Audit logs, error logs |
| **Banners** | `/super-admin/banners/*` | Banner management |

**Key Services:** Each sub-module has its own service. Shared services include `SuperAdminService`.

**Guards:** `AdminAuthGuard` for JWT verification, `AdminPermissionsGuard` for permission checks using `@AdminPermissions()` decorator with `module_action` format.

**See:** [AUTHORIZATION.md](./AUTHORIZATION.md) for admin role/permission model.
