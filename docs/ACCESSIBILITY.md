# Accessibility Guide

> **Version:** 1.0 | **Last Updated:** 2026-07-06 | **Applies to:** All Applications

## Table of Contents

1. [WCAG 2.1 AA Targets](#wcag-21-aa-targets)
2. [Semantic HTML Usage](#semantic-html-usage)
3. [ARIA Attributes](#aria-attributes)
4. [Keyboard Navigation](#keyboard-navigation)
5. [Focus Management](#focus-management)
6. [Screen Reader Support](#screen-reader-support)
7. [Color Contrast Requirements](#color-contrast-requirements)
8. [RTL Accessibility](#rtl-accessibility)
9. [Testing with Tools](#testing-with-tools)

---

## WCAG 2.1 AA Targets

Jobilo targets **WCAG 2.1 Level AA** compliance across all interfaces.

### Key Success Criteria

| Criteria | Description | Our Implementation |
|----------|-------------|-------------------|
| 1.1.1 Non-text Content | All images have alt text | Avatar, Icon, Image components require alt prop |
| 1.3.1 Info and Relationships | Semantic structure | Proper heading hierarchy, `<nav>`, `<main>`, `<aside>` |
| 1.3.2 Meaningful Sequence | Content order is logical | DOM order matches visual order |
| 1.4.1 Use of Color | Color not sole identifier | Status icons accompany color badges |
| 1.4.3 Contrast (Minimum) | 4.5:1 for normal text | All text meets contrast ratios — see [COLORS.md](./COLORS.md#accessibility-wcag-21-aa) |
| 1.4.4 Resize Text | 200% zoom without loss | All layouts use relative units (rem) |
| 1.4.11 Non-text Contrast | 3:1 for UI components | Focus indicators, input borders |
| 2.1.1 Keyboard | All functionality via keyboard | Custom components have full keyboard support |
| 2.1.2 No Keyboard Trap | Focus never trapped | Modals trap focus but allow Escape to close |
| 2.4.1 Bypass Blocks | Skip navigation link | Skip-to-content link on every page |
| 2.4.3 Focus Order | Logical tab order | Tab order follows visual layout |
| 2.4.4 Link Purpose | Links describe destination | No "click here" links |
| 2.4.6 Headings and Labels | Descriptive headings/labels | Form inputs have `<label>` elements |
| 2.4.7 Focus Visible | Visible focus indicator | Custom focus ring on all interactive elements |
| 3.2.1 On Focus | No context change on focus | Focus never triggers navigation |
| 3.3.1 Error Identification | Errors described in text | Form validation shows message + visual indicator |
| 3.3.2 Labels or Instructions | Labels present for all inputs | Input component requires label prop |
| 4.1.2 Name, Role, Value | ARIA attributes as needed | Comprehensive ARIA on custom components |
| 4.1.3 Status Messages | Dynamic updates announced | Toast, Alert use `role="alert"` or `aria-live` |

---

## Semantic HTML Usage

### Page Structure

```tsx
// Every page must use semantic landmarks
<body>
  <SkipLink href="#main-content" />  {/* Skip navigation */}
  <header role="banner">
    <Navbar />
  </header>
  <nav aria-label="Main navigation">
    <Sidebar />
  </nav>
  <main id="main-content">
    <h1>Page Title</h1>
    {/* Page content */}
  </main>
  <footer role="contentinfo">
    {/* Footer content */}
  </footer>
</body>
```

### Element Reference

| HTML Element | When to Use | Notes |
|-------------|------------|-------|
| `<nav>` | Navigation blocks | Add `aria-label` when multiple navs exist |
| `<main>` | Primary content | One per page, skip-to-target |
| `<aside>` | Complementary content | Sidebars, related links |
| `<header>` | Page or section header | Not just for top nav |
| `<footer>` | Page or section footer | Contains copyright, links |
| `<article>` | Self-contained content | Project cards, blog posts |
| `<section>` | Thematic grouping | Use with heading |
| `<button>` | Actions, form submit | Not `<div>` with onClick |
| `<a>` | Navigation to URLs | Not for JavaScript actions |
| `<label>` | Form input labels | Always associate with `htmlFor` |
| `<fieldset>` | Related form fields | Group radio buttons, checkboxes |
| `<legend>` | Fieldset caption | Required for `<fieldset>` |
| `<table>` | Tabular data | Not for layout |
| `<ul>` / `<ol>` | Lists | Navigation items, features |

### Anti-Patterns (Avoid)

| Anti-Pattern | Correct Approach |
|-------------|-----------------|
| `<div onClick={...}>` | Use `<button>` or `<a>` |
| `<span>` for heading | Use `<h1>`–`<h6>` |
| `<br>` for spacing | Use CSS margins/padding |
| `<table>` for layout | Use CSS Grid/Flexbox |
| Placeholder as label | Use `<label>` element |
| `title` attribute for tooltip | Use Tooltip component |
| Nested interactive elements | Never nest buttons or links |

---

## ARIA Attributes

### ARIA Usage Rules

1. **First rule of ARIA**: Don't use ARIA if you can use a native HTML element
2. **No ARIA is better than bad ARIA**: Incorrect ARIA harms accessibility
3. **Use semantic HTML first**, supplement with ARIA only when necessary

### Common ARIA Attributes

| Attribute | When to Use | Example |
|-----------|-------------|---------|
| `role="alert"` | Dynamic error/success messages | Toast, form errors |
| `role="dialog"` | Modal dialogs | Modal component |
| `role="tablist"` | Tab interfaces | Tabs component |
| `role="tab"` | Individual tab | |
| `role="tabpanel"` | Tab content panel | |
| `aria-label` | Element needs accessible name | Icon buttons, nav sections |
| `aria-labelledby` | Referencing visible label | Dialog title association |
| `aria-describedby` | Additional description | Input hint, error description |
| `aria-expanded` | Expandable content | Accordion, dropdown |
| `aria-controls` | Control-target relationship | Tab controls panel |
| `aria-current="page"` | Current page in nav | Active nav link |
| `aria-selected` | Selected tab/item | Tabs, listbox |
| `aria-hidden="true"` | Decorative content | Icons, decorative images |
| `aria-live="polite"` | Dynamic content updates | Notification area |
| `aria-live="assertive"` | Urgent updates | Error banner |
| `aria-required="true"` | Required fields | Form validation |
| `aria-invalid="true"` | Invalid fields | Input with error |
| `aria-busy="true"` | Loading state | Skeleton, loading region |

### Our Component ARIA

| Component | ARIA Implementation |
|-----------|-------------------|
| Modal | `role="dialog"`, `aria-modal="true"`, `aria-labelledby` |
| Tab | `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected` |
| Dropdown | `aria-expanded`, `aria-haspopup="true"` |
| Toast | `role="alert"` or `aria-live="polite"` |
| Alert | `role="alert"` |
| Progress | `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax` |
| Switch | `role="switch"`, `aria-checked` |
| Dialog | `role="dialog"`, `aria-modal="true"` |
| Tooltip | `role="tooltip"`, describedby relationship |
| Nav | `aria-label="Main"` / `aria-label="Secondary"` |

---

## Keyboard Navigation

### Focusable Elements

All interactive elements must be focusable and operable via keyboard:

- Buttons: Enter/Space to activate
- Links: Enter to navigate
- Inputs: Type to fill
- Select: Arrow keys to navigate, Enter to select
- Checkbox/Radio: Space to toggle
- Custom components: Appropriate key handlers

### Tab Order

| Pattern | Tab Index |
|---------|-----------|
| Default focusable elements | `tabindex="0"` (implicit) |
| Custom interactive elements | `tabindex="0"` |
| Off-screen/modal content | `tabindex="-1"` (programmatic focus) |
| Never | `tabindex > 0` |

### Keyboard Shortcuts

| Key | Action | Component |
|-----|--------|-----------|
| Tab | Move to next focusable element | Global |
| Shift+Tab | Move to previous focusable element | Global |
| Enter/Space | Activate element | Button, Link, Toggle |
| Escape | Close/dismiss | Modal, Dropdown, Drawer, Toast |
| Arrow Down | Next item | Dropdown, Select |
| Arrow Up | Previous item | Dropdown, Select |
| Arrow Left/Right | Navigate tabs | Tabs, Carousel |
| Home/End | First/last item | List, DataTable |

### Modal Keyboard Trapping

```tsx
// Focus trap implementation
useEffect(() => {
  if (isOpen) {
    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const first = focusableElements?.[0]
    const last = focusableElements?.[focusableElements.length - 1]

    const handleTab = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          ;(last as HTMLElement)?.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          ;(first as HTMLElement)?.focus()
        }
      }
    }
    document.addEventListener('keydown', handleTab)
    return () => document.removeEventListener('keydown', handleTab)
  }
}, [isOpen])
```

---

## Focus Management

### Focus on Navigation

When a user navigates to a new page, focus should move to the `<main>` content:

```tsx
// In layout.tsx
const SkipLink = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:p-4"
  >
    Skip to main content
  </a>
)
```

### Focus on Modal Open/Close

| Action | Focus Target |
|--------|-------------|
| Modal opens | First focusable element inside modal |
| Modal closes | The element that triggered the modal |
| Drawer opens | Close button or first input |
| Drawer closes | Trigger element |
| Toast appears | No focus change (passive) |

### Focus Indicators

All interactive elements must have visible focus indicators:

```css
/* Default focus ring — defined globally */
*:focus-visible {
  outline: 2px solid #2563EB;
  outline-offset: 2px;
  border-radius: 4px;
}

/* Disable default outline when custom focus ring is shown */
*:focus:not(:focus-visible) {
  outline: none;
}
```

---

## Screen Reader Support

### Live Regions

Use `aria-live` regions for dynamic content updates:

| Region | aria-live | Use Case |
|--------|-----------|----------|
| Toast container | `polite` | Non-critical notifications |
| Alert banner | `assertive` | Critical errors |
| Form errors | `polite` | Validation messages |
| Loading indicator | `polite` | Loading states |
| Search results count | `polite` | Dynamic results |

### Screen Reader Only Content

```tsx
// Visually hidden but available to screen readers
const ScreenReaderOnly = ({ children }) => (
  <span className="sr-only">{children}</span>
)

// Usage
<Button aria-label="Close modal">
  <ScreenReaderOnly>Close</ScreenReaderOnly>
  <XIcon aria-hidden="true" />
</Button>
```

### Status Announcements

```tsx
// Announce dynamic changes
const [announcement, setAnnouncement] = useState('')

<AnnouncementRegion>
  <div aria-live="polite" aria-atomic="true" className="sr-only">
    {announcement}
  </div>
</AnnouncementRegion>
```

---

## Color Contrast Requirements

### Minimum Ratios

| Type | Ratio Required | WCAG Criterion |
|------|---------------|----------------|
| Normal text (< 18px / < 14px bold) | 4.5:1 | 1.4.3 AA |
| Large text (>= 18px / >= 14px bold) | 3:1 | 1.4.3 AA |
| UI components (borders, icons) | 3:1 | 1.4.11 AA |
| Focus indicators | 3:1 | 2.4.7 AA |

### Approved Color Combinations

See [COLORS.md](./COLORS.md#accessibility-wcag-21-aa) for the complete contrast ratio table.

### What We Test

- All text/background combinations in the design system
- All interactive component states (hover, focus, active, disabled)
- Placeholder text (exempt if not conveying information)
- Decorative elements (exempt if not essential)

---

## RTL Accessibility

### Dir Attribute

```html
<!-- Set on <html> element -->
<html lang="ar" dir="rtl">
<html lang="en" dir="ltr">
```

### Specific Considerations

| Consideration | Implementation |
|---------------|---------------|
| Navigation order | Tab order follows visual layout, not DOM |
| ARIA properties | Same ARIA, direction-independent |
| Focus indicators | Visible regardless of direction |
| Screen reader | Screen readers handle direction detection |
| Mixed content | Use `dir="auto"` for user-generated content |
| Number alignment | Numbers should remain LTR in Arabic context |

---

## Testing with Tools

### Automated Testing

| Tool | Scope | Command | Integration |
|------|-------|---------|-------------|
| axe-core | Accessibility violations | `npx axe --exit` | CI pipeline |
| Lighthouse | Accessibility score | `lighthouse --category=accessibility` | CI pipeline |
| eslint-plugin-jsx-a11y | Code-level issues | `npm run lint` | Pre-commit hook |
| WAVE | Browser extension | Manual | Design QA |

### Manual Testing

| Test | Frequency | Tool |
|------|-----------|------|
| Keyboard navigation | Per feature | Tab key, Enter, Escape |
| Screen reader | Per feature | VoiceOver (macOS), NVDA (Windows) |
| Zoom to 200% | Per feature | Browser zoom |
| Color contrast | Per feature | WebAIM Contrast Checker |
| Focus order | Per feature | Tab through entire page |

### CI Integration

```yaml
# .github/workflows/accessibility.yml
steps:
  - uses: actions/checkout@v4
  - run: npm ci
  - run: npm run build
  - run: npx axe http://localhost:3000 --exit
  - run: npx lighthouse http://localhost:3000 --output=json --output-path=./lighthouse-results.json
```

### Acceptance Criteria

Every feature must pass:

- [ ] No automated accessibility violations (axe-core)
- [ ] 90+ Lighthouse accessibility score
- [ ] All interactive elements keyboard-accessible
- [ ] Visible focus indicators on all elements
- [ ] Color contrast meets WCAG 2.1 AA
- [ ] Screen reader navigates content logically
- [ ] RTL layout functions correctly

---

## Cross-References

| Document | Link |
|----------|------|
| Colors (contrast ratios) | [COLORS.md](./COLORS.md#accessibility-wcag-21-aa) |
| UI Guidelines | [UI_GUIDELINES.md](./UI_GUIDELINES.md) |
| Components | [COMPONENTS.md](./COMPONENTS.md) |
| Typography (RTL) | [TYPOGRAPHY.md](./TYPOGRAPHY.md#rtl-specific-typography-considerations) |
| Forms | [FORMS.md](./FORMS.md) |
