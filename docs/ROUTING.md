# Routing

> **Version:** 1.0 | **Last Updated:** 2026-07-06 | **Applies to:** Frontend Application (`frontend/`)

## Table of Contents

1. [Next.js App Router Structure](#nextjs-app-router-structure)
2. [Route Groups](#route-groups)
3. [Layout Hierarchy](#layout-hierarchy)
4. [Middleware Configuration](#middleware-configuration)
5. [Dynamic Routes](#dynamic-routes)
6. [API Routes](#api-routes)
7. [404 Page](#404-page)
8. [Loading States](#loading-states)
9. [Error Boundaries](#error-boundaries)

---

## Next.js App Router Structure

Jobilo uses the **Next.js App Router** (`app/` directory) with the following structure:

```
frontend/src/app/
├── (admin)/                    # Admin dashboard (route group)
│   ├── admin/
│   │   ├── layout.tsx          # Admin layout (sidebar + header)
│   │   ├── page.tsx            # Admin dashboard home
│   │   ├── loading.tsx         # Admin loading state
│   │   ├── error.tsx           # Admin error boundary
│   │   ├── projects/
│   │   ├── users/
│   │   ├── settings/
│   │   └── reports/
│   └── super-admin/            # Super admin routes
│       ├── layout.tsx
│       ├── page.tsx
│       ├── permissions/
│       ├── audit-logs/
│       └── system-settings/
├── (auth)/                     # Authentication (route group)
│   ├── login/
│   │   ├── page.tsx
│   │   └── loading.tsx
│   ├── register/
│   │   ├── page.tsx
│   │   └── loading.tsx
│   ├── forgot-password/
│   │   └── page.tsx
│   └── reset-password/
│       └── page.tsx
├── (public)/                   # Public facing (route group)
│   ├── layout.tsx              # Public layout (header + footer)
│   ├── page.tsx                # Home / Landing page
│   ├── about/
│   ├── contact/
│   ├── projects/
│   │   └── [id]/
│   │       └── page.tsx
│   ├── profiles/
│   │   └── [id]/
│   │       └── page.tsx
│   └── search/
├── api/                        # API routes (optional, parallel backend)
│   ├── auth/
│   │   ├── login/route.ts
│   │   ├── register/route.ts
│   │   └── logout/route.ts
│   ├── upload/route.ts
│   └── webhooks/
│       └── stripe/route.ts
├── not-found.tsx                # Global 404
├── error.tsx                   # Global error boundary
├── loading.tsx                 # Global loading
├── layout.tsx                  # Root layout (fonts, providers)
└── page.tsx                    # Root redirect (to (public)/page)
```

---

## Route Groups

### (admin) — Admin & Super Admin

| Route | Access | Layout |
|-------|--------|--------|
| `/admin` | ADMIN, SUPER_ADMIN | AdminLayout (sidebar + topbar) |
| `/admin/projects` | ADMIN | AdminLayout |
| `/admin/users` | ADMIN | AdminLayout |
| `/admin/settings` | ADMIN | AdminLayout |
| `/super-admin` | SUPER_ADMIN | SuperAdminLayout |
| `/super-admin/permissions` | SUPER_ADMIN | SuperAdminLayout |
| `/super-admin/audit-logs` | SUPER_ADMIN | SuperAdminLayout |

### (auth) — Authentication

| Route | Access | Layout |
|-------|--------|--------|
| `/login` | Public (unauthenticated) | AuthLayout (centered card) |
| `/register` | Public (unauthenticated) | AuthLayout |
| `/forgot-password` | Public (unauthenticated) | AuthLayout |
| `/reset-password` | Public (unauthenticated) | AuthLayout |

### (public) — Public Pages

| Route | Access | Layout |
|-------|--------|--------|
| `/` | Public | PublicLayout (header + footer) |
| `/about` | Public | PublicLayout |
| `/contact` | Public | PublicLayout |
| `/projects` | Public | PublicLayout |
| `/projects/[id]` | Public | PublicLayout |
| `/profiles/[id]` | Public | PublicLayout |
| `/search` | Public | PublicLayout |

---

## Layout Hierarchy

```
RootLayout (html, body, fonts, providers)
├── PublicLayout                ─ (public)/layout.tsx
│   ├── Navbar (public)
│   ├── <Outlet />              ─ Page content
│   └── Footer
│
├── AuthLayout                  ─ (auth)/layout.tsx
│   ├── Logo
│   ├── <Outlet />              ─ Centered form content
│   └── Language switcher
│
├── AdminLayout                 ─ (admin)/admin/layout.tsx
│   ├── Sidebar
│   ├── Topbar
│   ├── <Outlet />              ─ Page content
│   └── Footer (minimal)
│
└── SuperAdminLayout            ─ (admin)/super-admin/layout.tsx
    ├── Sidebar (extended)
    ├── Topbar
    ├── <Outlet />
    └── Footer
```

### Root Layout (`app/layout.tsx`)

```tsx
import { Inter, Cairo } from 'next/font/google'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={locale} dir={direction}>
      <body className={`${inter.variable} ${cairo.variable} font-sans antialiased`}>
        <Providers>  {/* React Query, Theme, Toast, etc. */}
          {children}
        </Providers>
      </body>
    </html>
  )
}
```

---

## Middleware Configuration

File location: `frontend/src/middleware.ts`

### Authentication Middleware

```tsx
// middleware.ts
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const pathname = req.nextUrl.pathname

    // Admin route protection
    if (pathname.startsWith('/admin') && token?.role !== 'ADMIN' && token?.role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    // Super admin only
    if (pathname.startsWith('/super-admin') && token?.role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/admin', req.url))
    }

    // Auth pages redirect if already logged in
    if (pathname.startsWith('/login') && token) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: ['/admin/:path*', '/super-admin/:path*', '/dashboard/:path*'],
}
```

### Language Detection

```tsx
// Language middleware (in same file or separate)
const LANGUAGES = ['en', 'ar']
const DEFAULT_LANG = 'ar'

export function languageMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const segments = pathname.split('/')
  const lang = segments[1]

  if (!LANGUAGES.includes(lang)) {
    const preferredLang = req.cookies.get('lang')?.value
      || req.headers.get('accept-language')?.split(',')[0]?.split('-')[0]
      || DEFAULT_LANG

    const finalLang = LANGUAGES.includes(preferredLang || '') ? preferredLang : DEFAULT_LANG
    return NextResponse.redirect(new URL(`/${finalLang}${pathname}`, req.url))
  }
}
```

### Middleware Chain

Middleware runs in this order:
1. **Language detection** — redirect to `/ar/...` or `/en/...`
2. **Authentication check** — verify JWT session
3. **Role authorization** — check permissions for route
4. **Rate limiting** — optional for API routes

---

## Dynamic Routes

### Project Detail

```
app/(public)/projects/[id]/page.tsx
```

```tsx
interface ProjectPageProps {
  params: { id: string }
  searchParams: { tab?: string }
}

export default async function ProjectPage({ params, searchParams }: ProjectPageProps) {
  const project = await getProject(params.id)

  return (
    <Container>
      <ProjectDetail project={project} activeTab={searchParams.tab} />
    </Container>
  )
}
```

### Profile Detail

```
app/(public)/profiles/[id]/page.tsx
```

### Admin Edit Routes

```
app/(admin)/admin/projects/[id]/edit/page.tsx
app/(admin)/admin/projects/new/page.tsx
app/(admin)/admin/users/[userId]/page.tsx
```

### Route Parameters

| Pattern | Example | Params |
|---------|---------|--------|
| `projects/[id]` | `/projects/abc-123` | `{ id: 'abc-123' }` |
| `profiles/[id]` | `/profiles/user-456` | `{ id: 'user-456' }` |
| `admin/projects/[id]/edit` | `/admin/projects/abc-123/edit` | `{ id: 'abc-123' }` |
| `admin/users/[userId]` | `/admin/users/789` | `{ userId: '789' }` |

---

## API Routes

While the primary backend is NestJS (port 3001), Next.js API routes are used for:

| Route | Purpose |
|-------|---------|
| `api/auth/[...nextauth]` | NextAuth.js authentication endpoints |
| `api/upload` | File upload (proxied to S3/CDN) |
| `api/webhooks/stripe` | Stripe webhook handling |

### API Proxy Configuration

```tsx
// next.config.ts
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*', // NestJS backend
      },
    ]
  },
}
```

> See [ENDPOINTS.md](../ENDPOINTS.md) for complete API endpoint reference.

---

## 404 Page

File: `frontend/src/app/not-found.tsx`

```tsx
export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <p className="mt-4 text-lg text-gray-600">Page not found</p>
        <p className="mt-2 text-sm text-gray-500">
          The page you are looking for does not exist or has been moved.
        </p>
        <Button asChild className="mt-8">
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  )
}
```

---

## Loading States

### Per-Page Loading

Each route group has a `loading.tsx` that renders while the page loads:

```tsx
// app/(dashboard)/dashboard/loading.tsx
export default function DashboardLoading() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className="h-8 w-48" />   {/* Page title */}
      <div className="grid grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-lg" /> {/* Content area */}
    </div>
  )
}
```

### Streaming with Suspense

```tsx
// Page that streams data sections
export default function DashboardPage() {
  return (
    <Container>
      <h1>Dashboard</h1>
      <Suspense fallback={<StatsSkeleton />}>
        <StatsSection />
      </Suspense>
      <Suspense fallback={<RecentProjectsSkeleton />}>
        <RecentProjects />
      </Suspense>
    </Container>
  )
}
```

---

## Error Boundaries

### Global Error Page

File: `frontend/src/app/error.tsx`

```tsx
'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <ErrorState
        title="Something went wrong"
        message={error.message || 'An unexpected error occurred.'}
        action={<Button onClick={reset}>Try Again</Button>}
      />
    </div>
  )
}
```

### Layout-Specific Error Boundaries

```tsx
// app/(admin)/admin/error.tsx — applies to all admin routes
'use client'

export default function AdminError({ error, reset }: {
  error: Error
  reset: () => void
}) {
  return (
    <div className="p-8">
      <ErrorState
        title="Admin error"
        message="An error occurred in the admin panel."
        onRetry={reset}
      />
    </div>
  )
}
```

### Error Boundary Hierarchy

```
Root Error (app/error.tsx)
├── Public Error (app/(public)/error.tsx)
├── Auth Error (app/(auth)/error.tsx)
└── Admin Error (app/(admin)/admin/error.tsx)
    └── Super Admin Error (app/(admin)/super-admin/error.tsx)
```

---

## Cross-References

| Document | Link |
|----------|------|
| Authentication | [AUTHENTICATION.md](../AUTHENTICATION.md) |
| Authorization / RBAC | [RBAC.md](./RBAC.md) |
| State Management | [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md) |
| API Endpoints | [ENDPOINTS.md](../ENDPOINTS.md) |
| UI Guidelines (loading/error) | [UI_GUIDELINES.md](./UI_GUIDELINES.md) |
