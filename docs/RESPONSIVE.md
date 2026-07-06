# Responsive Design Guide

> **Version:** 1.0 | **Last Updated:** 2026-07-06 | **Applies to:** Frontend Application (`frontend/`)

## Table of Contents

1. [Breakpoints](#breakpoints)
2. [Mobile-First Approach](#mobile-first-approach)
3. [RTL Responsive Considerations](#rtl-responsive-considerations)
4. [Navigation Patterns per Breakpoint](#navigation-patterns-per-breakpoint)
5. [Data Table Responsive Patterns](#data-table-responsive-patterns)
6. [Form Responsive Patterns](#form-responsive-patterns)
7. [Testing on Devices](#testing-on-devices)

---

## Breakpoints

### Tailwind Breakpoints

| Name | Min-Width | Tailwind Prefix | Primary Target |
|------|-----------|-----------------|----------------|
| sm | 640px | `sm:` | Large phones, small tablets |
| md | 768px | `md:` | Tablets (portrait) |
| lg | 1024px | `lg:` | Small laptops, tablets (landscape) |
| xl | 1280px | `xl:` | Desktops, laptops |
| 2xl | 1536px | `2xl:` | Large desktops, ultrawide |

### Breakpoint Usage

```tsx
// Mobile-first: base style = mobile, sm: = tablet, lg: = desktop
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {items.map(item => <Card key={item.id} />)}
</div>
```

### Content Area Widths

| Breakpoint | Container | Sidebar | Content |
|------------|-----------|---------|---------|
| Default (< 640px) | 100% | Hidden (drawer) | 100% |
| sm (640px) | 100% | Hidden (drawer) | 100% |
| md (768px) | 100% | Overlay | 100% |
| lg (1024px) | 1024px | 280px fixed | Calc(100% - 280px) |
| xl (1280px) | 1280px | 280px fixed | Calc(100% - 280px) |
| 2xl (1536px) | 1440px | 280px fixed | Calc(100% - 280px) |

### Page Padding

```tsx
<div className="px-4 sm:px-6 lg:px-8 py-6">
  {/* Page content */}
</div>
```

---

## Mobile-First Approach

### Core Principle

All styles are written **mobile-first**: base styles target mobile, and breakpoint prefixes override for larger screens.

```css
/* Mobile-first CSS */
.widget {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Tablet+ */
@media (min-width: 768px) {
  .widget {
    flex-direction: row;
    gap: 1.5rem;
  }
}

/* Desktop+ */
@media (min-width: 1024px) {
  .widget {
    gap: 2rem;
  }
}
```

### Responsive Class Convention

| Pattern | Example | Description |
|---------|---------|-------------|
| Stack → Row | `flex-col md:flex-row` | Vertical on mobile, horizontal on desktop |
| Single → Multi-column | `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` | Responsive grid |
| Hidden → Visible | `hidden lg:block` | Show on desktop only |
| Full → Constrained | `w-full md:w-auto` | Full width on mobile |
| Bottom → Side | `fixed bottom-0 md:static` | Mobile bottom sheet to inline |

### Responsive Hiding

```tsx
// Hide on mobile, show on desktop
<Sidebar className="hidden lg:block" />

// Show on mobile, hide on desktop
<MobileMenu className="lg:hidden" />

// Responsive table
<Table className="hidden md:table" />
<CardList className="md:hidden" />
```

---

## RTL Responsive Considerations

### RTL + Responsive

```tsx
// RTL-aware responsive margins
<div className="ml-4 rtl:mr-4 rtl:ml-0 lg:ml-6 lg:rtl:mr-6 lg:rtl:ml-0">
```

### Mobile RTL Layout

| Element | LTR Mobile | RTL Mobile |
|---------|-----------|-----------|
| Hamburger menu | Left side | Right side |
| Search bar | Left side | Right side |
| Back button | Left side | Right side |
| Notification bell | Right side | Left side |
| User avatar | Right side | Left side |

### Responsive Drawer Direction

```tsx
// Sidebar slides from appropriate side based on direction
<Sheet
  open={mobileMenuOpen}
  onClose={() => setMobileMenuOpen(false)}
  position={direction === 'rtl' ? 'right' : 'left'}
>
  <MobileNav />
</Sheet>
```

---

## Navigation Patterns per Breakpoint

### Desktop (lg+)

```
┌──────────┬────────────────────────────────────────────┐
│          │  Topbar: [Search] [Notif] [Avatar ▼]       │
│ Sidebar  ├────────────────────────────────────────────┤
│ 280px    │                                             │
│ fixed    │  Content area (remaining width)             │
│          │                                             │
│          │                                             │
└──────────┴────────────────────────────────────────────┘
```

### Tablet (md: 768px – 1023px)

```
┌──────────────────────────────────────────────────┐
│ Topbar: [Hamburger] [Title] [Search] [Avatar ▼]  │
├──────────────────────────────────────────────────┤
│                                                    │
│  Content area (full width)                         │
│                                                    │
│  [Sidebar appears as overlay when hamburger        │
│   is clicked]                                      │
└──────────────────────────────────────────────────┘
```

### Mobile (< 768px)

```
┌──────────────────────┐
│ [☰] Title    [🔔] [👤]│  ← Topbar
├──────────────────────┤
│                       │
│ Content (full width)  │
│                       │
│                       │
│                       │
├──────────────────────┤
│ [🏠] [🔍] [📋] [💬] [👤]│  ← Bottom nav bar
└──────────────────────┘
```

### Navigation Component Behavior

| Component | Mobile (< 768px) | Tablet (768–1024px) | Desktop (1024px+) |
|-----------|-----------------|-------------------|------------------|
| Sidebar | Hidden (overlay drawer) | Hidden (overlay drawer) | Fixed, always visible |
| Topbar | Simple (hamburger + title) | Search + icons | Full (search + icons + avatar) |
| Bottom nav | Visible (5 tabs) | Hidden | Hidden |
| Breadcrumbs | Hidden | Truncated (last 2) | Full path |
| Sub-navigation | Accordion | Accordion | Inline tabs |

---

## Data Table Responsive Patterns

### Pattern 1: Horizontal Scroll (md+)

```tsx
// Table with horizontal scroll on mobile
<div className="overflow-x-auto -mx-4 sm:-mx-6 lg:mx-0">
  <div className="inline-block min-w-full align-middle">
    <table className="min-w-full">
      {/* Table content */}
    </table>
  </div>
</div>
```

### Pattern 2: Card Layout (mobile)

```tsx
// Convert table rows to cards on mobile
{isMobile ? (
  <Stack spacing={4}>
    {data.map((item) => (
      <Card key={item.id} className="p-4">
        <div className="flex justify-between">
          <span className="font-medium">{item.name}</span>
          <StatusBadge status={item.status} />
        </div>
        <div className="mt-2 text-sm text-gray-500">
          <div>Budget: ${item.budget}</div>
          <div>Deadline: {item.deadline}</div>
        </div>
        <div className="mt-3 flex gap-2">
          <Button size="sm" variant="ghost">View</Button>
          <Button size="sm" variant="ghost">Edit</Button>
        </div>
      </Card>
    ))}
  </Stack>
) : (
  <Table columns={columns} data={data} />
)}
```

### Pattern 3: Responsive Columns

| Breakpoint | Visible Columns |
|------------|----------------|
| < 640px | Name, Status |
| 640px+ | Name, Status, Budget |
| 1024px+ | Name, Status, Budget, Deadline, Proposals |
| 1280px+ | Name, Status, Budget, Deadline, Proposals, Created |

```tsx
const columns = [
  { key: 'name', header: 'Project', always: true },
  { key: 'status', header: 'Status', always: true },
  { key: 'budget', header: 'Budget', hideBelow: 'sm' },
  { key: 'deadline', header: 'Deadline', hideBelow: 'lg' },
  { key: 'proposals', header: 'Proposals', hideBelow: 'xl' },
  { key: 'createdAt', header: 'Created', hideBelow: 'xl' },
]
```

---

## Form Responsive Patterns

### Single Column (mobile) → Multi-Column (desktop)

```tsx
<form className="space-y-6">
  {/* Single field takes full width */}
  <Input label="Project Title" {...} />

  {/* Two fields side by side on tablet+ */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Input label="First Name" {...} />
    <Input label="Last Name" {...} />
  </div>

  {/* Three fields on desktop */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    <Select label="Category" {...} />
    <Select label="Budget Type" {...} />
    <Input label="Budget" type="number" {...} />
  </div>

  {/* Full width textarea */}
  <Textarea label="Description" rows={4} {...} />

  {/* Buttons: stacked on mobile, inline on desktop */}
  <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
    <Button variant="ghost" type="button">Cancel</Button>
    <Button type="submit">Save</Button>
  </div>
</form>
```

### Form Button Placement

| Breakpoint | Button Layout |
|------------|---------------|
| < sm | Full-width, stacked (Cancel above Submit) |
| sm+ | Inline, right-aligned (Cancel left, Submit right) |

### Mobile Form Tips

```tsx
// Increase touch targets on mobile
<Input
  className="h-12 sm:h-10" // Larger height on mobile for touch
  label="Email"
  type="email"
  autoComplete="email"
  inputMode="email" // Mobile keyboard type
/>

<Select
  className="h-12 sm:h-10"
  options={options}
  // Use native select on mobile for better UX
  native={isMobile}
/>
```

---

## Testing on Devices

### Device Matrix

| Category | Devices | Screen Sizes | OS |
|----------|---------|-------------|----|
| Phone (small) | iPhone SE, Galaxy A系列 | 320–375px | iOS, Android |
| Phone (large) | iPhone 15 Pro, Galaxy S24 | 375–430px | iOS, Android |
| Tablet (small) | iPad Mini, Galaxy Tab A | 744–810px | iPadOS, Android |
| Tablet (large) | iPad Pro, Galaxy Tab S | 1024–1366px | iPadOS, Android |
| Laptop | MacBook Air, Dell XPS | 1280–1440px | macOS, Windows |
| Desktop | External monitors | 1440–1920px+ | macOS, Windows |

### Testing Checklist

| Test | Tool/Method |
|------|-------------|
| Layout breaks | Browser DevTools responsive mode on all breakpoints |
| Touch targets (min 44×44px) | Tap all interactive elements |
| Font legibility | Check text at each breakpoint |
| No horizontal scroll | Scroll horizontally — should not exist |
| Images scale correctly | Check images at all widths |
| Forms usable | Fill out forms at 320px width |
| Navigation works | Navigate entire app at 375px |
| RTL layout | Switch to Arabic, check all pages |
| Keyboard appears | Test forms on mobile (focus doesn't hide input) |

### DevTools Testing Commands

```bash
# Test all breakpoints with Playwright
npx playwright test --config=e2e/responsive.config.ts

# Lighthouse mobile audit
npx lighthouse http://localhost:3000 --preset=desktop
npx lighthouse http://localhost:3000 --preset=perf --screenEmulation.mobile=true
```

---

## Cross-References

| Document | Link |
|----------|------|
| UI Guidelines | [UI_GUIDELINES.md](./UI_GUIDELINES.md) |
| Design System | [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) |
| Components | [COMPONENTS.md](./COMPONENTS.md) |
| Forms | [FORMS.md](./FORMS.md) |
| Accessibility | [ACCESSIBILITY.md](./ACCESSIBILITY.md) |
| Testing | [TEST_PLAN.md](../TEST_PLAN.md) |
