# Super Admin Dashboard — Backend API Design

## Overview

يتم إضافة وحدة `SuperAdmin` منفصلة تماماً عن وحدات `Auth` و`Admin` الموجودة. جميع مسارات API تكون تحت prefix: `/api/v1/super-admin/`

## هيكل الوحدة (Module Structure)

```
src/modules/super-admin/
├── super-admin.module.ts
├── super-admin.controller.ts
├── super-admin.service.ts
├── guards/
│   ├── super-admin.guard.ts          # يتحقق من صلاحية SUPER_ADMIN
│   └── admin-roles.guard.ts           # يتحقق من الأدوار الديناميكية
├── decorators/
│   ├── admin-user.decorator.ts        # استخراج بيانات المشرف من الطلب
│   └── permissions.decorator.ts        # تحديد الصلاحيات المطلوبة
├── dto/
│   ├── create-role.dto.ts
│   ├── update-role.dto.ts
│   ├── create-admin.dto.ts
│   ├── update-user.dto.ts
│   ├── query-users.dto.ts
│   ├── query-projects.dto.ts
│   ├── resolve-dispute.dto.ts
│   ├── create-subscription-plan.dto.ts
│   ├── update-subscription-plan.dto.ts
│   ├── create-content-page.dto.ts
│   ├── create-blog-post.dto.ts
│   ├── create-faq.dto.ts
│   ├── create-banner.dto.ts
│   ├── platform-settings.dto.ts
│   ├── email-settings.dto.ts
│   ├── security-settings.dto.ts
│   ├── ai-settings.dto.ts
│   └── report-action.dto.ts
└── strategies/
    └── admin-jwt.strategy.ts          # استراتيجية JWT خاصة بالمشرفين
```

## المصادقة (Authentication)

### تدفق تسجيل الدخول الخاص بالمشرفين

```
POST /api/v1/super-admin/auth/login
```

**الخصائص:**
- مسار منفصل تماماً عن `/auth/login` العام
- يتحقق من أن المستخدم لديه دور `SUPER_ADMIN` أو `ADMIN` في جدول `User`
- يتحقق من وجود دور نشط في `AdminUserRole`
- يسجل الدخول في `AdminLoginHistory`
- يدعم Account Lock بعد 5 محاولات فاشلة
- يرجع `accessToken` و `refreshToken` منفصلين عن التوكن العام

**Response:**
```json
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "admin": {
    "id": "uuid",
    "email": "admin@jobilo.com",
    "roles": ["Super Admin"],
    "permissions": ["DASHBOARD_READ", "USERS_READ", ...],
    "profile": { "firstName": "Admin", "lastName": "System" }
  }
}
```

### التحقق من الصلاحيات

```typescript
// admin-roles.guard.ts
@Injectable()
export class AdminPermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<{ module: AdminModule; action: AdminAction }[]>(
      'permissions', context.getHandler(),
    );
    if (!requiredPermissions || requiredPermissions.length === 0) return true;

    const { user } = context.switchToHttp().getRequest();
    const adminRoles = await this.prisma.adminUserRole.findMany({
      where: { userId: user.id },
      include: {
        role: {
          include: { permissions: { include: { permission: true } } },
        },
      },
    });

    const userPermissions = adminRoles.flatMap(ur =>
      ur.role.permissions.map(rp => `${rp.permission.module}_${rp.permission.action}`)
    );

    return requiredPermissions.every(p =>
      userPermissions.includes(`${p.module}_${p.action}`)
    );
  }
}
```

## وحدات API كاملة

### 1. Dashboard (لوحة التحكم)

| الطريقة | المسار | الوصف | الصلاحية |
|---------|--------|-------|----------|
| GET | `/super-admin/dashboard/stats` | إحصائيات رئيسية | DASHBOARD_READ |
| GET | `/super-admin/dashboard/revenue` | بيانات الإيرادات (يومي/شهري/سنوي) | DASHBOARD_READ |
| GET | `/super-admin/dashboard/charts` | بيانات الرسوم البيانية | DASHBOARD_READ |
| GET | `/super-admin/dashboard/recent-registrations` | آخر عمليات التسجيل | DASHBOARD_READ |
| GET | `/super-admin/dashboard/recent-activity` | آخر الأنشطة | DASHBOARD_READ |

**GET /super-admin/dashboard/stats Response:**
```json
{
  "totalUsers": 15000,
  "totalClients": 8000,
  "totalFreelancers": 7000,
  "totalCompanies": 1200,
  "openProjects": 450,
  "completedProjects": 3200,
  "canceledProjects": 180,
  "totalRevenue": 250000.00,
  "dailyRevenue": 1250.00,
  "monthlyRevenue": 37500.00,
  "yearlyRevenue": 250000.00,
  "paidSubscriptions": 850,
  "pendingReports": 23,
  "activeDisputes": 12,
  "totalMessages": 45000,
  "activeUsers": 5200,
  "bannedUsers": 45
}
```

### 2. Auth (المصادقة الإدارية)

| الطريقة | المسار | الوصف | Auth |
|---------|--------|-------|------|
| POST | `/super-admin/auth/login` | تسجيل الدخول | Public |
| POST | `/super-admin/auth/logout` | تسجيل الخروج | Admin JWT |
| POST | `/super-admin/auth/refresh` | تجديد التوكن | Public (Refresh) |
| GET | `/super-admin/auth/sessions` | جلساتي النشطة | Admin JWT |
| DELETE | `/super-admin/auth/sessions/:id` | إنهاء جلسة | Admin JWT |
| GET | `/super-admin/auth/login-history` | سجل تسجيل الدخول | SECURITY_READ |

### 3. Users (إدارة المستخدمين)

| الطريقة | المسار | الوصف | الصلاحية |
|---------|--------|-------|----------|
| GET | `/super-admin/users` | قائمة المستخدمين (بحث/فلترة/ترتيب/Pagination) | USERS_READ |
| GET | `/super-admin/users/:id` | ملف مستخدم كامل | USERS_READ |
| PATCH | `/super-admin/users/:id` | تعديل بيانات المستخدم | USERS_UPDATE |
| PATCH | `/super-admin/users/:id/status` | تغيير الحالة (تفعيل/تعطيل) | USERS_UPDATE |
| POST | `/super-admin/users/:id/ban` | حظر المستخدم | USERS_DELETE |
| POST | `/super-admin/users/:id/unban` | فك الحظر | USERS_UPDATE |
| DELETE | `/super-admin/users/:id` | حذف الحساب | USERS_DELETE |
| POST | `/super-admin/users/:id/reset-password` | إعادة تعيين كلمة المرور | USERS_UPDATE |
| PATCH | `/super-admin/users/:id/role` | تغيير دور المستخدم | USERS_UPDATE |
| POST | `/super-admin/users/:id/notify` | إرسال إشعار | USERS_UPDATE |
| POST | `/super-admin/users/:id/email` | إرسال بريد إلكتروني | USERS_UPDATE |
| GET | `/super-admin/users/:id/activity` | سجل نشاط المستخدم | USERS_READ |
| GET | `/super-admin/users/:id/login-history` | سجل تسجيل دخول المستخدم | SECURITY_READ |

**GET /super-admin/users Query Parameters:**
```
?search=ahmed
&role=FREELANCER|CLIENT|ADMIN
&status=ACTIVE|BANNED|SUSPENDED|DELETED
&verified=true|false
&dateFrom=2026-01-01
&dateTo=2026-06-27
&sortBy=createdAt|lastLoginAt|email
&sortOrder=asc|desc
&page=1
&pageSize=20
```

### 4. Projects (إدارة المشاريع)

| الطريقة | المسار | الوصف | الصلاحية |
|---------|--------|-------|----------|
| GET | `/super-admin/projects` | قائمة المشاريع | PROJECTS_READ |
| GET | `/super-admin/projects/:id` | تفاصيل المشروع | PROJECTS_READ |
| PATCH | `/super-admin/projects/:id` | تعديل المشروع | PROJECTS_UPDATE |
| DELETE | `/super-admin/projects/:id` | حذف المشروع | PROJECTS_DELETE |
| PATCH | `/super-admin/projects/:id/status` | تغيير الحالة (إيقاف/إعادة فتح) | PROJECTS_UPDATE |
| POST | `/super-admin/projects/:id/feature` | تثبيت المشروع | PROJECTS_UPDATE |
| GET | `/super-admin/projects/:id/reports` | البلاغات على المشروع | REPORTS_READ |

### 5. Proposals (إدارة العروض)

| الطريقة | المسار | الوصف | الصلاحية |
|---------|--------|-------|----------|
| GET | `/super-admin/proposals` | قائمة العروض | PROPOSALS_READ |
| GET | `/super-admin/proposals/:id` | تفاصيل العرض | PROPOSALS_READ |
| DELETE | `/super-admin/proposals/:id` | حذف العرض المخالف | PROPOSALS_DELETE |
| PATCH | `/super-admin/proposals/:id/status` | إيقاف/مراجعة العرض | PROPOSALS_UPDATE |

### 6. Disputes (إدارة النزاعات)

| الطريقة | المسار | الوصف | الصلاحية |
|---------|--------|-------|----------|
| GET | `/super-admin/disputes` | قائمة النزاعات | DISPUTES_READ |
| GET | `/super-admin/disputes/:id` | تفاصيل النزاع | DISPUTES_READ |
| POST | `/super-admin/disputes` | إنشاء نزاع (نيابة عن مستخدم) | DISPUTES_CREATE |
| POST | `/super-admin/disputes/:id/resolve` | اتخاذ قرار وحل النزاع | DISPUTES_UPDATE |
| POST | `/super-admin/disputes/:id/close` | إغلاق النزاع | DISPUTES_UPDATE |

**POST /super-admin/disputes/:id/resolve Body:**
```json
{
  "decision": "REFUND_CLIENT",
  "notes": "تم التحقق من التسليم ورفض العميل بدون سبب",
  "refundAmount": 500.00,
  "documents": ["evidence1.pdf", "evidence2.pdf"]
}
```

**قرارات النزاع:**
- `REFUND_CLIENT` — استرداد كامل للعميل
- `RELEASE_FREELANCER` — صرف كامل للمستقل
- `PARTIAL_REFUND` — استرداد جزئي (يحدد المبلغ)
- `CANCEL_CONTRACT` — إلغاء العقد بدون تعويض
- `SPLIT_PAYMENT` — تقسيم المبلغ بين الطرفين

### 7. Reports (إدارة البلاغات)

| الطريقة | المسار | الوصف | الصلاحية |
|---------|--------|-------|----------|
| GET | `/super-admin/reports` | قائمة البلاغات | REPORTS_READ |
| GET | `/super-admin/reports/:id` | تفاصيل البلاغ | REPORTS_READ |
| POST | `/super-admin/reports/:id/review` | مراجعة واتخاذ إجراء | REPORTS_UPDATE |

**POST /super-admin/reports/:id/review Body:**
```json
{
  "action": "WARN_USER | BAN_USER | REMOVE_CONTENT | DISMISS",
  "note": "تحذير للمستخدم مع إزالة المحتوى المخالف",
  "banDuration": null
}
```

### 8. Subscriptions (إدارة الاشتراكات)

| الطريقة | المسار | الوصف | الصلاحية |
|---------|--------|-------|----------|
| GET | `/super-admin/subscriptions/plans` | قائمة الباقات | SUBSCRIPTIONS_READ |
| POST | `/super-admin/subscriptions/plans` | إنشاء باقة جديدة | SUBSCRIPTIONS_CREATE |
| PATCH | `/super-admin/subscriptions/plans/:id` | تعديل الباقة | SUBSCRIPTIONS_UPDATE |
| DELETE | `/super-admin/subscriptions/plans/:id` | حذف الباقة | SUBSCRIPTIONS_DELETE |
| PATCH | `/super-admin/subscriptions/plans/:id/toggle` | تفعيل/تعطيل الباقة | SUBSCRIPTIONS_UPDATE |
| GET | `/super-admin/subscriptions` | جميع الاشتراكات | SUBSCRIPTIONS_READ |
| GET | `/super-admin/subscriptions/:id` | تفاصيل اشتراك | SUBSCRIPTIONS_READ |

### 9. Payments (إدارة المدفوعات)

| الطريقة | المسار | الوصف | الصلاحية |
|---------|--------|-------|----------|
| GET | `/super-admin/payments` | جميع المدفوعات | PAYMENTS_READ |
| GET | `/super-admin/payments/:id` | تفاصيل معاملة | PAYMENTS_READ |
| POST | `/super-admin/payments/:id/refund` | استرداد مبلغ | PAYMENTS_UPDATE |
| GET | `/super-admin/payments/export` | تصدير التقرير المالي (CSV/PDF) | PAYMENTS_READ |

### 10. Content (إدارة المحتوى)

| الطريقة | المسار | الوصف | الصلاحية |
|---------|--------|-------|----------|
| GET | `/super-admin/content/pages` | قائمة الصفحات | CONTENT_READ |
| POST | `/super-admin/content/pages` | إنشاء صفحة | CONTENT_CREATE |
| PATCH | `/super-admin/content/pages/:id` | تعديل الصفحة | CONTENT_UPDATE |
| DELETE | `/super-admin/content/pages/:id` | حذف الصفحة | CONTENT_DELETE |
| GET | `/super-admin/content/blog` | قائمة المقالات | BLOG_READ |
| POST | `/super-admin/content/blog` | إنشاء مقال | BLOG_CREATE |
| PATCH | `/super-admin/content/blog/:id` | تعديل المقال | BLOG_UPDATE |
| DELETE | `/super-admin/content/blog/:id` | حذف المقال | BLOG_DELETE |
| GET | `/super-admin/content/faq-categories` | تصنيفات الأسئلة | FAQ_READ |
| POST | `/super-admin/content/faq-categories` | إنشاء تصنيف | FAQ_CREATE |
| GET | `/super-admin/content/faqs` | الأسئلة الشائعة | FAQ_READ |
| POST | `/super-admin/content/faqs` | إنشاء سؤال | FAQ_CREATE |
| PATCH | `/super-admin/content/faqs/:id` | تعديل سؤال | FAQ_UPDATE |
| DELETE | `/super-admin/content/faqs/:id` | حذف سؤال | FAQ_DELETE |
| GET | `/super-admin/content/banners` | البنرات | BANNERS_READ |
| POST | `/super-admin/content/banners` | إنشاء بانر | BANNERS_CREATE |
| PATCH | `/super-admin/content/banners/:id` | تعديل بانر | BANNERS_UPDATE |
| DELETE | `/super-admin/content/banners/:id` | حذف بانر | BANNERS_DELETE |

### 11. Settings (الإعدادات)

| الطريقة | المسار | الوصف | الصلاحية |
|---------|--------|-------|----------|
| GET | `/super-admin/settings/platform` | إعدادات المنصة | SETTINGS_READ |
| PUT | `/super-admin/settings/platform` | تحديث إعدادات المنصة | SETTINGS_UPDATE |
| GET | `/super-admin/settings/email` | إعدادات البريد | SETTINGS_READ |
| PUT | `/super-admin/settings/email` | تحديث إعدادات البريد | SETTINGS_UPDATE |
| GET | `/super-admin/settings/storage` | إعدادات التخزين | SETTINGS_READ |
| PUT | `/super-admin/settings/storage` | تحديث إعدادات التخزين | SETTINGS_UPDATE |
| GET | `/super-admin/settings/ai` | إعدادات الذكاء الاصطناعي | SETTINGS_READ |
| PUT | `/super-admin/settings/ai` | تحديث إعدادات AI | SETTINGS_UPDATE |
| GET | `/super-admin/settings/notifications` | إعدادات الإشعارات | SETTINGS_READ |
| PUT | `/super-admin/settings/notifications` | تحديث إعدادات الإشعارات | SETTINGS_UPDATE |
| GET | `/super-admin/settings/seo` | إعدادات SEO | SETTINGS_READ |
| PUT | `/super-admin/settings/seo` | تحديث إعدادات SEO | SETTINGS_UPDATE |
| GET | `/super-admin/settings/security` | إعدادات الأمان | SETTINGS_READ |
| PUT | `/super-admin/settings/security` | تحديث إعدادات الأمان | SETTINGS_UPDATE |

### 12. Roles & Permissions (إدارة الأدوار)

| الطريقة | المسار | الوصف | الصلاحية |
|---------|--------|-------|----------|
| GET | `/super-admin/roles` | قائمة الأدوار | ROLES_READ |
| POST | `/super-admin/roles` | إنشاء دور جديد | ROLES_CREATE |
| PATCH | `/super-admin/roles/:id` | تعديل الدور | ROLES_UPDATE |
| DELETE | `/super-admin/roles/:id` | حذف الدور | ROLES_DELETE |
| GET | `/super-admin/roles/:id` | تفاصيل الدور مع الصلاحيات | ROLES_READ |
| PUT | `/super-admin/roles/:id/permissions` | تحديث صلاحيات الدور | ROLES_UPDATE |
| GET | `/super-admin/permissions` | قائمة جميع الصلاحيات المتاحة | ROLES_READ |

### 13. Logs (السجلات)

| الطريقة | المسار | الوصف | الصلاحية |
|---------|--------|-------|----------|
| GET | `/super-admin/logs/audit` | سجل التدقيق | AUDIT_LOGS_READ |
| GET | `/super-admin/logs/login` | سجل تسجيل الدخول | AUDIT_LOGS_READ |
| GET | `/super-admin/logs/errors` | سجل الأخطاء | AUDIT_LOGS_READ |
| GET | `/super-admin/logs/activity` | سجل الأنشطة | AUDIT_LOGS_READ |
| GET | `/super-admin/logs/security` | سجل الأمان | AUDIT_LOGS_READ |
| GET | `/super-admin/logs/export` | تصدير السجلات (CSV/JSON) | AUDIT_LOGS_READ |

### 14. Analytics (التحليلات)

| الطريقة | المسار | الوصف | الصلاحية |
|---------|--------|-------|----------|
| GET | `/super-admin/analytics/overview` | نظرة عامة | ANALYTICS_READ |
| GET | `/super-admin/analytics/users` | تحليلات المستخدمين | ANALYTICS_READ |
| GET | `/super-admin/analytics/revenue` | تحليلات الإيرادات | ANALYTICS_READ |
| GET | `/super-admin/analytics/conversion` | معدلات التحويل | ANALYTICS_READ |
| GET | `/super-admin/analytics/skills` | أكثر المهارات طلباً | ANALYTICS_READ |
| GET | `/super-admin/analytics/top-freelancers` | أكثر المستقلين نشاطاً | ANALYTICS_READ |
| GET | `/super-admin/analytics/top-clients` | أكثر العملاء نشاطاً | ANALYTICS_READ |
| GET | `/super-admin/analytics/traffic` | مصادر الزيارات | ANALYTICS_READ |
| GET | `/super-admin/analytics/growth` | نمو المنصة | ANALYTICS_READ |

### 15. Security (الأمان)

| الطريقة | المسار | الوصف | الصلاحية |
|---------|--------|-------|----------|
| GET | `/super-admin/security/ip-whitelist` | قائمة IP المسموح بها | SECURITY_READ |
| POST | `/super-admin/security/ip-whitelist` | إضافة IP | SECURITY_UPDATE |
| DELETE | `/super-admin/security/ip-whitelist/:id` | حذف IP | SECURITY_UPDATE |
| GET | `/super-admin/security/ip-blacklist` | قائمة IP المحظورة | SECURITY_READ |
| POST | `/super-admin/security/ip-blacklist` | حظر IP | SECURITY_UPDATE |
| DELETE | `/super-admin/security/ip-blacklist/:id` | إلغاء حظر IP | SECURITY_UPDATE |
| GET | `/super-admin/security/devices` | جميع الأجهزة المسجلة | SECURITY_READ |
| POST | `/super-admin/security/devices/:id/revoke` | إلغاء جهاز | SECURITY_UPDATE |
| GET | `/super-admin/security/sessions` | جميع الجلسات النشطة | SECURITY_READ |
| POST | `/super-admin/security/sessions/:id/terminate` | إنهاء جلسة | SECURITY_UPDATE |

## Pagination الموحد

جميع مسارات القائمة تستخدم نموذج Pagination موحد:

**Request:**
```
?page=1&pageSize=20&sortBy=createdAt&sortOrder=desc
```

**Response:**
```json
{
  "data": [...],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "totalCount": 150,
    "totalPages": 8,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

## Error Response الموحد

```json
{
  "success": false,
  "error": {
    "code": "PERMISSION_DENIED",
    "message": "You do not have permission to perform this action",
    "details": null,
    "traceId": "req-uuid"
  }
}
```

## أكواد الأخطاء الخاصة بـ Super Admin

| الكود | المعنى | HTTP Status |
|-------|--------|-------------|
| `ADMIN_NOT_FOUND` | حساب المشرف غير موجود | 404 |
| `ADMIN_ACCOUNT_LOCKED` | الحساب مقفل لكثرة المحاولات الفاشلة | 423 |
| `ADMIN_2FA_REQUIRED` | مطلوب رمز التحقق الثنائي | 403 |
| `PERMISSION_DENIED` | ليس لديك صلاحية كافية | 403 |
| `ROLE_NOT_FOUND` | الدور غير موجود | 404 |
| `ROLE_IS_SYSTEM` | لا يمكن تعديل أو حذف دور النظام | 400 |
| `USER_ALREADY_BANNED` | المستخدم محظور بالفعل | 409 |
| `USER_NOT_BANNED` | المستخدم غير محظور | 400 |
| `CANNOT_DELETE_SELF` | لا يمكن حذف حسابك كمسؤول | 400 |
