# Typography

> **Version:** 1.0 | **Last Updated:** 2026-07-06 | **Applies to:** All Frontend Applications

## Table of Contents

1. [Font Families](#font-families)
2. [Font Size Scale](#font-size-scale)
3. [Font Weights](#font-weights)
4. [Line Heights](#line-heights)
5. [Heading Styles (h1–h6)](#heading-styles-h1h6)
6. [Body Text Styles](#body-text-styles)
7. [RTL-Specific Typography Considerations](#rtl-specific-typography-considerations)
8. [Arabic Typography Best Practices](#arabic-typography-best-practices)

---

## Font Families

### Primary Fonts

| Language | Font | Source | Variable Support | Fallback Stack |
|----------|------|--------|-----------------|----------------|
| English (LTR) | Inter | Google Fonts | Yes (wght) | `Inter, system-ui, -apple-system, sans-serif` |
| Arabic (RTL) | Cairo | Google Fonts | Yes (wght) | `Cairo, system-ui, -apple-system, sans-serif` |

### Font Loading

Fonts are loaded via `next/font` in `frontend/src/app/layout.tsx`:

```tsx
import { Inter, Cairo } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const cairo = Cairo({
  subsets: ['arabic'],
  variable: '--font-cairo',
  display: 'swap',
})
```

### CSS Variables

```css
:root {
  --font-inter: 'Inter', system-ui, sans-serif;
  --font-cairo: 'Cairo', system-ui, sans-serif;
}
```

---

## Font Size Scale

| Token | Size | Rem | Pixels | Usage |
|-------|------|-----|--------|-------|
| xs | `text-xs` | 0.75rem | 12px | Captions, metadata, timestamps |
| sm | `text-sm` | 0.875rem | 14px | Body small, form labels, help text |
| base | `text-base` | 1rem | 16px | Default body text, paragraphs |
| lg | `text-lg` | 1.125rem | 18px | Lead text, highlighted content |
| xl | `text-xl` | 1.25rem | 20px | H4, section subtitles, card titles |
| 2xl | `text-2xl` | 1.5rem | 24px | H3, modal titles, section headers |
| 3xl | `text-3xl` | 1.875rem | 30px | H2, page section headers |
| 4xl | `text-4xl` | 2.25rem | 36px | H1, main page titles, hero headings |

### Extended Scale (Rare Use)

| Token | Size | Rem | Pixels |
|-------|------|-----|--------|
| 5xl | `text-5xl` | 3rem | 48px |
| 6xl | `text-6xl` | 3.75rem | 60px |
| 7xl | `text-7xl` | 4.5rem | 72px |

> Extended sizes (5xl+) are reserved for landing pages and marketing sections only. Do not use in dashboard/app interfaces.

---

## Font Weights

| Token | Weight | CSS | Tailwind | Usage |
|-------|--------|-----|----------|-------|
| Regular | 400 | `font-normal` | `font-normal` | Body text, paragraphs |
| Medium | 500 | `font-medium` | `font-medium` | Labels, buttons, active items |
| Semibold | 600 | `font-semibold` | `font-semibold` | Subheadings, card titles |
| Bold | 700 | `font-bold` | `font-bold` | H1–H3, page headings, emphasis |

### Weight Mapping by Component

| Component | Weight |
|-----------|--------|
| Body text (default) | Regular (400) |
| Strong / emphasis | Semibold (600) |
| Labels | Medium (500) |
| Button text | Medium (500) |
| H1 | Bold (700) |
| H2 | Bold (700) |
| H3 | Semibold (600) |
| H4 | Semibold (600) |
| H5 | Medium (500) |
| H6 | Medium (500) |
| Table headers | Semibold (600) |
| Navigation items | Medium (500) |
| Badge text | Medium (500) |
| Small / caption | Regular (400) |

---

## Line Heights

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| none | 1 | `leading-none` | Headings, one-line elements |
| tight | 1.25 | `leading-tight` | H1–H2 headings |
| snug | 1.375 | `leading-snug` | H3–H4 headings |
| normal | 1.5 | `leading-normal` | Default body, H5–H6 |
| relaxed | 1.625 | `leading-relaxed` | Body paragraphs, long text |
| loose | 2 | `leading-loose` | Captions, small text |

### Line Height by Element

| Element | Line Height |
|---------|-------------|
| H1 | tight (1.2) |
| H2 | tight (1.3) |
| H3 | snug (1.4) |
| H4 | snug (1.5) |
| H5 | normal (1.5) |
| H6 | normal (1.5) |
| Body (Arabic) | relaxed (1.8) |
| Body (English) | relaxed (1.625) |
| Small / caption | normal (1.5) |
| Button | none (1) |

---

## Heading Styles (h1–h6)

| Level | Size | Weight | Line Height | Tailwind Classes |
|-------|------|--------|-------------|------------------|
| H1 | 4xl (36px) | Bold (700) | tight (1.2) | `text-4xl font-bold leading-tight` |
| H2 | 3xl (30px) | Bold (700) | tight (1.3) | `text-3xl font-bold leading-tight` |
| H3 | 2xl (24px) | Semibold (600) | snug (1.4) | `text-2xl font-semibold leading-snug` |
| H4 | xl (20px) | Semibold (600) | snug (1.5) | `text-xl font-semibold leading-snug` |
| H5 | lg (18px) | Medium (500) | normal (1.5) | `text-lg font-medium leading-normal` |
| H6 | base (16px) | Medium (500) | normal (1.5) | `text-base font-medium leading-normal` |

### Heading Spacing

| Element | Margin Top | Margin Bottom |
|---------|-----------|---------------|
| H1 | 0 | `mb-4` (16px) |
| H2 | `mt-8` (32px) | `mb-3` (12px) |
| H3 | `mt-6` (24px) | `mb-2` (8px) |
| H4 | `mt-4` (16px) | `mb-2` (8px) |
| H5 | `mt-4` (16px) | `mb-1` (4px) |
| H6 | `mt-4` (16px) | `mb-1` (4px) |

### Page Title Pattern

```tsx
<div className="mb-8">
  <h1 className="text-4xl font-bold leading-tight text-gray-900">
    Dashboard
  </h1>
  <p className="mt-2 text-gray-500">
    Welcome back, John. Here's your project overview.
  </p>
</div>
```

---

## Body Text Styles

| Style | Size | Weight | Line Height | Tailwind Classes |
|-------|------|--------|-------------|------------------|
| Body (default) | base (16px) | Regular (400) | relaxed (1.625) | `text-base leading-relaxed` |
| Body (small) | sm (14px) | Regular (400) | normal (1.5) | `text-sm leading-normal` |
| Body (lead) | lg (18px) | Regular (400) | relaxed (1.625) | `text-lg leading-relaxed` |
| Caption | xs (12px) | Regular (400) | normal (1.5) | `text-xs leading-normal` |
| Label | sm (14px) | Medium (500) | normal (1.5) | `text-sm font-medium` |
| Label (small) | xs (12px) | Medium (500) | normal (1.5) | `text-xs font-medium` |
| Help text | xs (12px) | Regular (400) | normal (1.5) | `text-xs text-gray-500` |
| Metadata | xs (12px) | Regular (400) | normal (1.5) | `text-xs text-gray-400` |
| Code | sm (14px) | Regular (400) | normal (1.5) | `font-mono text-sm` |

### Paragraph Spacing

```css
/* Default paragraph spacing */
p + p {
  margin-top: 1em; /* 16px */
}
```

### Inline Text Styles

| Style | Tailwind | Usage |
|-------|----------|-------|
| Strong emphasis | `font-semibold` | Important inline text |
| Link | `text-blue-600 hover:text-blue-700 underline` | Hyperlinks |
| Muted | `text-gray-500` | Less important text |
| Error | `text-red-600` | Error messages |
| Success | `text-green-600` | Success messages |
| Code inline | `font-mono text-sm bg-gray-100 px-1 rounded` | Inline code |
| Strikethrough | `line-through text-gray-400` | Deleted/irrelevant text |

---

## RTL-Specific Typography Considerations

### Directional Settings

```css
/* Auto direction based on lang attribute */
[dir="ltr"] {
  --direction: ltr;
  text-align: left;
}

[dir="rtl"] {
  --direction: rtl;
  text-align: right;
}
```

### Font Family Selection

RTL pages use Cairo with adjusted line heights:

```css
[lang="ar"] {
  font-family: var(--font-cairo);
  line-height: 1.8; /* Taller for Arabic readability */
}

[lang="en"] {
  font-family: var(--font-inter);
  line-height: 1.625;
}
```

### RTL Heading Adjustments

| Element | LTR | RTL |
|---------|-----|-----|
| H1–H6 | `text-left` | `text-right` |
| Page title + subtitle | subtitle margin-left | subtitle margin-right |
| Section headers with icons | icon `mr-2` | icon `ml-2` |
| Labels | `text-left` | `text-right` |

### Mixed Language Content

```tsx
<p className="text-gray-700">
  {/* Arabic text with English inline */}
  <span lang="ar">مرحبا بكم في</span>
  {' '}
  <span lang="en" className="font-inter">Jobilo</span>
</p>
```

---

## Arabic Typography Best Practices

### Font Selection

- **Cairo** is the primary Arabic font, designed for legibility at small sizes
- It supports the full Arabic character set including Quranic marks
- Weights: Regular (400), Medium (500), Semibold (600), Bold (700)

### Arabic-Specific Guidelines

| Aspect | Recommendation |
|--------|---------------|
| Line height | Use `leading-relaxed` (1.8) for body text — Arabic needs more vertical space |
| Font size | Arabic text at the same px size appears smaller than Latin; consider `text-base` minimum |
| Font weight | Medium (500) for Arabic body text improves readability over Regular (400) |
| Letter spacing | Avoid `tracking-*` classes — Arabic letters connect and spacing breaks glyphs |
| Text alignment | Always `text-right` for Arabic content |
| Numbers | Arabic uses Hindu-Arabic numerals (١٢٣) — ensure proper locale formatting |
| Punctuation | Arabic commas (،) and question marks (؟) differ from Latin |
| Bold emphasis | Use Semibold (600) — full Bold (700) can look heavy in Arabic |
| Headings | Arabic headings benefit from medium weight rather than bold |

### Arabic Font Size Adjustments

| English Size | Arabic Recommendation | Reason |
|-------------|----------------------|--------|
| text-xs (12px) | Use sm (14px) minimum | Arabic becomes illegible below 14px |
| text-sm (14px) | text-sm (14px) — OK | Minimum readable size |
| text-base (16px) | text-base (16px) — OK | Default |
| text-lg+ (18px+) | Same size | Larger sizes work well |

### Bidirectional Text Handling

```tsx
// Use dir="auto" for user-generated content
<p dir="auto" className="text-gray-700">
  {userGeneratedContent} {/* Could be Arabic, English, or mixed */}
</p>
```

---

## Cross-References

| Document | Link |
|----------|------|
| Design System | [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) |
| UI Guidelines | [UI_GUIDELINES.md](./UI_GUIDELINES.md) |
| Colors | [COLORS.md](./COLORS.md) |
| Components | [COMPONENTS.md](./COMPONENTS.md) |
| Accessibility | [ACCESSIBILITY.md](./ACCESSIBILITY.md) |
