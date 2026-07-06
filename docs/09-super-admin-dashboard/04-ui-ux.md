# Super Admin Dashboard — UI/UX & Design System

## المصادر الملهمة (Design Inspiration)

لوحة Super Admin مستوحاة من أفضل لوحات التحكم الحديثة:

| المصدر | الميزات المستوحاة |
|--------|-------------------|
| **Stripe Dashboard** | البساطة، التباعد الواسع (Whitespace), الخط الواضح، البطاقات الإحصائية |
| **Vercel Dashboard** | الـ Sidebar الأنيق، الـ Dark Mode المتقن، الـ Typography |
| **Linear** | الـ Transitions السلسة، الـ Keyboard Shortcuts، تجربة المستخدم النظيفة |
| **GitHub Admin** | الـ Tables الغنية، الـ Filters، الـ Batch Actions |
| **Notion Sidebar** | الـ Nested Navigation، الـ Collapse/Expand، البحث السريع |

## Design Tokens

### الألوان

```css
/* Light Mode */
--bg-primary: #ffffff;
--bg-secondary: #f8fafc;
--bg-card: #ffffff;
--bg-hover: #f1f5f9;
--bg-active: #eff6ff;
--bg-sidebar: #0f172a;
--bg-sidebar-hover: #1e293b;
--bg-sidebar-active: #2563eb;

--text-primary: #0f172a;
--text-secondary: #475569;
--text-muted: #94a3b8;
--text-inverse: #ffffff;
--text-sidebar: #cbd5e1;
--text-sidebar-active: #ffffff;

--border: #e2e8f0;
--border-light: #f1f5f9;

--primary-50: #eff6ff;
--primary-100: #dbeafe;
--primary-500: #3b82f6;
--primary-600: #2563eb;
--primary-700: #1d4ed8;

--success-500: #22c55e;
--success-600: #16a34a;
--warning-500: #f59e0b;
--danger-500: #ef4444;
--danger-600: #dc2626;
--info-500: #06b6d4;

/* Color meanings */
--color-online: #22c55e;
--color-away: #f59e0b;
--color-busy: #ef4444;
--color-offline: #94a3b8;
```

### Typography

```css
/* Font Stack */
--font-main: 'Cairo', 'Noto Sans Arabic', sans-serif;
--font-en: 'Inter', 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;  /* للأكواد والأرقام */

/* Font Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
```

### Spacing

```css
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-5: 1.25rem;  /* 20px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-10: 2.5rem;  /* 40px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
```

### Shadows

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
--shadow-card: 0 1px 3px 0 rgb(0 0 0 / 0.1);
```

### Border Radius

```css
--radius-sm: 0.375rem;  /* 6px */
--radius-md: 0.5rem;    /* 8px */
--radius-lg: 0.75rem;   /* 12px */
--radius-xl: 1rem;      /* 16px */
--radius-full: 9999px;
```

## نظام المكونات (Component System)

### StatsCard (بطاقة إحصائية)

```
┌──────────────────────┐
│ [Icon]           +12%│  ← أيقونة + نسبة التغير
│ إجمالي المستخدمين     │  ← التسمية
│        15,000        │  ← القيمة (عدد كبير، خط كبير)
│ ↑ 234 هذا الأسبوع    │  ← التغير المطلق
└──────────────────────┘
```

**الحالات:**
- Default: قيمة رقمية مع أيقونة
- Loading: Skeleton (شكل مستطيل متحرك)
- Error: رسالة "فشل التحميل" مع زر إعادة المحاولة
- Empty: "0" أو "لا توجد بيانات"
- Trend Up: سهم أخضر مع نسبة موجبة
- Trend Down: سهم أحمر مع نسبة سالبة

### DataTable (جدول بيانات)

```
┌─────────────────────────────────────────────────────────────┐
│ [☐]  الاسم     البريد        الدور     الحالة   الإجراءات  │
│      ↑↓         ↑↓           ↑↓        ↑↓                  │
├─────────────────────────────────────────────────────────────┤
│ [☐]  أحمد علي  ahmed@...    ⚡ عميل   🟢 نشط   [⚙️ ▼]    │
│ [☐]  سارة حسن  sara@...     🔧 مستقل  🟢 نشط   [⚙️ ▼]    │
│ [☐]  خالد عمر  khaled@...   ⚡ عميل   🔴 محظور [⚙️ ▼]    │
│ ...                                                         │
├─────────────────────────────────────────────────────────────┤
│  عرض 1-10 من 150    [← 1 2 3 ... 15 →]    [10 ▼] لكل صفحة │
└─────────────────────────────────────────────────────────────┘
```

**الخصائص:**
- Selectable Rows (مربعات اختيار)
- Sortable Columns (أسهم ترتيب)
- Resizable Columns
- Status Badges ملونة
- Action Dropdown لكل صف
- Batch Actions Bar (تظهر عند تحديد صفوف)
- Empty State (صورة + نص عند عدم وجود بيانات)
- Loading State (Skeleton rows)
- Column visibility toggle
- Pagination (بحجم صفحة قابل للتغيير)
- Export (CSV/PDF)

### FilterBar (شريط التصفية)

```
┌─────────────────────────────────────────────────────────────┐
│ 🔍 [___________]  [الدور ▼]  [الحالة ▼]  [من ▼]  [إلى ▼] │
│ [تطبيق] [إعادة تعيين] [حفظ الفلتر]                         │
└─────────────────────────────────────────────────────────────┘
```

### Modal (نافذة منبثقة)

```
┌──────────────────────────────────────┐
│ [X]  تأكيد حظر المستخدم              │
├──────────────────────────────────────┤
│                                      │
│  هل أنت متأكد من حظر المستخدم       │
│  "أحمد علي"؟                         │
│                                      │
│  السبب:                               │
│  [________________________________]  │
│                                      │
│  المدة: [▼ دائم]                     │
│                                      │
│  ┌────────────────────┐              │
│  │  [إلغاء]  [تأكيد الحظر]          │
│  └────────────────────┘              │
│                                      │
└──────────────────────────────────────┘
```

**أنواع الـ Modals:**
- Confirm (تأكيد إجراء)
- Form (نموذج داخل Modal)
- Alert (تنبيه)
- Fullscreen (لمعاينة المحتوى)
- Slide-over (لوحة جانبية)

### Toast (إشعارات)

```
┌──────────────────────────┐
│ ✅ تم حظر المستخدم بنجاح │
└──────────────────────────┘
```

**أنواع:**
- Success (أخضر)
- Error (أحمر)
- Warning (أصفر)
- Info (أزرق)

### StatusBadge (شارة الحالة)

| النوع | اللون |
|-------|-------|
| Active / نشط | 🟢 أخضر |
| Banned / محظور | 🔴 أحمر |
| Suspended / موقف | 🟠 برتقالي |
| Pending / معلق | 🟡 أصفر |
| Verified / موثق | 🔵 أزرق |
| Open / مفتوح | 🟢 أخضر |
| Closed / مغلق | ⚫ رمادي |
| Resolved / تم الحل | 🟢 أخضر |

### SkeletonLoader (شكل التحميل)

```
┌──────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │  ← شريط متحرك (Shimmer)
│ ▓▓▓▓▓▓▓▓▓▓▓         │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓    │
└──────────────────────┘
```

### Pie/DonutChart (رسم بياني دائري)

```
      ┌─────┐
     ╱       ╲
    │  🟦 45%  │  ← مستقلون
    │  🟩 35%  │  ← عملاء
    │  🟨 15%  │  ← شركات
    │  🟪  5%  │  ← مشرفون
     ╲       ╱
      └─────┘
```

### LineChart (رسم بياني خطي)
- مع تدرج (Area fill)
- خط اتجاه
- نقاط بيانات
- Tooltip عند التحويم
- Legends قابلة للنقر (لإخفاء/إظهار الخطوط)

### BarChart (رسم بياني أعمدة)
- رأسي (Vertical) أو أفقي (Horizontal)
- ألوان متدرجة
- تسميات القيم فوق الأعمدة

## الـ Layout العام

```
┌──────────┬──────────────────────────────────────────────┐
│          │  [☰] [Breadcrumb]        [🔍] [🔔] [🌙] [👤]│
│          ├──────────────────────────────────────────────┤
│ SIDEBAR  │                                              │
│ (ثابت)   │           CONTENT AREA                       │
│          │           (قابل للتمرير)                     │
│ عرض: 250px│                                              │
│          │                                              │
│          │                                              │
│          │                                              │
│          │                                              │
└──────────┴──────────────────────────────────────────────┘
```

- **Sidebar**: عرض ثابت 250px (60px عند الطي)، بلون غامق (Dark sidebar حتى في Light Mode)
- **Top Nav**: ارتفاع 64px، بلون أبيض (Light Mode) أو غامق (Dark Mode)
- **Content**: padding 24px-32px، خلفية `bg-secondary`
- **Cards**: خلفية بيضاء، ظل خفيف، زوايا مدورة (12px)

## الـ Animations والـ Transitions

| العنصر | النوع | المدة | التوقيت |
|--------|------|-------|---------|
| Sidebar toggle | Slide | 300ms | ease-in-out |
| Modal open | Fade + Scale | 200ms | ease-out |
| Dropdown open | Fade + Slide | 150ms | ease-out |
| Page transition | Fade | 200ms | ease-in-out |
| Tooltip | Fade | 100ms | ease-out |
| Toast enter | Slide from top | 300ms | ease-out |
| Toast exit | Fade + Slide up | 200ms | ease-in |
| Hover (cards) | Scale (1.02) | 150ms | ease-out |

## Keyboard Shortcuts

| الاختصار | الإجراء |
|----------|---------|
| `⌘/Ctrl + K` | فتح Global Search |
| `⌘/Ctrl + B` | طي/فتح Sidebar |
| `⌘/Ctrl + ,` | فتح الإعدادات |
| `Esc` | إغلاق Modal/Dropdown |
| `↑ ↓` | التنقل في القوائم المنسدلة |
| `Enter` | تأكيد/tحديد |
| `⌘/Ctrl + N` | إنشاء جديد (حسب السياق) |
| `⌘/Ctrl + S` | حفظ (في النماذج) |
| `?` | عرض اختصارات لوحة المفاتيح |

## الأخطاء الشائعة وطرق معالجتها

| الخطأ | طريقة المعالجة |
|-------|---------------|
| فشل تحميل البيانات | عرض Skeleton → رسالة خطأ مع زر "إعادة المحاولة" |
| Token منتهي | إعادة توجيه تلقائية إلى /admin/login |
| صلاحية غير كافية | عرض صفحة 403 مع رسالة وإخفاء الأزرار غير المسموح بها |
| فشل الحفظ | Toast error + حفظ البيانات في localStorage (مؤقتاً) |
| مهلة الاتصال | Toast warning + إعادة المحاولة تلقائياً |
| 500 Server Error | عرض صفحة خطأ مع Trace ID للإبلاغ |
| بطء في تحميل البيانات | Skeleton + Priority Loading (الأهم أولاً) |
| بيانات فارغة | رسالة "لا توجد بيانات" مع أيقونة وإجراء مقترح |

## تحسين الأداء

1. **Lazy Loading**: تحميل الصفحات والمكونات عند الحاجة فقط
2. **Virtual Scrolling**: للجداول الكبيرة (أكثر من 100 صف)
3. **Debounced Search**: تأخير 300ms في البحث لتقليل الطلبات
4. **Caching**: تخزين مؤقت للبيانات (React Query cache)
5. **Pagination من الخادم**: تحميل البيانات حسب الطلب
6. **Optimistic Updates**: تحديث واجهة المستخدم قبل تأكيد الخادم
7. **Prefetching**: تحميل الصفحات المتوقعة مسبقاً (مثل hover على link)
8. **Code Splitting**: فصل كود الـ Admin عن باقي التطبيق
9. **Image Optimization**: تحميل الصور بشكل متدرج (Progressive) مع Lazy Loading
10. **Bundle Analysis**: مراقبة حجم الحزمة ومنع التضخم
