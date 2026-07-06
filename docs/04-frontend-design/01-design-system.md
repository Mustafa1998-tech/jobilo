# Jobilo - Design System & UI/UX

---

## Brand Identity

### Colors
```css
/* Primary - الثقة والأمان */
--primary-50:  #eff6ff    /* Very light blue */
--primary-100: #dbeafe
--primary-200: #bfdbfe
--primary-300: #93c5fd
--primary-400: #60a5fa
--primary-500: #3b82f6    /* Primary main */
--primary-600: #2563eb
--primary-700: #1d4ed8
--primary-800: #1e40af
--primary-900: #1e3a8a

/* Secondary - النمو والازدهار */
--secondary-50:  #f0fdf4
--secondary-500: #22c55e    /* Secondary main */
--secondary-700: #15803d

/* Accent - الإبداع */
--accent-50:  #fdf4ff
--accent-500: #a855f7     /* Accent main */
--accent-700: #7e22ce

/* Neutral */
--neutral-50:  #f8fafc
--neutral-100: #f1f5f9
--neutral-200: #e2e8f0
--neutral-300: #cbd5e1
--neutral-400: #94a3b8
--neutral-500: #64748b
--neutral-600: #475569
--neutral-700: #334155
--neutral-800: #1e293b
--neutral-900: #0f172a

/* Semantic */
--success: #22c55e
--warning: #f59e0b
--error:   #ef4444
--info:    #3b82f6

/* Surface (Light/Dark) */
--bg-primary:     #ffffff
--bg-secondary:   #f8fafc
--bg-tertiary:    #f1f5f9
--text-primary:   #0f172a
--text-secondary: #475569
--text-muted:     #94a3b8
--border:         #e2e8f0
```

### Typography
```css
/* Font Family */
--font-main: 'Cairo', 'Noto Sans Arabic', sans-serif;  /* Arabic */
--font-en:   'Inter', 'Segoe UI', sans-serif;          /* English */

/* Scale */
--text-xs:   0.75rem   /* 12px */
--text-sm:   0.875rem  /* 14px */
--text-base: 1rem      /* 16px */
--text-lg:   1.125rem  /* 18px */
--text-xl:   1.25rem   /* 20px */
--text-2xl:  1.5rem    /* 24px */
--text-3xl:  1.875rem  /* 30px */
--text-4xl:  2.25rem   /* 36px */
--text-5xl:  3rem      /* 48px */

/* Weight */
--font-normal:   400
--font-medium:   500
--font-semibold: 600
--font-bold:     700
```

### Spacing
```css
--space-1:  0.25rem  /* 4px */
--space-2:  0.5rem   /* 8px */
--space-3:  0.75rem  /* 12px */
--space-4:  1rem     /* 16px */
--space-5:  1.25rem  /* 20px */
--space-6:  1.5rem   /* 24px */
--space-8:  2rem     /* 32px */
--space-10: 2.5rem   /* 40px */
--space-12: 3rem     /* 48px */
--space-16: 4rem     /* 64px */
--space-20: 5rem     /* 80px */
```

### Border Radius
```css
--radius-sm:   0.375rem  /* 6px */
--radius-md:   0.5rem    /* 8px */
--radius-lg:   0.75rem   /* 12px */
--radius-xl:   1rem      /* 16px */
--radius-2xl:  1.5rem    /* 24px */
--radius-full: 9999px
```

### Shadows
```css
--shadow-sm:   0 1px 2px 0 rgb(0 0 0 / 0.05)
--shadow-md:   0 4px 6px -1px rgb(0 0 0 / 0.1)
--shadow-lg:   0 10px 15px -3px rgb(0 0 0 / 0.1)
--shadow-xl:   0 20px 25px -5px rgb(0 0 0 / 0.1)
--shadow-2xl:  0 25px 50px -12px rgb(0 0 0 / 0.25)
```

---

## Component Library (shadcn/ui + Custom)

### Base Components (shadcn/ui)
```
Button, Input, Label, Select, Textarea, Badge, Card, 
Dialog, Modal, Sheet, DropdownMenu, Popover, Tooltip,
Avatar, Alert, Toast, Skeleton, Progress, Tabs,
Table, Pagination, Command, Separator, Switch,
Checkbox, RadioGroup, Form, Calendar, DatePicker
```

### Custom Components (Jobilo-specific)
```
ProjectCard          → Project listing card
ProposalCard         → Proposal listing card
UserCard             → Freelancer/Client profile card
RatingStars          → Star rating display
ReviewCard           → Review display
MilestoneTimeline    → Milestone progress
ChatBubble           → Message display
NotificationItem     → Notification list item
JobMatchBadge        → AI match score badge
SkillBadge           → Skill tag with level
PortfolioGrid        → Portfolio items grid
DashboardStats       → Statistics cards
SearchFilters        → Collapsible filters panel
EmptyState           → Empty state with illustration
ErrorState           → Error state with retry
LoadingSkeleton      → Skeleton components
FileUpload           → Drag & drop upload
RichTextEditor       → Cover letter/description editor
EscrowProgress       → Payment progress indicator
DisputeTimeline      → Dispute resolution timeline
```

---

## Layout Structure

### Public Layout (Non-authenticated)
```
┌─────────────────────────────────────────┐
│  Header (Logo, Navigation, Auth Buttons) │
├─────────────────────────────────────────┤
│                                         │
│           Main Content Area             │
│           (Full Width)                  │
│                                         │
├─────────────────────────────────────────┤
│            Footer                        │
│    (Links, Social, Newsletter)          │
└─────────────────────────────────────────┘
```

### App Layout (Authenticated)
```
┌─────────────────────────────────────────────┐
│  Top Bar (Logo, Search, Notif, Avatar)       │
├──────────────┬──────────────────────────────┤
│              │                               │
│  Sidebar     │  Main Content                 │
│  Navigation  │  (Scrollable)                 │
│  (Collapsible)│                              │
│              │                               │
│  - Dashboard │                               │
│  - Projects  │                               │
│  - Proposals │                               │
│  - Messages  │                               │
│  - Wallet    │                               │
│  - Profile   │                               │
│  - Settings  │                               │
├──────────────┴──────────────────────────────┤
│  Mobile Bottom Nav (visible on < md)        │
└─────────────────────────────────────────────┘
```

### Responsive Breakpoints
```
Mobile:   0px - 639px    (sm)
Tablet:   640px - 1023px (md)
Desktop:  1024px - 1279px (lg)
Wide:     1280px+        (xl)
```

---

## Navigation Structure

### Public Navigation
```
الرئيسية     | Home
المشاريع     | Browse Projects
المستقلون    | Freelancers
المدونة      | Blog (future)
عن المنصة    | About
تسجيل الدخول | Login
اشتراك       | Register
```

### Freelancer Navigation (Sidebar)
```
📊 لوحة التحكم     | Dashboard
📋 المشاريع        | Browse Projects
✉️ عروضي           | My Proposals
💼 مشاريعي         | My Projects
💬 الرسائل         | Messages
💰 المحفظة         | Wallet
👤 ملفي الشخصي     | My Profile
⚙️ الإعدادات       | Settings
```

### Client Navigation (Sidebar)
```
📊 لوحة التحكم     | Dashboard
➕ نشر مشروع        | Post Project
📋 مشاريعي         | My Projects
📩 العروض          | Proposals
💬 الرسائل         | Messages
💰 المحفظة         | Wallet
👤 ملف الشركة      | Company Profile
⚙️ الإعدادات       | Settings
```

### Admin Navigation
```
📊 لوحة التحكم     | Dashboard
👥 المستخدمون      | Users
📋 المشاريع        | Projects
⚖️ النزاعات        | Disputes
🏷️ التصنيفات       | Categories
💳 المدفوعات        | Payments
📈 التقارير         | Reports
📝 سجل التدقيق      | Audit Logs
⚙️ الإعدادات       | Settings
```

---

## Theme Modes

### Light Mode (Default)
```
Background: white/near-white
Text: dark gray/near-black
Cards: white with subtle shadow
Borders: light gray
Primary actions: blue
```

### Dark Mode (Toggle)
```
Background: dark navy/slate
Text: light gray/white
Cards: slightly lighter than bg
Borders: dark gray
Primary actions: brighter blue
```

---

## Accessibility

| Requirement | Implementation |
|-------------|---------------|
| WCAG 2.1 AA | Target for all pages |
| Keyboard navigation | Full support with visible focus rings |
| Screen readers | ARIA labels, roles, landmarks |
| Color contrast | 4.5:1 minimum ratio |
| Focus indicators | Custom focus-visible styles |
| Skip to content | Skip link at top of page |
| Reduced motion | Respect prefers-reduced-motion |
| Text resize | Up to 200% without breakage |
| Form labels | Every input has associated label |
| Error announcements | Screen reader-friendly errors |
| Language attributes | Correct lang on HTML element |
| RTL support | Full RTL layout with CSS logical properties |
