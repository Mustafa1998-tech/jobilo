# UI Guidelines

> **Version:** 1.0 | **Last Updated:** 2026-07-06 | **Applies to:** Frontend Application

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Layout System](#layout-system)
3. [Component Library Usage](#component-library-usage)
4. [RTL Layout Rules](#rtl-layout-rules)
5. [Loading States Pattern](#loading-states-pattern)
6. [Empty States Pattern](#empty-states-pattern)
7. [Error States Pattern](#error-states-pattern)
8. [Toast/Notification Pattern](#toastnotification-pattern)
9. [Modal Pattern](#modal-pattern)

---

## Design Philosophy

Jobilo follows a **professional light SaaS** design philosophy. The interface is clean, functional, and business-oriented.

### Core Tenets

| Tenet | Description |
|-------|-------------|
| **Clarity** | Every UI element serves a clear purpose. No decorative fluff. |
| **Efficiency** | Minimize clicks. Optimize for busy professionals. |
| **Consistency** | Uniform patterns across all sections. |
| **Accessibility** | WCAG 2.1 AA compliant by default. |
| **Light Theme Only** | No dark mode or AI-themed aesthetics. Backgrounds use white (`#FFFFFF`) and gray-50 (`#F9FAFB`). |

### Visual Tone

- Minimal use of color — reserved for interactive elements and status indicators
- Generous whitespace for readability
- Subtle borders (`border-gray-200`) rather than heavy shadows
- Professional, not playful

---

## Layout System

### Container Max-Width

| Context | Max-Width | Tailwind Class |
|---------|-----------|----------------|
| Public pages | 1280px | `max-w-7xl` |
| Auth pages | 448px | `max-w-md` |
| Dashboard (full) | 1440px | `max-w-[90rem]` |
| Modal content | 512px (sm), 672px (md), 896px (lg) | inline `max-w-*` |
| Sidebar | 280px | `w-72` |

### Grid System

Use Tailwind's grid utilities. Do not introduce a separate grid framework.

```tsx
// Three-column responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

### Spacing Scale

Based on 4px increments mapped to Tailwind's spacing scale:

| Token | Pixels | Tailwind | Usage |
|-------|--------|----------|-------|
| space-1 | 4px | `p-1` | Tight icon padding |
| space-2 | 8px | `p-2` | Compact elements |
| space-3 | 12px | `p-3` | Small gaps |
| space-4 | 16px | `p-4` | Default padding |
| space-6 | 24px | `p-6` | Card padding |
| space-8 | 32px | `p-8` | Section padding |
| space-12 | 48px | `p-12` | Page sections |
| space-16 | 64px | `p-16` | Large page sections |

> See [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md#spacing-system) for complete spacing details.

---

## Component Library Usage

### Policy

- **Custom components** built with Tailwind CSS — no heavy UI library (no Material UI, Ant Design, Chakra)
- Components live in `frontend/src/components/ui/`
- Each component is a standalone `.tsx` file with TypeScript props
- Reuse existing components before building new ones

### Component Categories

| Category | Examples | Location |
|----------|----------|----------|
| Layout | Container, Grid, Flex, Stack | `components/ui/layout/` |
| Navigation | Navbar, Sidebar, Tabs, Breadcrumbs | `components/ui/navigation/` |
| Forms | Input, Select, Textarea, Checkbox, Switch | `components/ui/forms/` |
| Data Display | Table, Card, Badge, Avatar, Progress | `components/ui/data/` |
| Feedback | Alert, Toast, Modal, Tooltip | `components/ui/feedback/` |
| Overlay | Dropdown, Dialog, Sheet | `components/ui/overlay/` |

> See [COMPONENTS.md](./COMPONENTS.md) for the full component API reference.

### Import Convention

```tsx
import { Button } from '@/components/ui/forms/Button'
import { Card } from '@/components/ui/data/Card'
import { Toast } from '@/components/ui/feedback/Toast'
```

---

## RTL Layout Rules

Jobilo supports Arabic (RTL) and English (LTR). All components must handle both directions.

### Implementation

Use Tailwind's `rtl:` and `ltr:` modifiers:

```tsx
<div className="flex gap-2 rtl:space-x-reverse">
  <span className="ml-2 rtl:mr-2 rtl:ml-0">Text</span>
</div>
```

### Key Rules

| Rule | LTR | RTL |
|------|-----|-----|
| Text alignment | `text-left` | `text-right` |
| Icon before text | `mr-2` | `ml-2` |
| Chevron in dropdown | `ml-auto` | `mr-auto` |
| Back button | `left-4` | `right-4` |
| Sidebar position | `left-0` | `right-0` |
| Padding start | `pl-*` | `pr-*` |
| Margin end | `mr-*` | `ml-*` |

### Directional Icons

- `ChevronLeft` → `ChevronRight` when direction flips
- Arrow icons should use `dir` attribute to auto-flip
- Use `MirroredIcon` wrapper for icons that must flip

> See [TYPOGRAPHY.md](./TYPOGRAPHY.md#rtl-specific-typography-considerations) for RTL typography.

---

## Loading States Pattern

### When to Show

| Scenario | Pattern | Duration Threshold |
|----------|---------|-------------------|
| Page navigation | Top progress bar + skeleton | > 300ms |
| Data fetch (list) | Skeleton rows | > 300ms |
| Data fetch (detail) | Skeleton block | > 300ms |
| Form submission | Button spinner + disabled | Immediate |
| File upload | Progress bar with percentage | Immediate |
| Initial app load | Full-page spinner | > 1s |

### Skeleton Component

```tsx
// Before data loads, show skeleton
{isLoading ? (
  <Skeleton className="h-10 w-full rounded-md" count={5} />
) : (
  <DataTable data={items} columns={columns} />
)}
```

### Button Loading

```tsx
<Button isLoading={isSubmitting} disabled={isSubmitting}>
  {isSubmitting ? 'Saving...' : 'Save Changes'}
</Button>
```

> See [COMPONENTS.md](./COMPONENTS.md#skeleton) for Skeleton component API.

---

## Empty States Pattern

### When to Show

When a list, search result, or data view has zero items after loading completes.

### Empty State Structure

```
┌─────────────────────────────┐
│       [Illustration]         │
│                              │
│   No projects yet            │
│   Create your first project  │
│   to get started.            │
│                              │
│   [Create Project]           │
└─────────────────────────────┘
```

### Implementation

```tsx
<EmptyState
  icon={FolderOpen}
  title="No projects yet"
  description="Create your first project to get started with Jobilo."
  action={<Button onClick={handleCreate}>Create Project</Button>}
/>
```

### Empty State Variants

| Context | Title | Action |
|---------|-------|--------|
| Projects | No projects yet | Create Project |
| Proposals | No proposals received | Share your project |
| Messages | No conversations | Browse projects |
| Notifications | All caught up! | — |
| Search results | No results found | Clear filters |
| Saved items | No saved items | Browse |

> See [COMPONENTS.md](./COMPONENTS.md#card) for the EmptyState component.

---

## Error States Pattern

### When to Show

When an API call fails, a component crashes, or data cannot be rendered.

### Error State Structure

```
┌─────────────────────────────┐
│       [Warning Icon]         │
│                              │
│   Something went wrong       │
│   We couldn't load your      │
│   projects. Please try again.│
│                              │
│   [Try Again]  [Contact Support]│
└─────────────────────────────┘
```

### Implementation

```tsx
{isError ? (
  <ErrorState
    title="Failed to load projects"
    message={error?.message || 'An unexpected error occurred.'}
    onRetry={() => refetch()}
  />
) : (
  <ProjectList data={data} />
)}
```

### Error Boundaries

Wrap page sections in error boundaries:

```tsx
<ErrorBoundary fallback={<ErrorState />}>
  <ProjectDashboard />
</ErrorBoundary>
```

> See [ERROR_CODES.md](./ERROR_CODES.md) for backend error code reference.

---

## Toast/Notification Pattern

### Toast Types

| Type | Color | Icon | Auto-dismiss |
|------|-------|------|-------------|
| Success | green | CheckCircle | 4s |
| Error | red | XCircle | 8s |
| Warning | amber | AlertTriangle | 6s |
| Info | blue | Info | 5s |

### Implementation

```tsx
import { useToast } from '@/hooks/useToast'

const { showToast } = useToast()

showToast({
  type: 'success',
  title: 'Project created',
  description: 'Your project has been published successfully.',
})
```

### Toast Position

- Default: **top-right** (LTR), **top-left** (RTL)
- Stack limit: 5 visible toasts maximum
- Newest appears at the top of stack

> See [COMPONENTS.md](./COMPONENTS.md#toast) for Toast component API.

---

## Modal Pattern

### Modal Types

| Type | Width | Close on Overlay | Use Case |
|------|-------|-----------------|----------|
| Dialog | sm (512px) | Yes | Confirmation, short forms |
| Panel | md (672px) | Yes | Medium-length forms |
| Sheet | lg+ (896px) | No | Complex settings, previews |
| Alert | sm (400px) | No | Critical confirmations |

### Implementation

```tsx
const [isOpen, setIsOpen] = useState(false)

<Modal open={isOpen} onClose={() => setIsOpen(false)} title="Delete Project">
  <Modal.Body>
    <p>Are you sure you want to delete this project? This action cannot be undone.</p>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
    <Button variant="danger" onClick={handleDelete}>Delete</Button>
  </Modal.Footer>
</Modal>
```

### Modal Rules

- Always provide a close button (X) in the header
- Pressing `Escape` closes the modal (with optional `onClose` callback)
- Footer actions: cancel on the left, primary action on the right (LTR)
- First focusable element receives focus on open
- Focus is trapped inside modal while open
- Body scroll is locked when modal is open

> See [COMPONENTS.md](./COMPONENTS.md#modal) for Modal component API.

---

## Cross-References

| Document | Link |
|----------|------|
| Design System | [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) |
| Color Palette | [COLORS.md](./COLORS.md) |
| Typography | [TYPOGRAPHY.md](./TYPOGRAPHY.md) |
| Components | [COMPONENTS.md](./COMPONENTS.md) |
| Accessibility | [ACCESSIBILITY.md](./ACCESSIBILITY.md) |
| Responsive Design | [RESPONSIVE.md](./RESPONSIVE.md) |
| Forms | [FORMS.md](./FORMS.md) |
| Error Codes | [ERROR_CODES.md](./ERROR_CODES.md) |
