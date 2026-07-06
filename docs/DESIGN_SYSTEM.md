# Design System

> **Version:** 2.0 | **Last Updated:** 2026-07-06 | **Applies to:** All Frontend Applications

## Table of Contents

1. [Color Palette](#color-palette)
2. [Typography](#typography)
3. [Spacing System](#spacing-system)
4. [Border Radius System](#border-radius-system)
5. [Shadow System](#shadow-system)
6. [Animation & Transition Defaults](#animation--transition-defaults)
7. [Component Tokens](#component-tokens)
8. [Design Principles](#design-principles)

---

## Color Palette

> See [COLORS.md](./COLORS.md) for the complete color reference including hex codes, accessibility data, and usage guidelines.

### Primary Colors

| Token | Tailwind | Purpose |
|-------|----------|---------|
| Primary | `blue-600` | Main CTAs, links, active states |
| Primary Light | `blue-50` | Background highlights |
| Primary Hover | `blue-700` | Hover state for CTAs |
| Primary Dark | `blue-800` | Active state |
| Primary Text | `blue-700` | Link text |

### Neutral Colors

| Token | Tailwind | Purpose |
|-------|----------|---------|
| Background | `white` / `gray-50` | Page/section backgrounds |
| Surface | `white` | Card, modal, dropdown backgrounds |
| Border | `gray-200` | Dividers, input borders |
| Border Light | `gray-100` | Subtle dividers |
| Text Primary | `gray-900` | Headings, body copy |
| Text Secondary | `gray-500` | Labels, metadata |
| Text Muted | `gray-400` | Placeholder text |

### Status Colors

| Token | Tailwind | Purpose |
|-------|----------|---------|
| Success | `green-600` | Successful operations, active status |
| Warning | `amber-500` | Pending states, warnings |
| Error | `red-600` | Errors, destructive actions |
| Info | `blue-500` | Informational banners |

---

## Typography

> See [TYPOGRAPHY.md](./TYPOGRAPHY.md) for complete typography reference including line-height and weight tables.

### Font Families

| Language | Font | Fallback |
|----------|------|----------|
| English (LTR) | Inter | system-ui, sans-serif |
| Arabic (RTL) | Cairo | system-ui, sans-serif |

### Type Scale

| Token | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| xs | 0.75rem (12px) | 400 | 1.5 | Captions, metadata |
| sm | 0.875rem (14px) | 400 | 1.5 | Body small, form labels |
| base | 1rem (16px) | 400 | 1.625 | Default body text |
| lg | 1.125rem (18px) | 500 | 1.6 | Lead text |
| xl | 1.25rem (20px) | 600 | 1.5 | H4 / section titles |
| 2xl | 1.5rem (24px) | 600 | 1.4 | H3 |
| 3xl | 1.875rem (30px) | 700 | 1.3 | H2 |
| 4xl | 2.25rem (36px) | 700 | 1.2 | H1 / page titles |

---

## Spacing System

### Base Unit

The spacing system uses a **4px base unit** mapped to Tailwind's spacing scale.

| Token | Pixels | Tailwind | Example Usage |
|-------|--------|----------|---------------|
| 0 | 0px | `gap-0` | No spacing |
| 0.5 | 2px | `gap-0.5` | Tight icon groups |
| 1 | 4px | `gap-1` | Inline icon spacing |
| 1.5 | 6px | `gap-1.5` | Small badge gaps |
| 2 | 8px | `gap-2` | Compact forms |
| 2.5 | 10px | `gap-2.5` | Tight grid gaps |
| 3 | 12px | `gap-3` | Small card gaps |
| 3.5 | 14px | `gap-3.5` | Form field gaps |
| 4 | 16px | `gap-4` | Default spacing |
| 5 | 20px | `gap-5` | Card padding |
| 6 | 24px | `gap-6` | Section spacing |
| 8 | 32px | `gap-8` | Page sections |
| 10 | 40px | `gap-10` | Major sections |
| 12 | 48px | `gap-12` | Page margins |
| 16 | 64px | `gap-16` | Large containers |

### Spacing Conventions

- **Horizontal padding** inside cards/containers: `px-6`
- **Vertical padding** inside cards: `py-4`
- **Gap between form fields**: `space-y-4`
- **Gap between sections**: `mb-8`
- **Page padding** (mobile): `px-4`
- **Page padding** (desktop): `px-8`

---

## Border Radius System

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| none | 0px | `rounded-none` | Tables, inputs (flat style) |
| sm | 4px | `rounded-sm` | Buttons `sm`, badges |
| DEFAULT | 6px | `rounded` (or `rounded-md`) | Buttons, cards, inputs |
| lg | 8px | `rounded-lg` | Cards, modals |
| xl | 12px | `rounded-xl` | Large modals, sheets |
| 2xl | 16px | `rounded-2xl` | Dropdown menus |
| full | 9999px | `rounded-full` | Avatars, pills, switches |

### Border Radius by Component

| Component | Border Radius |
|-----------|---------------|
| Button | `rounded-md` |
| Input | `rounded-md` |
| Card | `rounded-lg` |
| Modal | `rounded-xl` |
| Badge | `rounded-full` |
| Avatar | `rounded-full` |
| Table header | `rounded-none` |
| Dropdown menu | `rounded-lg` |

---

## Shadow System

| Token | Tailwind | Usage |
|-------|----------|-------|
| none | `shadow-none` | Flat surfaces, tables |
| sm | `shadow-sm` | Cards, sidebar |
| DEFAULT | `shadow` | Dropdowns, elevated cards |
| md | `shadow-md` | Modals |
| lg | `shadow-lg` | Drawers, sheets |
| xl | `shadow-xl` | Tooltips, popovers |
| 2xl | `shadow-2xl` | Toast notifications |

### Focus Ring

```css
/* Default focus ring */
focus:ring-2 focus:ring-blue-500 focus:ring-offset-2

/* Error focus ring */
focus:ring-2 focus:ring-red-500 focus:ring-offset-2

/* Input focus */
focus:border-blue-500 focus:ring-1 focus:ring-blue-500
```

---

## Animation & Transition Defaults

### Durations

| Token | Value | Usage |
|-------|-------|-------|
| fast | 100ms | Hover states, color transitions |
| normal | 200ms | Default transitions |
| slow | 300ms | Modal open/close, drawer slide |
| slower | 500ms | Page transitions |

### Easing Functions

| Token | Value | Usage |
|-------|-------|-------|
| default | `cubic-bezier(0.4, 0, 0.2, 1)` | Standard UI transitions |
| linear | `linear` | Progress bars |
| in-out | `cubic-bezier(0.4, 0, 0.2, 1)` | Modals, drawers |
| bounce | `cubic-bezier(0.175, 0.885, 0.32, 1.275)` | Toast entry |

### Transition Properties

```css
/* Default transition */
transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);

/* Color only (for performant hover) */
transition: colors 200ms;

/* Transform only (for drawer slide) */
transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
```

### Keyframe Animations

```css
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slide-in-right {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
```

---

## Component Tokens

### Button Tokens

| Token | Default | Hover | Active | Disabled |
|-------|---------|-------|--------|----------|
| primary-bg | blue-600 | blue-700 | blue-800 | gray-300 |
| primary-text | white | white | white | gray-500 |
| secondary-bg | white | gray-50 | gray-100 | gray-100 |
| secondary-text | gray-700 | gray-800 | gray-900 | gray-400 |
| secondary-border | gray-300 | gray-400 | gray-500 | gray-200 |
| danger-bg | red-600 | red-700 | red-800 | gray-300 |
| danger-text | white | white | white | gray-500 |
| ghost-text | gray-600 | gray-700 | gray-800 | gray-400 |

### Input Tokens

| Token | Default | Focus | Error | Disabled |
|-------|---------|-------|-------|----------|
| bg | white | white | white | gray-100 |
| border | gray-300 | blue-500 | red-500 | gray-200 |
| text | gray-900 | gray-900 | red-700 | gray-400 |
| placeholder | gray-400 | gray-400 | red-400 | gray-300 |
| ring | none | blue-500/20 | red-500/20 | none |

### Card Tokens

| Token | Value |
|-------|-------|
| bg | white |
| border | gray-200 |
| shadow | sm |
| radius | lg |
| padding | p-6 |

### Modal Tokens

| Token | Value |
|-------|-------|
| overlay-bg | gray-900/50 |
| overlay-blur | blur-sm |
| content-bg | white |
| content-radius | xl |
| content-shadow | xl |
| header-padding | p-6 pb-0 |
| body-padding | p-6 |
| footer-padding | px-6 py-4 |

---

## Design Principles

1. **Visual Hierarchy**: Use size, weight, and color to establish importance. The most critical action is always the most visually prominent.
2. **Consistency Over Novelty**: Reuse existing patterns. Do not introduce new visual treatments without team discussion.
3. **Accessibility First**: All design tokens meet WCAG 2.1 AA contrast ratios. See [ACCESSIBILITY.md](./ACCESSIBILITY.md).
4. **Performance**: Animations are GPU-accelerated (opacity, transform only). No jank.
5. **Responsive**: All components work across breakpoints. See [RESPONSIVE.md](./RESPONSIVE.md).
6. **RTL Parity**: Every LTR design has an RTL equivalent. No directional assumptions.

---

## Cross-References

| Document | Link |
|----------|------|
| Color Reference | [COLORS.md](./COLORS.md) |
| Typography | [TYPOGRAPHY.md](./TYPOGRAPHY.md) |
| UI Guidelines | [UI_GUIDELINES.md](./UI_GUIDELINES.md) |
| Components | [COMPONENTS.md](./COMPONENTS.md) |
| Accessibility | [ACCESSIBILITY.md](./ACCESSIBILITY.md) |
