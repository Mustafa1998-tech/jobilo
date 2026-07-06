# Color Reference

> **Version:** 1.0 | **Last Updated:** 2026-07-06 | **Applies to:** All Frontend Applications

## Table of Contents

1. [Complete Color Palette](#complete-color-palette)
2. [Usage Guidelines](#usage-guidelines)
3. [Accessibility (WCAG 2.1 AA)](#accessibility-wcag-21-aa)
4. [Color Tokens Mapping](#color-tokens-mapping)
5. [Background / Text / Border / Hover States](#background--text--border--hover-states)
6. [Color Combinations to Avoid](#color-combinations-to-avoid)

---

## Complete Color Palette

### Primary Blues

| Token | Tailwind | Hex | Usage |
|-------|----------|-----|-------|
| blue-50 | `bg-blue-50` | `#EFF6FF` | Background tint, table row hover |
| blue-100 | `bg-blue-100` | `#DBEAFE` | Light highlight |
| blue-200 | `bg-blue-200` | `#BFDBFE` | — |
| blue-300 | `bg-blue-300` | `#93C5FD` | — |
| blue-400 | `bg-blue-400` | `#60A5FA` | Info icons |
| blue-500 | `bg-blue-500` | `#3B82F6` | Links, secondary CTAs |
| **blue-600** | **`bg-blue-600`** | **`#2563EB`** | **Primary CTAs, active nav** |
| blue-700 | `bg-blue-700` | `#1D4ED8` | Hover state |
| blue-800 | `bg-blue-800` | `#1E40AF` | Active/pressed state |
| blue-900 | `bg-blue-900` | `#1E3A8A` | — |

### Neutral Grays

| Token | Tailwind | Hex | Usage |
|-------|----------|-----|-------|
| **gray-50** | **`bg-gray-50`** | **`#F9FAFB`** | **Page backgrounds, section alt** |
| gray-100 | `bg-gray-100` | `#F3F4F6` | Skeleton, disabled backgrounds |
| gray-200 | `border-gray-200` | `#E5E7EB` | Borders, dividers |
| gray-300 | `border-gray-300` | `#D1D5DB` | Input borders |
| gray-400 | `text-gray-400` | `#9CA3AF` | Placeholder, disabled text |
| gray-500 | `text-gray-500` | `#6B7280` | Secondary text, labels |
| gray-600 | `text-gray-600` | `#4B5563` | Body text |
| gray-700 | `text-gray-700` | `#374151` | Strong body |
| gray-800 | `text-gray-800` | `#1F2937` | Subheadings |
| **gray-900** | **`text-gray-900`** | **`#111827`** | **Headings, primary text** |

### Status Colors

| Token | Tailwind | Hex | Usage |
|-------|----------|-----|-------|
| green-50 | `bg-green-50` | `#F0FDF4` | Success background |
| green-100 | `bg-green-100` | `#DCFCE7` | — |
| green-200 | `bg-green-200` | `#BBF7D0` | — |
| green-400 | `text-green-400` | `#4ADE80` | — |
| green-500 | `text-green-500` | `#22C55E` | — |
| **green-600** | **`bg-green-600`** | **`#16A34A`** | **Success text, buttons** |
| green-700 | `text-green-700` | `#15803D` | Dark success |
| green-800 | `bg-green-800` | `#166534` | Hover success bg |
| amber-50 | `bg-amber-50` | `#FFFBEB` | Warning background |
| amber-100 | `bg-amber-100` | `#FEF3C7` | — |
| amber-400 | `text-amber-400` | `#FBBF24` | — |
| **amber-500** | **`text-amber-500`** | **`#F59E0B`** | **Warning icons, text** |
| amber-600 | `bg-amber-600` | `#D97706` | Warning buttons |
| amber-700 | `text-amber-700` | `#B45309` | Dark warning |
| red-50 | `bg-red-50` | `#FEF2F2` | Error background |
| red-100 | `bg-red-100` | `#FEE2E2` | — |
| red-400 | `text-red-400` | `#F87171` | — |
| red-500 | `text-red-500` | `#EF4444` | Error text |
| **red-600** | **`bg-red-600`** | **`#DC2626`** | **Error buttons, destructive** |
| red-700 | `text-red-700` | `#B91C1C` | Dark error |
| red-800 | `bg-red-800` | `#991B1B` | Hover error bg |

### White & Black

| Token | Hex | Usage |
|-------|-----|-------|
| white | `#FFFFFF` | Card backgrounds, surface |
| black | `#000000` | Only for opacity overlays |

---

## Usage Guidelines

### Primary Color — Blue-600

| Element | Application |
|---------|-------------|
| Primary buttons | `bg-blue-600 text-white` |
| Links | `text-blue-600 hover:text-blue-700` |
| Active navigation item | `text-blue-600 border-b-2 border-blue-600` |
| Focus ring | `ring-2 ring-blue-500` |
| Selected state | `bg-blue-50 border-blue-500` |
| Progress indicator | `bg-blue-600` |
| Toggle active | `bg-blue-600` |

### Gray Colors

| Token | Application |
|-------|-------------|
| gray-50 | Page backgrounds, section backgrounds |
| gray-100 | Disabled backgrounds, skeleton loading |
| gray-200 | Borders, horizontal rules, dividers |
| gray-300 | Input borders (enabled) |
| gray-400 | Placeholder text, disabled text |
| gray-500 | Labels, metadata, secondary information |
| gray-600 | Body text (primary content) |
| gray-700 | Strong body text |
| gray-800 | Subheadings |
| gray-900 | Main headings, title text |

### Status Colors

- **green-600**: Successful operations, active status badges, completion indicators
- **amber-500**: Pending/processing states, warnings, medium-priority notifications
- **red-600**: Errors, validation failures, destructive actions, failed status badges
- **blue-500**: Information banners, help text, informational badges

### Reserved Colors (Do Not Use)

| Color | Reason |
|-------|--------|
| pink, purple, indigo, teal, cyan, lime, orange (except amber), rose, fuchsia, violet | Outside the brand palette |
| Any custom hex not in the palette | Must go through design review |
| Black `#000000` | Only for overlay opacity — use gray-900 for text |
| Pure white `#FFFFFF` on colored backgrounds | Use with caution; ensure contrast |

---

## Accessibility (WCAG 2.1 AA)

### Contrast Ratios

| Token Combination | Ratio | Passes AA? | Notes |
|-------------------|-------|-----------|-------|
| blue-600 on white | 5.6:1 | ✅ Yes | AA for normal text |
| blue-600 on gray-50 | 5.2:1 | ✅ Yes | AA for normal text |
| blue-600 on gray-100 | 4.8:1 | ✅ Yes | AA for large text only |
| blue-500 on white | 4.2:1 | ✅ Yes | AA for large text only |
| gray-400 on white | 2.5:1 | ❌ No | Placeholder only (not for info) |
| gray-500 on white | 4.1:1 | ✅ Yes | AA for normal text |
| gray-600 on white | 5.7:1 | ✅ Yes | AA for normal text |
| gray-700 on white | 7.2:1 | ✅ Yes | AAA for normal text |
| gray-900 on white | 12.6:1 | ✅ Yes | AAA for normal text |
| green-600 on white | 5.5:1 | ✅ Yes | AA for normal text |
| red-600 on white | 5.2:1 | ✅ Yes | AA for normal text |
| amber-500 on white | 3.4:1 | ❌ No | Use amber-600 for text on white |
| green-600 on gray-50 | 5.1:1 | ✅ Yes | AA for normal text |
| red-600 on gray-50 | 4.8:1 | ✅ Yes | AA for normal text |

### Ensuring Accessibility

1. **Normal text** (< 18px / < 14px bold): Minimum 4.5:1 contrast ratio
2. **Large text** (>= 18px / >= 14px bold): Minimum 3:1 contrast ratio
3. **UI components and graphical objects**: Minimum 3:1 contrast ratio
4. **Focus indicators**: Minimum 3:1 contrast against adjacent colors

### Tools

- Use the [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) during design
- Use `axe-core` in development to detect contrast violations automatically
- See [ACCESSIBILITY.md](./ACCESSIBILITY.md) for full accessibility testing procedures

---

## Color Tokens Mapping

### Semantic Tokens

| CSS Variable | Tailwind Class | Hex |
|-------------|----------------|-----|
| `--color-primary` | `text-blue-600` | `#2563EB` |
| `--color-primary-hover` | `hover:text-blue-700` | `#1D4ED8` |
| `--color-primary-bg` | `bg-blue-50` | `#EFF6FF` |
| `--color-surface` | `bg-white` | `#FFFFFF` |
| `--color-background` | `bg-gray-50` | `#F9FAFB` |
| `--color-border` | `border-gray-200` | `#E5E7EB` |
| `--color-text-primary` | `text-gray-900` | `#111827` |
| `--color-text-secondary` | `text-gray-500` | `#6B7280` |
| `--color-text-muted` | `text-gray-400` | `#9CA3AF` |
| `--color-success` | `text-green-600` | `#16A34A` |
| `--color-warning` | `text-amber-500` | `#F59E0B` |
| `--color-error` | `text-red-600` | `#DC2626` |
| `--color-info` | `text-blue-500` | `#3B82F6` |

### Tailwind Config Extension

```js
// tailwind.config.ts
colors: {
  primary: colors.blue,
  surface: '#FFFFFF',
  background: '#F9FAFB',
}
```

---

## Background / Text / Border / Hover States

### Primary Elements

| State | Background | Text Color | Border | Hover BG |
|-------|-----------|-----------|--------|----------|
| Button (primary) | blue-600 | white | blue-600 | blue-700 |
| Button (secondary) | white | gray-700 | gray-300 | gray-50 |
| Button (danger) | red-600 | white | red-600 | red-700 |
| Button (ghost) | transparent | gray-600 | transparent | gray-100 |
| Input (default) | white | gray-900 | gray-300 | — |
| Input (focus) | white | gray-900 | blue-500 | — |
| Input (error) | white | gray-900 | red-500 | — |
| Input (disabled) | gray-100 | gray-400 | gray-200 | — |
| Card | white | gray-900 | gray-200 | — |
| Badge (success) | green-50 | green-700 | green-200 | — |
| Badge (warning) | amber-50 | amber-700 | amber-200 | — |
| Badge (error) | red-50 | red-700 | red-200 | — |
| Badge (info) | blue-50 | blue-700 | blue-200 | — |
| Alert (success) | green-50 | green-800 | green-200 | — |
| Alert (warning) | amber-50 | amber-800 | amber-200 | — |
| Alert (error) | red-50 | red-800 | red-200 | — |
| Alert (info) | blue-50 | blue-800 | blue-200 | — |

---

## Color Combinations to Avoid

| Combination | Issue |
|-------------|-------|
| gray-400 on white (2.5:1) | Fails WCAG AA — do not use for readable text |
| amber-500 on white (3.4:1) | Fails WCAG AA for normal text |
| blue-600 on blue-100 | Insufficient contrast |
| red-600 on red-100 | Insufficient contrast |
| green-600 on green-100 | Insufficient contrast |
| gray-200 on white (1.4:1) | Only for borders, never for text |
| Pure red on pure blue | Accessibility issue for color blindness |
| gray-300 on white (2.9:1) | Fails WCAG AA — never for text |
| gray-50 on white (1.1:1) | Not visible — use only as background tint |

### Safe Combinations

| Use | Safe Combo |
|-----|-----------|
| Primary text on white | gray-900 / `#111827` on white |
| Body text on white | gray-600 / `#4B5563` on white |
| Secondary text on white | gray-500 / `#6B7280` on white |
| Links on white | blue-600 / `#2563EB` on white |
| Error text on white | red-600 / `#DC2626` on white |
| Success text on white | green-600 / `#16A34A` on white |
| Primary button text | white on blue-600 |
| Badge text (success) | green-700 on green-50 |
| Badge text (error) | red-700 on red-50 |

---

## Cross-References

| Document | Link |
|----------|------|
| Design System | [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) |
| UI Guidelines | [UI_GUIDELINES.md](./UI_GUIDELINES.md) |
| Accessibility | [ACCESSIBILITY.md](./ACCESSIBILITY.md) |
| Components | [COMPONENTS.md](./COMPONENTS.md) |
