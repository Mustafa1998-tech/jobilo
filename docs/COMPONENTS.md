# Component Library

> **Version:** 1.0 | **Last Updated:** 2026-07-06 | **Applies to:** Frontend Application
> **Location:** `frontend/src/components/ui/`

## Table of Contents

1. [Layout Components](#layout-components)
2. [Navigation Components](#navigation-components)
3. [Form Components](#form-components)
4. [Data Display](#data-display)
5. [Feedback](#feedback)
6. [Overlay](#overlay)

---

## Layout Components

### Container

Wrapper that centers content with max-width constraints.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | required | Content to wrap |
| size | `'sm'` `'md'` `'lg'` `'xl'` `'full'` | `'xl'` | Max-width preset |
| className | string | `''` | Additional classes |
| as | `'div'` `'section'` `'main'` | `'div'` | HTML element |

```tsx
// Usage
<Container size="xl" as="main">
  <PageContent />
</Container>
```

| size | Max-Width |
|------|-----------|
| sm | 640px |
| md | 768px |
| lg | 1024px |
| xl | 1280px |
| full | 100% |

### Grid

Responsive grid layout.

| Prop | Type | Default |
|------|------|---------|
| cols | `1` `2` `3` `4` `6` `12` | `1` |
| gap | spacing token | `6` |
| responsive | `{[breakpoint]: cols}` | `{}` |

```tsx
<Grid cols={1} gap={6} responsive={{ md: 2, lg: 3 }}>
  {items.map(item => <Card key={item.id} />)}
</Grid>
```

### Flex

Flexbox layout component.

| Prop | Type | Default |
|------|------|---------|
| direction | `'row'` `'col'` | `'row'` |
| align | `'start'` `'center'` `'end'` `'stretch'` | `'start'` |
| justify | `'start'` `'center'` `'end'` `'between'` | `'start'` |
| gap | spacing token | `4` |
| wrap | boolean | `false` |

```tsx
<Flex align="center" justify="between" gap={4}>
  <Title>Projects</Title>
  <Button>Create</Button>
</Flex>
```

### Stack

Vertical or horizontal stack with consistent spacing.

| Prop | Type | Default |
|------|------|---------|
| spacing | spacing token | `4` |
| direction | `'vertical'` `'horizontal'` | `'vertical'` |
| divider | boolean | `false` |

```tsx
<Stack spacing={6}>
  <SectionHeader />
  <SectionContent />
  <SectionFooter />
</Stack>
```

---

## Navigation Components

### Navbar

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| logo | ReactNode | required | Brand logo/name |
| links | NavLink[] | `[]` | Navigation items |
| actions | ReactNode | — | Right-side actions (LTR) |
| mobileMenuOpen | boolean | `false` | Mobile menu state |
| onMobileMenuToggle | function | — | Toggle handler |
| variant | `'public'` `'app'` | `'public'` | Styling variant |

**States:**
| State | Behavior |
|-------|----------|
| Default | Solid background, full width |
| Scrolled | Adds `shadow-sm` on scroll past 50px |
| Mobile | Hamburger menu, full-screen overlay |
| Active link | `text-blue-600 border-b-2 border-blue-600` |

### Sidebar

| Prop | Type | Default |
|------|------|---------|
| items | SidebarItem[] | required |
| collapsed | boolean | `false` |
| onCollapse | function | — |
| footer | ReactNode | — |

```tsx
<Sidebar
  items={navItems}
  collapsed={isCollapsed}
  onCollapse={setIsCollapsed}
  footer={<UserMenu />}
/>
```

### Tabs

| Prop | Type | Default |
|------|------|---------|
| tabs | Tab[] | required |
| activeTab | string | — |
| onChange | function | required |
| variant | `'underline'` `'pills'` | `'underline'` |
| fullWidth | boolean | `false` |

### Breadcrumbs

```tsx
<Breadcrumbs
  items={[
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Projects', href: '/dashboard/projects' },
    { label: 'Project Details', href: undefined, current: true },
  ]}
/>
```

| Prop | Type | Default |
|------|------|---------|
| items | BreadcrumbItem[] | required |
| separator | `'/'` `'>'` `'—'` | `'/'` |

---

## Form Components

### Button

| Prop | Type | Default | Options |
|------|------|---------|---------|
| variant | string | `'primary'` | `'primary'` `'secondary'` `'danger'` `'ghost'` `'link'` |
| size | string | `'md'` | `'sm'` `'md'` `'lg'` |
| isLoading | boolean | `false` | Shows spinner |
| disabled | boolean | `false` | — |
| fullWidth | boolean | `false` | — |
| leftIcon | ReactNode | — | Icon before text |
| rightIcon | ReactNode | — | Icon after text |
| type | `'button'` `'submit'` `'reset'` | `'button'` | — |

**Size variants:**
| Size | Height | Padding | Font | Icon Size |
|------|--------|---------|------|-----------|
| sm | 32px (h-8) | px-3 py-1.5 | text-sm | 14px |
| md | 40px (h-10) | px-4 py-2 | text-sm | 16px |
| lg | 48px (h-12) | px-6 py-3 | text-base | 18px |

**State table:**
| Variant | Default | Hover | Active | Disabled |
|---------|---------|-------|--------|----------|
| primary | bg-blue-600 text-white | bg-blue-700 | bg-blue-800 | bg-gray-300 text-gray-500 |
| secondary | bg-white text-gray-700 border | bg-gray-50 | bg-gray-100 | bg-gray-100 text-gray-400 |
| danger | bg-red-600 text-white | bg-red-700 | bg-red-800 | bg-gray-300 text-gray-500 |
| ghost | bg-transparent text-gray-600 | bg-gray-100 | bg-gray-200 | text-gray-400 |
| link | bg-transparent text-blue-600 | text-blue-700 underline | text-blue-800 | text-gray-400 |

```tsx
<Button variant="primary" size="md" isLoading={saving} onClick={handleSave}>
  Save Changes
</Button>
```

### Input

| Prop | Type | Default |
|------|------|---------|
| label | string | — |
| placeholder | string | — |
| error | string | — |
| hint | string | — |
| leftIcon | ReactNode | — |
| rightIcon | ReactNode | — |
| fullWidth | boolean | `true` |
| disabled | boolean | `false` |
| required | boolean | `false` |
| dir | `'ltr'` `'rtl'` `'auto'` | — |

**State table:**
| State | Border | Background | Text |
|-------|--------|-----------|------|
| Default | gray-300 | white | gray-900 |
| Focus | blue-500 + ring | white | gray-900 |
| Error | red-500 + ring | white | gray-900 |
| Disabled | gray-200 | gray-100 | gray-400 |
| Filled | gray-300 | white | gray-900 |

```tsx
<Input
  label="Project Title"
  placeholder="Enter project title"
  error={errors.title}
  leftIcon={Search}
  required
/>
```

### Select

| Prop | Type | Default |
|------|------|---------|
| label | string | — |
| options | {value, label}[] | required |
| placeholder | string | — |
| error | string | — |
| disabled | boolean | `false` |
| clearable | boolean | `false` |
| searchable | boolean | `false` |

### Textarea

| Prop | Type | Default |
|------|------|---------|
| rows | number | `3` |
| maxLength | number | — |
| showCount | boolean | `false` |
| resizable | boolean | `true` |

### Checkbox

| Prop | Type | Default |
|------|------|---------|
| checked | boolean | `false` |
| indeterminate | boolean | `false` |
| label | string | — |
| disabled | boolean | `false` |

### Radio

```tsx
<Radio.Group name="experience" value={selected} onChange={setSelected}>
  <Radio value="beginner" label="Beginner" />
  <Radio value="intermediate" label="Intermediate" />
  <Radio value="expert" label="Expert" />
</Radio.Group>
```

### Switch

| State | Track | Thumb |
|-------|-------|-------|
| Off (default) | gray-200 | white |
| On | blue-600 | white |
| Disabled off | gray-100 | gray-300 |
| Disabled on | blue-300 | white |

### DatePicker

- Uses `react-day-picker` internally
- Supports RTL calendar layout
- Min/max date constraints
- Range selection mode for date filters

> See [FORMS.md](./FORMS.md) for form validation and submission patterns.

---

## Data Display

### Table

| Prop | Type | Default |
|------|------|---------|
| columns | Column[] | required |
| data | T[] | required |
| loading | boolean | `false` |
| emptyMessage | string | `'No data found'` |
| sortable | boolean | `false` |
| onSort | function | — |
| pagination | PaginationConfig | — |
| rowClick | function | — |
| selectable | boolean | `false` |
| onSelect | function | — |

```tsx
<Table
  columns={[
    { key: 'name', header: 'Project Name', sortable: true },
    { key: 'status', header: 'Status', render: (val) => <StatusBadge status={val} /> },
    { key: 'budget', header: 'Budget', align: 'right' },
  ]}
  data={projects}
  loading={isLoading}
  pagination={{ page: 1, total: 50, pageSize: 10 }}
  onSort={handleSort}
/>
```

### Card

| Prop | Type | Default |
|------|------|---------|
| children | ReactNode | required |
| title | string | — |
| subtitle | string | — |
| actions | ReactNode | — |
| padding | spacing token | `6` |
| hoverable | boolean | `false` |
| onClick | function | — |

```tsx
<Card title="Project Overview" subtitle="Last updated 2 hours ago" actions={<Button>Edit</Button>}>
  <CardContent />
</Card>
```

### Badge

| Prop | Type | Default |
|------|------|---------|
| variant | `'success'` `'warning'` `'error'` `'info'` `'neutral'` | `'neutral'` |
| size | `'sm'` `'md'` | `'md'` |
| dot | boolean | `false` |
| removable | boolean | `false` |
| onRemove | function | — |

**Variant colors:**
| Variant | BG | Text | Border |
|---------|----|------|--------|
| success | green-50 | green-700 | green-200 |
| warning | amber-50 | amber-700 | amber-200 |
| error | red-50 | red-700 | red-200 |
| info | blue-50 | blue-700 | blue-200 |
| neutral | gray-100 | gray-700 | gray-200 |

### Avatar

| Prop | Type | Default |
|------|------|---------|
| src | string | — |
| alt | string | — |
| name | string | required (fallback) |
| size | `'sm'` `'md'` `'lg'` `'xl'` | `'md'` |
| status | `'online'` `'offline'` `'away'` | — |

**Size mapping:**
| Size | Pixel | Tailwind |
|------|-------|----------|
| sm | 32px | `w-8 h-8` |
| md | 40px | `w-10 h-10` |
| lg | 48px | `w-12 h-12` |
| xl | 64px | `w-16 h-16` |

### Progress

| Prop | Type | Default |
|------|------|---------|
| value | number (0–100) | `0` |
| variant | `'default'` `'success'` `'warning'` | `'default'` |
| size | `'sm'` `'md'` `'lg'` | `'md'` |
| showLabel | boolean | `false` |
| animated | boolean | `false` |

### Skeleton

| Prop | Type | Default |
|------|------|---------|
| width | string `|` number | `'100%'` |
| height | string `|` number | `'1rem'` |
| count | number | `1` |
| variant | `'text'` `'circular'` `'rectangular'` | `'text'` |
| className | string | — |

```tsx
// Table skeleton
<Stack spacing={4}>
  {Array.from({ length: 5 }).map((_, i) => (
    <Skeleton key={i} height="3rem" variant="rectangular" className="rounded-md" />
  ))}
</Stack>
```

---

## Feedback

### Alert

| Prop | Type | Default |
|------|------|---------|
| variant | `'info'` `'success'` `'warning'` `'error'` | `'info'` |
| title | string | — |
| message | string | — |
| dismissible | boolean | `false` |
| onDismiss | function | — |
| action | ReactNode | — |

```tsx
<Alert variant="warning" title="Profile incomplete" dismissible>
  Complete your profile to increase your chances of getting hired.
  <Alert.Action>
    <Button variant="link" size="sm">Complete Profile</Button>
  </Alert.Action>
</Alert>
```

### Toast

See [UI_GUIDELINES.md](./UI_GUIDELINES.md#toastnotification-pattern) for full pattern.

| Prop | Type | Default |
|------|------|---------|
| type | `'success'` `'error'` `'warning'` `'info'` | `'info'` |
| title | string | — |
| description | string | — |
| duration | number (ms) | varies by type |
| onDismiss | function | — |
| action | ReactNode | — |

```tsx
import { useToast } from '@/hooks/useToast'

const { showToast } = useToast()
showToast({ type: 'success', title: 'Saved', description: 'Changes saved successfully.' })
```

### Modal

See [UI_GUIDELINES.md](./UI_GUIDELINES.md#modal-pattern) for full pattern.

| Prop | Type | Default |
|------|------|---------|
| open | boolean | required |
| onClose | function | required |
| title | string | — |
| size | `'sm'` `'md'` `'lg'` `'xl'` `'full'` | `'md'` |
| closeOnOverlay | boolean | `true` |
| closeOnEsc | boolean | `true` |
| showCloseButton | boolean | `true` |

### Drawer

| Prop | Type | Default |
|------|------|---------|
| open | boolean | required |
| onClose | function | required |
| title | string | — |
| position | `'left'` `'right'` | `'right'` |
| size | `'sm'` `'md'` `'lg'` | `'md'` |

### Tooltip

| Prop | Type | Default |
|------|------|---------|
| content | string `|` ReactNode | required |
| position | `'top'` `'bottom'` `'left'` `'right'` | `'top'` |
| delay | number (ms) | `200` |
| disabled | boolean | `false` |

### Popover

| Prop | Type | Default |
|------|------|---------|
| content | ReactNode | required |
| trigger | `'click'` `'hover'` | `'click'` |
| position | `'top'` `'bottom'` `'left'` `'right'` | `'bottom'` |
| align | `'start'` `'center'` `'end'` | `'center'` |

---

## Overlay

### Dropdown

| Prop | Type | Default |
|------|------|---------|
| trigger | ReactNode | required |
| items | DropdownItem[] | required |
| align | `'start'` `'end'` | `'end'` |
| width | string | `'auto'` |

```tsx
<Dropdown
  trigger={<Button variant="ghost">Actions</Button>}
  items={[
    { label: 'Edit', icon: Edit, onClick: handleEdit },
    { label: 'Delete', icon: Trash, onClick: handleDelete, variant: 'danger' },
    { type: 'divider' },
    { label: 'View details', onClick: handleView },
  ]}
  align="end"
/>
```

### Dialog

Confirmation dialog built on top of Modal with pre-configured actions.

| Prop | Type | Default |
|------|------|---------|
| open | boolean | required |
| onConfirm | function | required |
| onCancel | function | required |
| title | string | required |
| message | string | required |
| confirmText | string | `'Confirm'` |
| cancelText | string | `'Cancel'` |
| variant | `'default'` `'danger'` | `'default'` |
| isLoading | boolean | `false` |

```tsx
<Dialog
  open={showDeleteDialog}
  onConfirm={handleDeleteConfirm}
  onCancel={() => setShowDeleteDialog(false)}
  title="Delete Project"
  message="Are you sure you want to delete this project? This action cannot be undone."
  variant="danger"
  confirmText="Delete"
/>
```

### Sheet

Side panel for complex forms and settings.

| Prop | Type | Default |
|------|------|---------|
| open | boolean | required |
| onClose | function | required |
| title | string | — |
| size | `'sm'` `'md'` `'lg'` `'xl'` | `'md'` |
| position | `'left'` `'right'` | `'right'` |

---

## Cross-References

| Document | Link |
|----------|------|
| UI Guidelines | [UI_GUIDELINES.md](./UI_GUIDELINES.md) |
| Design System | [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) |
| Colors | [COLORS.md](./COLORS.md) |
| Forms | [FORMS.md](./FORMS.md) |
| Responsive | [RESPONSIVE.md](./RESPONSIVE.md) |
