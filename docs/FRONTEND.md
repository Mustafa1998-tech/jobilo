# Frontend Architecture

Jobilo uses **Next.js 15** (App Router) with **React 19**, optimized for the Arabic-speaking freelance market.

## Tech Stack

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | ^15.0.0 | Framework (App Router) |
| `react` | ^19.0.0 | UI library |
| `react-dom` | ^19.0.0 | DOM rendering |
| `@tanstack/react-query` | ^5.0.0 | Server state management |
| `zustand` | ^5.0.0 | Client state management |
| `react-hook-form` | ^7.0.0 | Form handling |
| `zod` | ^3.0.0 | Schema validation |
| `axios` | ^1.7.0 | HTTP client |
| `next-intl` | ^3.0.0 | Internationalization |
| `tailwindcss` | ^4.0.0 | Utility CSS |
| `clsx` + `tailwind-merge` | — | Conditional classes |
| `lucide-react` | ^0.400.0 | Icons |
| `class-variance-authority` | ^0.7.0 | Component variants |

## Project Structure

```
src/
  app/
    (auth)/               # Auth route group
      login/              # /login
      register/           # /register
      forgot-password/    # /forgot-password
      layout.tsx
    (public)/             # Public route group
      layout.tsx
    about/                # /about
    admin/                # /admin (old redirect)
    admin-login/          # /admin-login
    blog/                 # /blog
    categories/           # /categories/[...slug]
    companies/            # /companies
    contact/              # /contact
    contracts/            # /contracts
    dashboard/            # /dashboard (user dashboard)
    faq/                  # /faq
    freelancers/          # /freelancers
    help/                 # /help
    messages/             # /messages
    post-project/         # /post-project
    privacy/              # /privacy
    profile/              # /profile
    projects/             # /projects
    proposals/            # /proposals
    ratings/              # /ratings
    settings/             # /settings
    subscriptions/        # /subscriptions
    terms/                # /terms
    globals.css           # Global styles (Tailwind)
    layout.tsx            # Root layout (RTL)
    page.tsx              # Homepage
    error.tsx             # Error boundary
    not-found.tsx         # 404 page
  components/
    forms/                # Form components
    layout/               # Header, Footer, Sidebar
    shared/               # Shared components (e.g., SkillSuggest)
    ui/                   # UI primitives
    providers.tsx         # React context providers
  hooks/                  # Custom React hooks
  i18n/                   # Internationalization config
  lib/
    api/
      client.ts           # Axios instance with interceptors
      endpoints.ts        # API endpoint functions
      admin-client.ts     # Admin API client
      admin-endpoints.ts  # Admin endpoints
    store/
      auth-store.ts       # Zustand auth store
      admin-auth-store.ts # Zustand admin auth store
    utils.ts              # Utility functions
    validations/          # Zod schemas
  types/                  # TypeScript types
  middleware.ts           # Next.js middleware
public/                   # Static assets
```

## Routing Architecture

The app uses the Next.js App Router with Arabic-first RTL layout:

```
/                          → Homepage (RTL, Arabic)
/login                     → User login
/register                  → User registration
/projects                  → Browse projects
/projects/[id]             → Project details
/freelancers               → Browse freelancers
/freelancers/[id]          → Freelancer profile
/companies                 → Browse clients
/companies/[id]            → Client profile
/dashboard                 → User dashboard
/contracts                 → My contracts
/contracts/[id]            → Contract details
/messages                  → Inbox
/messages/[userId]         → Chat conversation
/proposals                 → My proposals
/profile                   → My profile
/settings                  → Account settings
/subscriptions             → Subscription plans
/post-project              → Create project
/categories/[slug]         → Category listing
/blog                      → Blog articles
/blog/[slug]               → Blog article
/faq                       → FAQ
/contact                   → Contact us
/about                     → About us
/privacy                   → Privacy policy
/terms                     → Terms of service
/help                      → Help center
/ratings                   → My ratings
/admin-login               → Admin login
/admin                     → Admin dashboard
```

All paths are accessibile in Arabic. The root layout enforces `lang="ar"` and `dir="rtl"`.

## State Management

### Zustand Stores

**`useAuthStore`** (src/lib/store/auth-store.ts):
- `user`, `isAuthenticated`, `isLoading`
- `login()`, `register()`, `logout()`, `checkAuth()`

**`useAdminAuthStore`** (src/lib/store/admin-auth-store.ts):
- `admin`, `isAuthenticated`, `isLoading`
- `login()`, `logout()`, `checkAuth()`, `hasPermission()`

Server state (projects, proposals, etc.) is managed by **TanStack React Query**.

## API Client Setup

An Axios instance (`src/lib/api/client.ts`) with:

- **Base URL:** `http://localhost:4000/api/v1` (from `NEXT_PUBLIC_API_URL`)
- **Request interceptor:** Attaches `Bearer` token and `Accept-Language: ar`
- **Response interceptor:** Auto-refreshes token on 401, retries original request, redirects to `/login` on failure

```typescript
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — adds auth token + Arabic locale
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  config.headers['Accept-Language'] = 'ar';
  return config;
});

// Response interceptor — handles 401 token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      // attempt token refresh, retry, or redirect to login
    }
    return Promise.reject(error);
  },
);
```

**See:** [AUTHENTICATION.md](./AUTHENTICATION.md) for the full auth flow.

## Authentication Flow

1. User submits credentials to `/auth/login`
2. Server returns `{ accessToken, refreshToken, user }`
3. Tokens stored in `localStorage`
4. `useAuthStore.login()` updates state
5. Subsequent API calls include `Authorization: Bearer <accessToken>`
6. On 401, interceptor calls `/auth/refresh` with refresh token
7. If refresh fails, user is redirected to `/login`

On app load, `useAuthStore.checkAuth()` checks for existing token and validates it via `/users/me`.

## Styling Approach

- **Tailwind CSS v4** with the Cairo font (Arabic-optimized)
- Design tokens managed via CSS variables in `globals.css`
- `class-variance-authority` for component variants
- `tailwind-merge` + `clsx` for conditional class merging
- Layout is RTL by default (`dir="rtl"`)

## Internationalization

- **Default locale:** Arabic (`ar`) with RTL layout
- `next-intl` for message translation infrastructure
- `Accept-Language` header sent with every API request
- Database stores Arabic text in dedicated fields (e.g., `titleAr`, `nameAr`, `contentAr`)
- Cairo font for Arabic text with Latin subset for mixed content

## Key Pages

| Route | Description | Auth Required |
|-------|-------------|:---:|
| `/` | Landing page with stats | No |
| `/projects` | Browse/search projects | No |
| `/projects/[id]` | Project details | No |
| `/freelancers` | Browse freelancers | No |
| `/freelancers/[id]` | Freelancer profile | No |
| `/login` | User login | No |
| `/register` | User registration | No |
| `/dashboard` | User dashboard | Yes |
| `/messages` | Chat inbox | Yes |
| `/messages/[id]` | Chat conversation | Yes |
| `/contracts` | My contracts | Yes |
| `/contracts/[id]` | Contract details | Yes |
| `/proposals` | My proposals | Yes |
| `/post-project` | Create project | CLIENT |
| `/settings` | Account settings | Yes |
| `/profile` | Edit profile | Yes |
| `/admin-login` | Admin login | No |
| `/admin` | Admin dashboard | ADMIN |

**See:** [API_OVERVIEW.md](./API_OVERVIEW.md) for backend API reference.
