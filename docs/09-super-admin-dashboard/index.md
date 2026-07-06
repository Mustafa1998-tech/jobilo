# Super Admin Dashboard — Jobilo

> **النسخة:** 1.0.0  
> **آخر تحديث:** 27 يونيو 2026  
> **الحالة:** توثيق كامل — بانتظار الموافقة على البدء في التنفيذ

---

## فهرس المحتويات

1. [نظرة عامة](#نظرة-عامة)
2. [المتطلبات التقنية](#المتطلبات-التقنية)
3. [هيكل المشروع](#هيكل-المشروع)
4. [قاعدة البيانات — الجداول الجديدة](./01-database-schema.md)
5. [Backend API — جميع المسارات](./02-backend-api.md)
6. [Frontend Pages — جميع الصفحات والمسارات](./03-frontend-pages.md)
7. [UI/UX — نظام التصميم والمكونات](./04-ui-ux.md)
8. [Security — الأمان و RBAC](./05-security.md)

---

## نظرة عامة

### ما هو Super Admin Dashboard؟

لوحة تحكم منفصلة بالكامل ومخصصة لإدارة منصة Jobilo. هذه اللوحة مخصصة فقط للمستخدمين ذوي دور `SUPER_ADMIN` والمشرفين المعينين عبر نظام RBAC الديناميكي. لا يمكن للمستخدمين العاديين (Freelancer/Client) الوصول إلى هذه اللوحة.

### المبادئ الأساسية

1. **الانفصال التام** — اللوحة منفصلة تماماً عن واجهات المستخدمين العاديين (مسارات، تصميم، صلاحيات، API)
2. **الأمان أولاً** — كل إجراء يتم تسجيله وتدقيقه، وكل طلب يتم التحقق من صلاحيته
3. **المرونة الكاملة** — أدوار ديناميكية قابلة للتخصيص، صلاحيات ذرية، إعدادات قابلة للتغيير
4. **التجربة الحديثة** — تصميم عصري شبيه بـ Stripe/Vercel/Linear مع Dark Mode و RTL
5. **قابلية التوسع** — بنية قابلة للتوسع لإضافة المزيد من الوحدات والميزات مستقبلاً

### من يمكنه استخدام اللوحة؟

| الدور | الوصول |
|-------|--------|
| Super Admin | 🔓 كامل (لا توجد قيود) |
| Admin | 🔓 معظم الوحدات ما عدا الأمان والأدوار |
| Moderator | 🔶 محدود (المستخدمين، المشاريع، البلاغات) |
| Support | 🔶 محدود (المستخدمين، النزاعات، البلاغات) |
| Finance | 🔶 محدود (المدفوعات، الاشتراكات، التحليلات) |
| Content Manager | 🔶 محدود (المحتوى، المدونة، الأسئلة الشائعة) |

---

## المتطلبات التقنية

### Backend

| التقنية | الإصدار | الغرض |
|---------|---------|-------|
| NestJS | ^11.0 | Framework |
| Prisma ORM | ^7.8 | ORM للتواصل مع قاعدة البيانات |
| PostgreSQL | 16 | قاعدة البيانات |
| JWT (jsonwebtoken) | — | إنشاء والتحقق من التوكنات |
| Passport.js | — | استراتيجية JWT للمصادقة |
| Bcrypt | — | تشفير كلمات المرور |
| Helmet | — | حماية الـ HTTP Headers |
| class-validator | — | التحقق من صحة البيانات المدخلة |
| speakeasy | — | توليد رمز 2FA |
| qrcode | — | توليد QR Code لـ 2FA |
| csv-express | — | تصدير البيانات كـ CSV |
| pdfkit | — | تصدير البيانات كـ PDF |

### Frontend

| التقنية | الإصدار | الغرض |
|---------|---------|-------|
| Next.js | ^15.0 | Framework مع App Router |
| React | ^19.0 | مكتبة واجهة المستخدم |
| TypeScript | ^5.7 | Type Safety |
| Tailwind CSS | ^4.0 | التصميم والتنسيق |
| TanStack Query | ^5.0 | إدارة حالة الخادم والتخزين المؤقت |
| Zustand | ^5.0 | إدارة الحالة المحلية |
| React Hook Form | ^7.0 | إدارة النماذج |
| Zod | ^3.0 | التحقق من صحة البيانات |
| Recharts | ^2.0 | الرسوم البيانية |
| Lucide React | — | الأيقونات |
| clsx + tailwind-merge | — | دمج كلاسات CSS |
| cva (class-variance-authority) | — | نظام المكونات |
| React Hot Toast | — | إشعارات Toast |
| date-fns | — | معالجة التواريخ |
| next-intl | ^3.0 | الترجمة (Multi-language) |
| Framer Motion | ^11.0 | الحركات والانتقالات |

---

## هيكل المشروع

### Backend — الوحدة الجديدة

```
backend/src/modules/super-admin/
├── super-admin.module.ts              # وحدة NestJS الرئيسية
├── super-admin.controller.ts          # الـ Controller الرئيسي
├── super-admin.service.ts             # الخدمة الرئيسية
│
├── auth/
│   ├── admin-auth.controller.ts
│   ├── admin-auth.service.ts
│   └── dto/
│       ├── admin-login.dto.ts
│       └── admin-refresh.dto.ts
│
├── dashboard/
│   ├── dashboard.controller.ts
│   └── dashboard.service.ts
│
├── users/
│   ├── admin-users.controller.ts
│   ├── admin-users.service.ts
│   └── dto/
│       ├── admin-query-users.dto.ts
│       ├── admin-update-user.dto.ts
│       ├── admin-ban-user.dto.ts
│       └── admin-send-notification.dto.ts
│
├── projects/
│   ├── admin-projects.controller.ts
│   ├── admin-projects.service.ts
│   └── dto/
│       └── admin-query-projects.dto.ts
│
├── proposals/
│   ├── admin-proposals.controller.ts
│   └── admin-proposals.service.ts
│
├── disputes/
│   ├── admin-disputes.controller.ts
│   ├── admin-disputes.service.ts
│   └── dto/
│       └── resolve-dispute.dto.ts
│
├── reports/
│   ├── admin-reports.controller.ts
│   ├── admin-reports.service.ts
│   └── dto/
│       └── review-report.dto.ts
│
├── subscriptions/
│   ├── admin-subscriptions.controller.ts
│   ├── admin-subscriptions.service.ts
│   └── dto/
│       ├── create-plan.dto.ts
│       └── update-plan.dto.ts
│
├── payments/
│   ├── admin-payments.controller.ts
│   └── admin-payments.service.ts
│
├── content/
│   ├── admin-content.controller.ts
│   ├── admin-content.service.ts
│   └── dto/
│       ├── create-page.dto.ts
│       ├── create-blog-post.dto.ts
│       ├── create-faq.dto.ts
│       └── create-banner.dto.ts
│
├── settings/
│   ├── admin-settings.controller.ts
│   ├── admin-settings.service.ts
│   └── dto/
│       ├── platform-settings.dto.ts
│       ├── email-settings.dto.ts
│       ├── storage-settings.dto.ts
│       ├── ai-settings.dto.ts
│       ├── notification-settings.dto.ts
│       ├── seo-settings.dto.ts
│       └── security-settings.dto.ts
│
├── roles/
│   ├── admin-roles.controller.ts
│   ├── admin-roles.service.ts
│   └── dto/
│       ├── create-role.dto.ts
│       └── update-role.dto.ts
│
├── logs/
│   ├── admin-logs.controller.ts
│   ├── admin-logs.service.ts
│   └── dto/
│       └── query-logs.dto.ts
│
├── analytics/
│   ├── admin-analytics.controller.ts
│   └── admin-analytics.service.ts
│
├── security/
│   ├── admin-security.controller.ts
│   └── admin-security.service.ts
│
├── guards/
│   └── admin.guard.ts                  # يتحقق من دور المستخدم + صلاحياته
│
├── decorators/
│   ├── admin-user.decorator.ts
│   └── permissions.decorator.ts
│
└── common/
    ├── admin-prisma.service.ts         # PrismaService مع أدوات إضافية للمشرف
    └── admin-logger.service.ts         # تسجيل أنشطة المشرفين
```

### Frontend — الصفحات الجديدة

```
frontend/src/app/admin/
├── (auth)/
│   ├── login/page.tsx
│   └── forgot-password/page.tsx
│
├── layout.tsx                          # Layout خاص بالـ Admin (Sidebar + TopNav)
├── page.tsx                            # Dashboard الرئيسي
│
├── users/
│   ├── page.tsx                        # قائمة المستخدمين
│   └── [id]/page.tsx                   # ملف المستخدم
│
├── projects/
│   ├── page.tsx                        # قائمة المشاريع
│   └── [id]/page.tsx                   # تفاصيل المشروع
│
├── proposals/page.tsx                  # قائمة العروض
│
├── disputes/
│   ├── page.tsx                        # قائمة النزاعات
│   └── [id]/page.tsx                   # تفاصيل النزاع + حل النزاع
│
├── reports/page.tsx                    # قائمة البلاغات
│
├── subscriptions/
│   ├── page.tsx                        # اشتراكات المستخدمين
│   └── plans/
│       ├── page.tsx                    # قائمة الباقات
│       ├── new/page.tsx               # إنشاء باقة جديدة
│       └── [id]/edit/page.tsx         # تعديل باقة
│
├── payments/page.tsx                   # قائمة المدفوعات
│
├── content/
│   ├── pages/
│   │   ├── page.tsx                    # قائمة الصفحات
│   │   └── [id]/edit/page.tsx         # تعديل صفحة
│   ├── blog/
│   │   ├── page.tsx                    # قائمة المقالات
│   │   ├── new/page.tsx               # مقال جديد
│   │   └── [id]/edit/page.tsx         # تعديل مقال
│   ├── faq/page.tsx                    # الأسئلة الشائعة
│   └── banners/page.tsx               # البنرات
│
├── settings/
│   ├── general/page.tsx                # إعدادات المنصة
│   ├── email/page.tsx                  # إعدادات البريد
│   ├── storage/page.tsx                # إعدادات التخزين
│   ├── ai/page.tsx                     # إعدادات AI
│   ├── notifications/page.tsx          # إعدادات الإشعارات
│   ├── seo/page.tsx                    # إعدادات SEO
│   └── security/page.tsx               # إعدادات الأمان
│
├── roles/
│   ├── page.tsx                        # قائمة الأدوار
│   └── [id]/page.tsx                   # تفاصيل دور + صلاحياته
│
├── logs/
│   ├── audit/page.tsx                  # سجل التدقيق
│   ├── login/page.tsx                  # سجل تسجيل الدخول
│   ├── errors/page.tsx                 # سجل الأخطاء
│   ├── activity/page.tsx               # سجل الأنشطة
│   └── security/page.tsx               # سجل الأمان
│
├── analytics/page.tsx                  # لوحة التحليلات
│
└── security/
    ├── ip-whitelist/page.tsx           # IP المسموح به
    ├── ip-blacklist/page.tsx           # IP المحظور
    ├── devices/page.tsx                # إدارة الأجهزة
    └── sessions/page.tsx               # إدارة الجلسات
```

### Frontend — المكونات المشتركة الجديدة

```
frontend/src/components/
├── ui/admin/                           # مكونات UI خاصة بـ Admin
│   ├── admin-layout.tsx                # Layout رئيسي (Sidebar + TopNav + Content)
│   ├── admin-sidebar.tsx               # القائمة الجانبية
│   ├── admin-topnav.tsx                # الشريط العلوي
│   ├── admin-breadcrumb.tsx            # مسار التنقل
│   ├── global-search.tsx               # البحث الشامل
│   ├── notification-dropdown.tsx       # قائمة الإشعارات
│   ├── user-menu.tsx                   # قائمة المستخدم
│   ├── admin-stats-card.tsx            # بطاقة إحصائية
│   ├── admin-data-table.tsx            # جدول بيانات
│   ├── admin-filter-bar.tsx            # شريط التصفية
│   ├── admin-modal.tsx                 # نافذة منبثقة
│   ├── admin-confirm-dialog.tsx        # تأكيد إجراء
│   ├── admin-toast.tsx                 # إشعارات
│   ├── admin-status-badge.tsx          # شارة الحالة
│   ├── admin-avatar.tsx                # صورة المستخدم
│   ├── admin-search-input.tsx           # حقل بحث
│   ├── admin-pagination.tsx            # ترقيم الصفحات
│   ├── admin-empty-state.tsx           # حالة فارغة
│   ├── admin-error-state.tsx           # حالة خطأ
│   └── admin-skeleton.tsx              # حالة تحميل
│
├── charts/                             # مكونات الرسوم البيانية
│   ├── revenue-chart.tsx
│   ├── user-growth-chart.tsx
│   ├── skills-chart.tsx
│   ├── conversion-funnel.tsx
│   └── traffic-source-chart.tsx
│
└── forms/                              # مكونات النماذج
    └── admin/
        ├── role-permissions-form.tsx
        ├── platform-settings-form.tsx
        ├── email-settings-form.tsx
        ├── ai-settings-form.tsx
        ├── content-page-form.tsx
        ├── blog-post-form.tsx
        ├── plan-form.tsx
        └── faq-form.tsx
```

### Frontend — الملفات الجديدة في lib

```
frontend/src/lib/
├── api/
│   ├── admin-client.ts                 # Axios instance خاص بـ Admin (baseURL مختلف)
│   └── admin-endpoints.ts              # جميع دوال API الخاصة بـ Admin
│
├── store/
│   └── admin-auth-store.ts             # Zustand store خاص بـ Admin
│
└── utils/
    ├── admin-utils.ts                  # دوال مساعدة للـ Admin
    └── permissions.ts                  # دوال التحقق من الصلاحيات
```

---

## خطة التنفيذ (Implementation Plan)

### المرحلة الأولى: الأساسيات
1. إضافة الجداول الجديدة إلى Prisma schema
2. تشغيل `prisma migrate` لتطبيق الجداول
3. إنشاء وحدة `SuperAdmin` في NestJS
4. إنشاء نظام المصادقة الإدارية (Login, JWT, Guards)
5. إنشاء الـ Layout الأساسي في Frontend (Sidebar + TopNav)
6. إنشاء صفحة Login الإدارية
7. إنشاء صفحة Dashboard الرئيسية

### المرحلة الثانية: الإدارة الأساسية
1. إدارة المستخدمين (CRUD + حظر + بحث)
2. إدارة المشاريع (CRUD + تثبيت)
3. إدارة العروض (مراجعة + حذف)
4. إدارة النزاعات (مراجعة + حل)
5. إدارة البلاغات (مراجعة + إجراء)

### المرحلة الثالثة: الإدارة المتقدمة
1. إدارة الاشتراكات (باقات + اشتراكات)
2. إدارة المدفوعات (معاملات + استرداد + تقارير)
3. إدارة المحتوى (صفحات + مدونة + FAQ + بنرات)
4. الإعدادات (كل أنواع الإعدادات)
5. إدارة الأدوار والصلاحيات

### المرحلة الرابعة: السجلات والأمان
1. صفحة Audit Logs
2. صفحة Error Logs
3. صفحة Activity Logs
4. صفحة Security Logs
5. نظام IP Whitelist/Blacklist
6. إدارة الأجهزة والجلسات

### المرحلة الخامسة: التحليلات والتكميل
1. صفحة Analytics المتقدمة
2. الرسوم البيانية والتصدير
3. Global Search
4. 2FA (مصادقة ثنائية)
5. Dashboard Customization
6. Keyboard Shortcuts
7. Export Logs

---

## بنود لم تناقش بعد (تحتاج قرار)

1. **هل نستخدم نفس User model مع دور SUPER_ADMIN أم ننشئ جدول Admin منفصل؟**
   - **المقترح:** استخدام نفس الـ User model (لأنه موجود بالفعل وبه الدور المطلوب)
2. **هل نستخدم نفس JWT secret للـ Admin أم secret منفصل؟**
   - **المقترح:** استخدام JWT secret منفصل لإضافة طبقة أمان إضافية
3. **هل تكون واجهة الـ Admin في نفس مشروع Frontend أم مشروع منفصل؟**
   - **المقترح:** نفس مشروع Frontend ولكن تحت مسار منفصل `/admin` مع Lazy Loading
4. **هل نضيف 2FA في المرحلة الأولى أم الثانية؟**
   - **المقترح:** المرحلة الثانية (بعد استقرار النظام الأساسي)

---

> **ملاحظة:** هذا المستند شامل وكامل. بمجرد الموافقة، سيتم البدء في التنفيذ حسب الخطة أعلاه.
