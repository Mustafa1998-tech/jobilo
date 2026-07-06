# Role-Based Access Control (RBAC)

> **Version:** 1.0 | **Last Updated:** 2026-07-06 | **Applies to:** Backend (`backend/`) & Frontend (`frontend/`)

## Table of Contents

1. [User Roles](#user-roles)
2. [Admin Permissions Module/Action Matrix](#admin-permissions-moduleaction-matrix)
3. [Permission Checking in Backend](#permission-checking-in-backend)
4. [Permission Checking in Frontend](#permission-checking-in-frontend)
5. [Admin Role Management UI](#admin-role-management-ui)
6. [Default Permissions by Role](#default-permissions-by-role)
7. [Inheritance Rules](#inheritance-rules)

---

## User Roles

### Role Enum

```ts
// backend/src/common/enums/role.enum.ts
export enum UserRole {
  FREELANCER = 'FREELANCER',
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}
```

### Role Descriptions

| Role | Symbol | Description | Access Level |
|------|--------|-------------|-------------|
| **FREELANCER** | 🛠️ | Individual service provider | Browse projects, submit proposals, manage profile |
| **CLIENT** | 💼 | Project owner / employer | Post projects, review proposals, hire freelancers |
| **ADMIN** | 🔧 | Platform administrator | Manage users, projects, reports, content moderation |
| **SUPER_ADMIN** | ⚡ | System administrator | Full access, role management, system configuration |

### Frontend Role Constant

```ts
// frontend/src/lib/constants/roles.ts
export const ROLES = {
  FREELANCER: 'FREELANCER',
  CLIENT: 'CLIENT',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

export const ROLE_HIERARCHY: Record<Role, number> = {
  FREELANCER: 0,
  CLIENT: 1,
  ADMIN: 2,
  SUPER_ADMIN: 3,
}
```

---

## Admin Permissions Module/Action Matrix

### Modules

| Module | Code | Description |
|--------|------|-------------|
| Users | `users` | User management (CRUD, suspend, verify) |
| Projects | `projects` | Project management (review, feature, close) |
| Proposals | `proposals` | Proposal management (review, flag) |
| Categories | `categories` | Skill/category management |
| Payments | `payments` | Payment processing, refunds, disputes |
| Reports | `reports` | Platform reports and analytics |
| Settings | `settings` | System settings and configuration |
| Permissions | `permissions` | Role and permission management |
| Audit Logs | `audit_logs` | System audit trail |
| Notifications | `notifications` | System-wide notifications |
| Support | `support` | Support ticket management |
| Content | `content` | Content moderation |

### Actions

| Action | Code | Description |
|--------|------|-------------|
| Create | `create` | Create new resource |
| Read | `read` | View resource details |
| Update | `update` | Edit existing resource |
| Delete | `delete` | Remove resource |
| Approve | `approve` | Approve pending items |
| Reject | `reject` | Reject items |
| Suspend | `suspend` | Temporarily disable |
| Ban | `ban` | Permanently restrict |
| Export | `export` | Export data |
| Assign | `assign` | Assign roles/permissions |

### Permission Matrix

| Module | ADMIN | SUPER_ADMIN |
|--------|-------|-------------|
| users | read, update, suspend | create, read, update, delete, suspend, ban |
| projects | read, update, approve, reject | create, read, update, delete, approve, reject |
| proposals | read, update, reject | create, read, update, delete, reject |
| categories | read | create, read, update, delete |
| payments | read | read, update, refund |
| reports | read, export | create, read, export |
| settings | read | read, update |
| permissions | read | create, read, update, delete, assign |
| audit_logs | read | read, export |
| notifications | create, read | create, read, update, delete |
| support | read, update | read, update, assign |
| content | read, update | create, read, update, delete |

---

## Permission Checking in Backend

### RolesGuard

```ts
// backend/src/common/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from '../decorators/roles.decorator'
import { UserRole } from '../enums/role.enum'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (!requiredRoles) {
      return true // No roles required = public endpoint
    }
    const { user } = context.switchToHttp().getRequest()
    return requiredRoles.some((role) => user.role === role)
  }
}
```

### @Roles Decorator

```ts
// backend/src/common/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common'
import { UserRole } from '../enums/role.enum'

export const ROLES_KEY = 'roles'
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles)
```

### PermissionsGuard

```ts
// backend/src/common/guards/permissions.guard.ts
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()]
    )
    if (!requiredPermissions) {
      return true
    }
    const { user } = context.switchToHttp().getRequest()
    // SUPER_ADMIN bypasses permission check
    if (user.role === UserRole.SUPER_ADMIN) {
      return true
    }
    return requiredPermissions.every((perm) =>
      user.permissions?.some(
        (up: any) => up.module === perm.module && up.actions.includes(perm.action)
      )
    )
  }
}
```

### @Permissions Decorator

```ts
export const PERMISSIONS_KEY = 'permissions'
export const Permissions = (...permissions: Permission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions)
```

### Controller Usage

```ts
// backend/src/modules/admin/admin.controller.ts
@Controller('admin/users')
export class AdminUsersController {
  @Get()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Permissions({ module: 'users', action: 'read' })
  findAll() {
    return this.usersService.findAll()
  }

  @Post(':id/suspend')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Permissions({ module: 'users', action: 'suspend' })
  suspend(@Param('id') id: string) {
    return this.usersService.suspend(id)
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN) // Only SUPER_ADMIN can delete users
  @Permissions({ module: 'users', action: 'delete' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id)
  }
}
```

### Backend Guard Chain

```
AuthGuard (JWT verification)
  └── RolesGuard (check role)
      └── PermissionsGuard (check module/action)
```

> See [AUTHORIZATION.md](../AUTHORIZATION.md) for detailed authorization architecture.

---

## Permission Checking in Frontend

### hasPermission Utility

```ts
// frontend/src/lib/utils/permissions.ts
import { useAdminAuthStore } from '@/store/admin-auth-store'

export type Module =
  | 'users' | 'projects' | 'proposals' | 'categories'
  | 'payments' | 'reports' | 'settings' | 'permissions'
  | 'audit_logs' | 'notifications' | 'support' | 'content'

export type Action =
  | 'create' | 'read' | 'update' | 'delete'
  | 'approve' | 'reject' | 'suspend' | 'ban'
  | 'export' | 'assign'

interface Permission {
  module: Module
  actions: Action[]
}

/**
 * Check if the current admin has a specific permission.
 * SUPER_ADMIN always returns true.
 */
export function hasPermission(module: Module, action: Action): boolean {
  const { permissions, role } = useAdminAuthStore.getState()
  if (role === 'SUPER_ADMIN') return true
  return permissions.some(
    (p: Permission) => p.module === module && p.actions.includes(action)
  )
}

/**
 * Check if the current user has one of the specified roles.
 */
export function hasRole(roles: string[]): boolean {
  const { role } = useAdminAuthStore.getState()
  return roles.includes(role || '')
}

/**
 * Higher-order component / wrapper for conditional rendering.
 */
export function Can({
  module,
  action,
  children,
  fallback = null,
}: {
  module: Module
  action: Action
  children: ReactNode
  fallback?: ReactNode
}) {
  if (hasPermission(module, action)) {
    return <>{children}</>
  }
  return <>{fallback}</>
}
```

### Frontend Usage

```tsx
// Conditional rendering based on permissions
import { Can, hasPermission } from '@/lib/utils/permissions'

// Component-level protection
function UserActions({ userId }: { userId: string }) {
  return (
    <div className="flex gap-2">
      <Button onClick={() => handleEdit(userId)}>Edit</Button>

      {/* Only show suspend button if user has permission */}
      <Can module="users" action="suspend" fallback={null}>
        <Button variant="warning" onClick={() => handleSuspend(userId)}>
          Suspend
        </Button>
      </Can>

      {/* Only show delete for SUPER_ADMIN */}
      {hasPermission('users', 'delete') && (
        <Button variant="danger" onClick={() => handleDelete(userId)}>
          Delete
        </Button>
      )}
    </div>
  )
}

// Route-level protection (in layout or page)
function AdminLayout({ children }: { children: ReactNode }) {
  const { isAdmin, role } = useAdminAuthStore()

  if (!isAdmin) {
    redirect('/login')
  }

  if (role !== 'SUPER_ADMIN' && pathname.startsWith('/super-admin')) {
    redirect('/admin')
  }

  return <AdminShell>{children}</AdminShell>
}
```

---

## Admin Role Management UI

### List View

```
┌─────────────────────────────────────────────────────────────┐
│  Users > Admin Management                                    │
│                                                              │
│  ┌─────┬──────────┬──────────┬──────────┬──────────────────┐ │
│  │  #  │ Name     │ Email    │ Role     │ Actions          │ │
│  ├─────┼──────────┼──────────┼──────────┼──────────────────┤ │
│  │  1  │ Ahmed    │ a@j.com  │ ADMIN    │ [Edit] [Remove]  │ │
│  │  2  │ Sarah    │ s@j.com  │ SUPER    │ [Edit] [Remove]  │ │
│  │  3  │ John     │ j@j.com  │ ADMIN    │ [Edit] [Remove]  │ │
│  └─────┴──────────┴──────────┴──────────┴──────────────────┘ │
│                                                              │
│  [+ Add Admin]                                               │
└─────────────────────────────────────────────────────────────┘
```

### Permission Editor

```
┌─────────────────────────────────────────────────────────────┐
│  Edit Permissions: Ahmed                                    │
│                                                              │
│  Role: ADMIN [▼]                                             │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Module           │ Read │ Create │ Update │ Delete     │ │
│  ├──────────────────┼──────┼────────┼────────┼────────────┤ │
│  │ Users            │  ✅  │   ❌   │   ✅   │    ❌      │ │
│  │ Projects         │  ✅  │   ❌   │   ✅   │    ❌      │ │
│  │ Payments         │  ✅  │   ❌   │   ❌   │    ❌      │ │
│  │ Reports          │  ✅  │   ✅   │   ❌   │    ❌      │ │
│  │ Settings         │  ✅  │   ❌   │   ❌   │    ❌      │ │
│  │ Permissions      │  ❌  │   ❌   │   ❌   │    ❌      │ │
│  └──────────────────┴──────┴────────┴────────┴────────────┘ │
│                                                              │
│  [Cancel] [Save Changes]                                     │
└─────────────────────────────────────────────────────────────┘
```

### Permission API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/permissions` | Get all permissions |
| GET | `/api/admin/permissions/:userId` | Get user's permissions |
| PUT | `/api/admin/permissions/:userId` | Update user permissions |
| GET | `/api/admin/roles` | List all roles |
| POST | `/api/admin/roles` | Create custom role |
| PUT | `/api/admin/roles/:id` | Update role permissions |

---

## Default Permissions by Role

### FREELANCER

| Module | Actions |
|--------|---------|
| Profile | read (own), update (own) |
| Projects | read (public), create (own), read (own) |
| Proposals | create, read (own), update (own), delete (own) |
| Messages | create, read (own), update (own) |
| Payments | read (own) |
| Notifications | read (own), update (own) |

### CLIENT

| Module | Actions |
|--------|---------|
| Profile | read (own), update (own) |
| Projects | create, read, update (own), delete (own) |
| Proposals | read (own projects), approve, reject |
| Messages | create, read (own), update (own) |
| Payments | create, read (own) |
| Notifications | read (own), update (own) |

### ADMIN

| Module | Actions |
|--------|---------|
| Users | read, update, suspend |
| Projects | read, update, approve, reject |
| Proposals | read, update, reject |
| Payments | read |
| Reports | read, export |
| Notifications | create, read |
| Support | read, update |
| Content | read, update |

### SUPER_ADMIN

| Module | Actions |
|--------|---------|
| All modules | create, read, update, delete, approve, reject, suspend, ban, export, assign |

---

## Inheritance Rules

### Role Hierarchy

```
SUPER_ADMIN
    │
    ▼
ADMIN
    │
    ▼
CLIENT ──── FREELANCER (siblings, no inheritance between them)
```

### Rule Set

| Rule | Description |
|------|-------------|
| **Upward inheritance** | A role inherits all permissions of roles below it in the hierarchy |
| **Sibling isolation** | FREELANCER and CLIENT do NOT inherit from each other |
| **Super admin override** | SUPER_ADMIN has unrestricted access to all modules |
| **Explicit deny** | Permissions set to `false` explicitly override inherited permissions |
| **Custom roles** | Custom roles inherit from the closest parent role |
| **Scope limitation** | FREELANCER/CLIENT permissions are scoped to their own resources |

### Inheritance Example

```
SUPER_ADMIN has: [users.*, projects.*, payments.*, ...]
    │
    ▼
ADMIN has: [users.read+update, projects.read+update+approve+reject, ...]
    │ (also inherits CLIENT+Freelancer perms)
    ▼
CLIENT has: [profile.own.*, projects.own.*, proposals.own.*, ...]
```

### Permission Resolution Algorithm

```ts
function resolvePermissions(user: User): Permission[] {
  if (user.role === 'SUPER_ADMIN') {
    return ALL_PERMISSIONS // Every module, every action
  }

  // Start with base permissions for the role
  const permissions = [...BASE_PERMISSIONS[user.role]]

  // Add inherited permissions from lower roles
  if (user.role === 'ADMIN') {
    permissions.push(...BASE_PERMISSIONS['CLIENT'])
    permissions.push(...BASE_PERMISSIONS['FREELANCER'])
  }

  // Merge custom overrides if exist
  if (user.customPermissions) {
    return mergePermissions(permissions, user.customPermissions)
  }

  return permissions
}
```

---

## Cross-References

| Document | Link |
|----------|------|
| Authentication | [AUTHENTICATION.md](../AUTHENTICATION.md) |
| Authorization | [AUTHORIZATION.md](../AUTHORIZATION.md) |
| State Management (admin store) | [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md) |
| Error Codes | [ERROR_CODES.md](./ERROR_CODES.md) |
| Backend Architecture | [BACKEND.md](../BACKEND.md) |
