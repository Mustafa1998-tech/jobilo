# State Management

> **Version:** 1.0 | **Last Updated:** 2026-07-06 | **Applies to:** Frontend Application (`frontend/`)

## Table of Contents

1. [Overview](#overview)
2. [Zustand Stores](#zustand-stores)
3. [React Query for Server State](#react-query-for-server-state)
4. [Local State vs Global State Guidelines](#local-state-vs-global-state-guidelines)
5. [Store Structure and Patterns](#store-structure-and-patterns)
6. [Persistence Strategy](#persistence-strategy)
7. [Store Hydration](#store-hydration)
8. [Store Testing Approach](#store-testing-approach)

---

## Overview

Jobilo uses a **dual state management approach**:

| State Type | Tool | When to Use |
|-----------|------|-------------|
| Server state | React Query (TanStack Query) | Data from API (projects, users, messages) |
| Global client state | Zustand | Auth, preferences, UI state |
| Local state | React `useState` / `useReducer` | Component-specific, form state |
| URL state | Next.js `useSearchParams` | Filters, pagination, search queries |
| Form state | React Hook Form | Complex form data and validation |

### Decision Flow

```
Is the data from the server?
  ├── Yes → React Query (useQuery / useMutation)
  └── No  → Is it needed globally across the app?
              ├── Yes → Zustand store
              └── No  → React useState / useReducer
```

---

## Zustand Stores

### Store Locations

```
frontend/src/store/
├── auth-store.ts           # User authentication state
├── admin-auth-store.ts     # Admin authentication + permissions
├── ui-store.ts             # Sidebar state, theme, modals
├── preferences-store.ts    # User preferences, language, notifications
└── index.ts                # Re-export all stores
```

### Auth Store (`auth-store.ts`)

```tsx
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials) => {
        set({ isLoading: true })
        try {
          const response = await authApi.login(credentials)
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
        // Clear React Query cache on logout
        queryClient.clear()
      },

      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
```

### Admin Auth Store (`admin-auth-store.ts`)

```tsx
interface AdminAuthState {
  admin: AdminUser | null
  permissions: Permission[]
  isAdmin: boolean
  role: 'ADMIN' | 'SUPER_ADMIN' | null

  // Actions
  fetchPermissions: () => Promise<void>
  hasPermission: (module: string, action: string) => boolean
  hasRole: (roles: string[]) => boolean
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set, get) => ({
      admin: null,
      permissions: [],
      isAdmin: false,
      role: null,

      fetchPermissions: async () => {
        const permissions = await adminApi.getPermissions()
        set({ permissions })
      },

      hasPermission: (module, action) => {
        const { permissions, role } = get()
        if (role === 'SUPER_ADMIN') return true // Super admin has all permissions
        return permissions.some(
          (p) => p.module === module && p.actions.includes(action)
        )
      },

      hasRole: (roles) => {
        const { role } = get()
        return roles.includes(role || '')
      },
    }),
    {
      name: 'admin-auth-storage',
      partialize: (state) => ({
        admin: state.admin,
        permissions: state.permissions,
        isAdmin: state.isAdmin,
        role: state.role,
      }),
    }
  )
)
```

### UI Store (`ui-store.ts`)

```tsx
interface UIState {
  sidebarOpen: boolean
  sidebarCollapsed: boolean
  activeModal: string | null
  activeToast: Toast | null

  toggleSidebar: () => void
  toggleSidebarCollapse: () => void
  openModal: (id: string) => void
  closeModal: () => void
  showToast: (toast: Toast) => void
  dismissToast: () => void
}

export const useUIStore = create<UIState>()((set) => ({
  sidebarOpen: true,
  sidebarCollapsed: false,
  activeModal: null,
  activeToast: null,

  // Actions
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  toggleSidebarCollapse: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  openModal: (id) => set({ activeModal: id }),
  closeModal: () => set({ activeModal: null }),
  showToast: (toast) => set({ activeToast: toast }),
  dismissToast: () => set({ activeToast: null }),
}))
```

---

## React Query for Server State

### Query Configuration

```tsx
// QueryClient configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,     // 5 minutes
      gcTime: 30 * 60 * 1000,        // 30 minutes (formerly cacheTime)
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
})
```

### Query Patterns

```tsx
// Data fetching hooks pattern
// hooks/useProjects.ts
export function useProjects(filters?: ProjectFilters) {
  return useQuery({
    queryKey: ['projects', filters],
    queryFn: () => projectsApi.getProjects(filters),
    placeholderData: keepPreviousData, // Keep previous data while fetching next page
  })
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => projectsApi.getProject(id),
    enabled: !!id,
  })
}
```

### Mutation Patterns

```tsx
export function useCreateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateProjectDTO) => projectsApi.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
      showToast({ type: 'success', title: 'Project created' })
    },
    onError: (error) => {
      showToast({ type: 'error', title: 'Failed to create project', description: error.message })
    },
  })
}
```

### Query Keys Convention

```
['resource']             → List all
['resource', id]         → Get single
['resource', 'my']       → Current user's resources
['resource', filters]    → Filtered list
['stats']                → Dashboard stats
['admin', 'resource']    → Admin-specific queries
```

---

## Local State vs Global State Guidelines

### Use Local State (useState) For

- Form input values
- Toggle states (show/hide sections)
- Dropdown open/close
- Selected tab
- Hover states
- Animation states

### Use Zustand (Global) For

- User authentication (`auth-store`)
- User preferences (language, theme)
- Sidebar/collapse state (`ui-store`)
- Active modals (if needed across components)
- Admin permissions (`admin-auth-store`)

### Use React Query For

- All server-fetched data
- Cache invalidation after mutations
- Optimistic updates
- Paginated lists
- Infinite scroll data

### Use URL Search Params For

- Search queries
- Applied filters
- Current page number
- Active tab
- Sort order

---

## Store Structure and Patterns

### Store Template

```tsx
// Template for new Zustand stores
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface StoreState {
  // State
  data: DataType | null
  isLoading: boolean
  error: string | null

  // Actions
  fetch: () => Promise<void>
  reset: () => void
  update: (data: Partial<DataType>) => void
}

const initialState = {
  data: null,
  isLoading: false,
  error: null,
}

export const useStore = create<StoreState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      fetch: async () => {
        set({ isLoading: true, error: null })
        try {
          const data = await api.fetch()
          set({ data, isLoading: false })
        } catch (err) {
          set({ error: (err as Error).message, isLoading: false })
        }
      },

      reset: () => set(initialState),

      update: (partial) => set((state) => ({
        data: state.data ? { ...state.data, ...partial } : null,
      })),
    }),
    { name: 'store-name' }
  )
)
```

### Rules

1. **One concern per store** — don't mix auth with UI state
2. **Actions in the store** — don't create separate action files
3. **Immutability** — use spread operator or Immer middleware
4. **Selectors** — use selectors to prevent unnecessary re-renders
5. **Devtools** — wrap stores in devtools middleware in development

---

## Persistence Strategy

### What Gets Persisted

| Store | Storage | Key | Partialize |
|-------|---------|-----|------------|
| auth-store | localStorage | `auth-storage` | user, token, isAuthenticated |
| admin-auth-store | localStorage | `admin-auth-storage` | admin, permissions, role |
| preferences-store | localStorage | `preferences-storage` | language, notifications |
| ui-store | sessionStorage | `ui-storage` | sidebarCollapsed |

### What Does NOT Get Persisted

- Loading states
- Error states
- Temporary UI state
- Active modals

### Storage Implementation

```tsx
// Custom storage for Zustand persist
const storage = {
  getItem: (name: string) => {
    const item = localStorage.getItem(name)
    if (item) {
      try {
        return JSON.parse(item)
      } catch {
        return null
      }
    }
    return null
  },
  setItem: (name: string, value: unknown) => {
    localStorage.setItem(name, JSON.stringify(value))
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name)
  },
}
```

---

## Store Hydration

### Hydration on App Load

```tsx
// In root layout or providers
'use client'

export function StoreHydrator({ children }: { children: ReactNode }) {
  const { fetchPermissions } = useAdminAuthStore()
  const { user, token } = useAuthStore()
  const { fetchPreferences } = usePreferencesStore()

  useEffect(() => {
    if (user && token) {
      // Hydrate server state
      queryClient.prefetchQuery({
        queryKey: ['user', 'profile'],
        queryFn: () => api.getProfile(),
      })

      // Fetch admin permissions
      if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
        fetchPermissions()
      }

      // Load user preferences
      fetchPreferences()
    }
  }, [user, token])

  return <>{children}</>
}
```

### Loading from Persisted State

Zustand `persist` middleware handles rehydration automatically at app startup. The store will emit a `onRehydrateStorage` event:

```tsx
const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // ... store definition
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            console.error('Failed to rehydrate auth store:', error)
          }
        }
      },
    }
  )
)
```

---

## Store Testing Approach

### Unit Testing Zustand Stores

```tsx
// __tests__/store/auth-store.test.ts
import { renderHook, act } from '@testing-library/react'
import { useAuthStore } from '@/store/auth-store'

describe('AuthStore', () => {
  beforeEach(() => {
    // Reset store before each test
    act(() => {
      useAuthStore.getState().logout()
    })
  })

  it('should initialize with null user', () => {
    const { result } = renderHook(() => useAuthStore())
    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('should set user on login', async () => {
    const { result } = renderHook(() => useAuthStore())

    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'password123',
      })
    })

    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user).toBeDefined()
  })

  it('should clear state on logout', () => {
    const { result } = renderHook(() => useAuthStore())

    act(() => {
      result.current.logout()
    })

    expect(result.current.user).toBeNull()
    expect(result.current.token).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })
})
```

### Testing React Query Hooks

```tsx
// __tests__/hooks/useProjects.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useProjects } from '@/hooks/useProjects'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe('useProjects', () => {
  it('should fetch projects', async () => {
    const { result } = renderHook(() => useProjects({ page: 1 }), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.items).toHaveLength(10)
    expect(result.current.data?.total).toBeGreaterThan(0)
  })
})
```

### Testing Patterns

| Test Type | What to Test |
|-----------|-------------|
| Store initialization | Default state values |
| State mutations | Actions update state correctly |
| Async actions | Loading → success/error state transitions |
| Persistence | State persists and rehydrates correctly |
| Selectors | Memoized selectors return correct values |
| Edge cases | Empty state, error state, concurrent updates |

---

## Cross-References

| Document | Link |
|----------|------|
| Authentication | [AUTHENTICATION.md](../AUTHENTICATION.md) |
| Authorization / RBAC | [RBAC.md](./RBAC.md) |
| Routing | [ROUTING.md](./ROUTING.md) |
| Frontend Overview | [FRONTEND.md](../FRONTEND.md) |
| UI Guidelines | [UI_GUIDELINES.md](./UI_GUIDELINES.md) |
