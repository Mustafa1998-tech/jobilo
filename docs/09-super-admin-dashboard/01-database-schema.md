# Super Admin Dashboard — Database Schema

## Overview

يستخدم نظام Super Admin جدول `User` الموجود (مع إضافة دور `SUPER_ADMIN`) بالإضافة إلى جداول جديدة مخصصة للإدارة. الفلسفة: لا يتم تعديل الجداول الموجودة إلا عند الضرورة القصوى، وبدلاً من ذلك يتم إنشاء جداول موسعة ترتبط بـ `User` عبر علاقات `1:1` أو `1:n`.

## التعدادات (Enums) الجديدة

```prisma
enum AdminModule {
  DASHBOARD
  USERS
  PROJECTS
  PROPOSALS
  CONTRACTS
  PAYMENTS
  DISPUTES
  REPORTS
  SUBSCRIPTIONS
  CONTENT
  BLOG
  FAQ
  BANNERS
  SETTINGS
  ROLES
  AUDIT_LOGS
  ANALYTICS
  SECURITY
}

enum AdminAction {
  CREATE
  READ
  UPDATE
  DELETE
  APPROVE
  REJECT
  BLOCK
  UNBLOCK
  BAN
  WARN
}

enum ReportStatus {
  PENDING
  INVESTIGATING
  RESOLVED
  DISMISSED
}

enum BanType {
  TEMPORARY
  PERMANENT
}

enum SubscriptionInterval {
  MONTHLY
  QUARTERLY
  YEARLY
}

enum ContentStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

enum AnalyticsMetric {
  PAGE_VIEW
  SIGNUP
  LOGIN
  PROJECT_CREATED
  PROPOSAL_SUBMITTED
  CONTRACT_STARTED
  CONTRACT_COMPLETED
  PAYMENT_MADE
  DISPUTE_OPENED
}
```

## الجداول الجديدة

### 1. AdminProfile - ملف المسؤول الإضافي

```prisma
model AdminProfile {
  id              String   @id @default(uuid()) @db.Uuid
  userId          String   @unique @db.Uuid
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  twoFactorSecret String?  @db.Text
  twoFactorEnabled Boolean @default(false)
  lastLoginIp     String?  @db.VarChar(45)
  lastLoginAt     DateTime?
  lastActivityAt  DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([userId])
  @@map("admin_profiles")
}
```

**السبب**: فصل بيانات المسؤول عن جدول `User` العام لتجنب تلويثه بحقول إدارية بحتة مثل 2FA.

---

### 2. AdminRole - الأدوار الديناميكية

```prisma
model AdminRole {
  id          String   @id @default(uuid()) @db.Uuid
  name        String   @unique @db.VarChar(100)      // "Super Admin", "Finance Manager", إلخ
  nameAr      String?  @db.VarChar(100)               // الاسم بالعربية
  description String?  @db.Text
  isSystem    Boolean  @default(false)                // أدوار النظام لا يمكن حذفها
  priority    Int      @default(0)                    // للأولويات الهرمية
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  permissions AdminRolePermission[]
  users       AdminUserRole[]

  @@index([name])
  @@index([priority])
  @@map("admin_roles")
}
```

**السبب**: أدوار ديناميكية قابلة للتخصيص بالكامل من لوحة التحكم، بدلاً من الأدوار الثابتة في الـ Enum.

---

### 3. AdminPermission - الصلاحيات المفردة

```prisma
model AdminPermission {
  id          String   @id @default(uuid()) @db.Uuid
  module      AdminModule
  action      AdminAction
  description String?  @db.Text
  createdAt   DateTime @default(now())

  roles AdminRolePermission[]

  @@unique([module, action])
  @@index([module])
  @@map("admin_permissions")
}
```

**السبب**: صلاحيات ذرية (module + action) لكل إجراء يمكن تنفيذه في لوحة التحكم.

---

### 4. AdminRolePermission - ربط الأدوار بالصلاحيات

```prisma
model AdminRolePermission {
  roleId       String          @db.Uuid
  role         AdminRole       @relation(fields: [roleId], references: [id], onDelete: Cascade)
  permissionId String          @db.Uuid
  permission   AdminPermission @relation(fields: [permissionId], references: [id], onDelete: Cascade)
  createdAt    DateTime        @default(now())

  @@id([roleId, permissionId])
  @@index([permissionId])
  @@map("admin_role_permissions")
}
```

---

### 5. AdminUserRole - ربط المستخدم بالأدوار الإدارية

```prisma
model AdminUserRole {
  userId    String    @db.Uuid
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  roleId    String    @db.Uuid
  role      AdminRole @relation(fields: [roleId], references: [id], onDelete: Cascade)
  createdAt DateTime  @default(now())

  @@id([userId, roleId])
  @@index([roleId])
  @@map("admin_user_roles")
}
```

**السبب**: المستخدم يمكن أن يكون له أدوار متعددة (مثلاً Admin + Support).

---

### 6. AdminLoginHistory - سجل تسجيل الدخول

```prisma
model AdminLoginHistory {
  id         String   @id @default(uuid()) @db.Uuid
  userId     String   @db.Uuid
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  ipAddress  String   @db.VarChar(45)
  userAgent  String?  @db.Text
  deviceInfo String?  @db.Text
  location   String?  @db.VarChar(255)
  success    Boolean
  failReason String?  @db.VarChar(255)   // "INVALID_PASSWORD", "ACCOUNT_LOCKED", إلخ
  createdAt  DateTime @default(now())

  @@index([userId, createdAt])
  @@index([ipAddress])
  @@index([success])
  @@index([createdAt])
  @@map("admin_login_history")
}
```

**السبب**: التدقيق الأمني وتتبع محاولات الدخول الفاشلة والناجحة.

---

### 7. AdminNotification - إشعارات المشرفين

```prisma
model AdminNotification {
  id        String   @id @default(uuid()) @db.Uuid
  userId    String   @db.Uuid
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  type      String   @db.VarChar(50)     // "NEW_USER", "NEW_DISPUTE", "NEW_REPORT", إلخ
  title     String   @db.VarChar(255)
  titleAr   String?  @db.VarChar(255)
  body      String   @db.Text
  bodyAr    String?  @db.Text
  link      String?  @db.VarChar(500)    // رابط للصفحة المعنية
  isRead    Boolean  @default(false)
  readAt    DateTime?
  createdAt DateTime @default(now())

  @@index([userId, isRead])
  @@index([type])
  @@index([createdAt])
  @@map("admin_notifications")
}
```

**السبب**: إشعارات داخلية للمشرفين عن الأحداث الهامة (بلاغ جديد، نزاع، مستخدم جديد).

---

### 8. AdminActivityLog - سجل أنشطة المشرفين

```prisma
model AdminActivityLog {
  id         String   @id @default(uuid()) @db.Uuid
  userId     String   @db.Uuid
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  action     String   @db.VarChar(100)    // "USER_BLOCKED", "PROJECT_DELETED", إلخ
  module     String   @db.VarChar(50)
  resourceId String?  @db.VarChar(255)    // ID المورد المتأثر
  metadata   Json?    @db.JsonB           // بيانات إضافية (القيم القديمة والجديدة)
  ipAddress  String?  @db.VarChar(45)
  userAgent  String?  @db.Text
  createdAt  DateTime @default(now())

  @@index([userId, createdAt])
  @@index([action])
  @@index([module])
  @@index([resourceId])
  @@index([createdAt])
  @@map("admin_activity_logs")
}
```

**السبب**: تدقيق كامل لكل إجراء يقوم به أي مشرف في النظام.

---

### 9. IpWhitelist - قائمة IP المسموح بها

```prisma
model IpWhitelist {
  id        String   @id @default(uuid()) @db.Uuid
  ipAddress String   @unique @db.VarChar(45)
  label     String?  @db.VarChar(255)
  isActive  Boolean  @default(true)
  createdBy String   @db.Uuid
  creator   User     @relation(fields: [createdBy], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([isActive])
  @@map("ip_whitelist")
}
```

---

### 10. IpBlacklist - قائمة IP المحظورة

```prisma
model IpBlacklist {
  id        String   @id @default(uuid()) @db.Uuid
  ipAddress String   @unique @db.VarChar(45)
  reason    String?  @db.Text
  isActive  Boolean  @default(true)
  createdBy String   @db.Uuid
  creator   User     @relation(fields: [createdBy], references: [id])
  expiresAt DateTime?
  createdAt DateTime @default(now())

  @@index([isActive])
  @@index([expiresAt])
  @@map("ip_blacklist")
}
```

---

### 11. ErrorLog - سجل الأخطاء

```prisma
model ErrorLog {
  id        String   @id @default(uuid()) @db.Uuid
  level     String   @db.VarChar(20)     // "ERROR", "WARNING", "CRITICAL"
  message   String   @db.Text
  stack     String?  @db.Text
  context   Json?    @db.JsonB           // request data, user info, إلخ
  path      String?  @db.VarChar(500)
  method    String?  @db.VarChar(10)
  statusCode Int?
  ipAddress String?  @db.VarChar(45)
  userId    String?  @db.Uuid
  userAgent String?  @db.Text
  resolved  Boolean  @default(false)
  resolvedBy String? @db.Uuid
  resolvedAt DateTime?
  createdAt DateTime @default(now())

  @@index([level])
  @@index([resolved])
  @@index([createdAt])
  @@index([path])
  @@map("error_logs")
}
```

---

### 12. SubscriptionPlan - باقات الاشتراك

```prisma
model SubscriptionPlan {
  id            String              @id @default(uuid()) @db.Uuid
  name          String              @db.VarChar(200)
  nameAr        String?             @db.VarChar(200)
  description   String?             @db.Text
  descriptionAr String?             @db.Text
  price         Decimal             @db.Decimal(10, 2)
  currency      String              @default("USD") @db.VarChar(3)
  interval      SubscriptionInterval
  features      Json?               @db.JsonB       // ["feature1", "feature2"]
  maxProjects   Int?                               // عدد المشاريع المسموح بها
  maxBids       Int?                                // عدد العروض المسموح بها
  commissionRate Decimal?           @db.Decimal(5, 2) // نسبة العمولة المخفضة
  isActive      Boolean             @default(true)
  sortOrder     Int                 @default(0)
  createdAt     DateTime            @default(now())
  updatedAt     DateTime            @updatedAt

  subscriptions Subscription[]

  @@index([isActive, sortOrder])
  @@map("subscription_plans")
}
```

---

### 13. Subscription - اشتراكات المستخدمين

```prisma
model Subscription {
  id              String           @id @default(uuid()) @db.Uuid
  userId          String           @db.Uuid
  user            User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  planId          String           @db.Uuid
  plan            SubscriptionPlan @relation(fields: [planId], references: [id])
  status          String           @db.VarChar(20)  // "ACTIVE", "CANCELED", "EXPIRED", "TRIALING"
  currentPeriodStart DateTime
  currentPeriodEnd   DateTime
  canceledAt      DateTime?
  trialEndsAt     DateTime?
  stripeSubscriptionId String?     @db.VarChar(255)
  paymentMethod   String?          @db.VarChar(50)
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt

  @@index([userId])
  @@index([status])
  @@index([currentPeriodEnd])
  @@map("subscriptions")
}
```

---

### 14. UserReport - البلاغات

```prisma
model UserReport {
  id             String       @id @default(uuid()) @db.Uuid
  reporterId     String       @db.Uuid
  reporter       User         @relation("reporter", fields: [reporterId], references: [id])
  reportedUserId String?      @db.Uuid
  reportedUser   User?        @relation("reportedUser", fields: [reportedUserId], references: [id])
  projectId      String?      @db.Uuid
  project        Project?     @relation(fields: [projectId], references: [id])
  proposalId     String?      @db.Uuid
  proposal       Proposal?    @relation(fields: [proposalId], references: [id])
  messageId      String?      @db.Uuid
  message        Message?     @relation(fields: [messageId], references: [id])
  reason         String       @db.VarChar(100)     // "SPAM", "FRAUD", "ABUSE", "COPYRIGHT", إلخ
  description    String?      @db.Text
  status         ReportStatus @default(PENDING)
  reviewedBy     String?      @db.Uuid
  reviewer       User?        @relation("reviewer", fields: [reviewedBy], references: [id])
  reviewNote     String?      @db.Text
  actionTaken    String?      @db.VarChar(255)     // "WARNING", "BAN", "REMOVED", "DISMISSED"
  resolvedAt     DateTime?
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  @@index([status])
  @@index([reporterId])
  @@index([reportedUserId])
  @@index([createdAt])
  @@map("user_reports")
}
```

---

### 15. ContentPage - صفحات المحتوى

```prisma
model ContentPage {
  id        String         @id @default(uuid()) @db.Uuid
  title     String         @db.VarChar(255)
  titleAr   String?        @db.VarChar(255)
  slug      String         @unique @db.VarChar(200)
  content   String         @db.Text
  contentAr String?        @db.Text
  metaTitle String?        @db.VarChar(255)
  metaDesc  String?        @db.Text
  status    ContentStatus  @default(DRAFT)
  publishedAt DateTime?
  authorId  String         @db.Uuid
  author    User           @relation(fields: [authorId], references: [id])
  createdAt DateTime       @default(now())
  updatedAt DateTime       @updatedAt

  @@index([slug])
  @@index([status])
  @@map("content_pages")
}
```

---

### 16. BlogPost - المدونة

```prisma
model BlogPost {
  id          String         @id @default(uuid()) @db.Uuid
  title       String         @db.VarChar(255)
  titleAr     String?        @db.VarChar(255)
  slug        String         @unique @db.VarChar(200)
  excerpt     String?        @db.Text
  excerptAr   String?        @db.Text
  content     String         @db.Text
  contentAr   String?        @db.Text
  coverImage  String?        @db.VarChar(500)
  tags        String[]       // ["tag1", "tag2"]
  status      ContentStatus  @default(DRAFT)
  publishedAt DateTime?
  authorId    String         @db.Uuid
  author      User           @relation(fields: [authorId], references: [id])
  viewCount   Int            @default(0)
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt

  @@index([slug])
  @@index([status, publishedAt])
  @@index([authorId])
  @@map("blog_posts")
}
```

---

### 17. FaqCategory - تصنيفات الأسئلة الشائعة

```prisma
model FaqCategory {
  id        String   @id @default(uuid()) @db.Uuid
  name      String   @db.VarChar(200)
  nameAr    String?  @db.VarChar(200)
  sortOrder Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  faqs Faq[]

  @@index([sortOrder])
  @@map("faq_categories")
}
```

---

### 18. Faq - الأسئلة الشائعة

```prisma
model Faq {
  id         String       @id @default(uuid()) @db.Uuid
  categoryId String       @db.Uuid
  category   FaqCategory  @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  question   String       @db.Text
  questionAr String?      @db.Text
  answer     String       @db.Text
  answerAr   String?      @db.Text
  sortOrder  Int          @default(0)
  isActive   Boolean      @default(true)
  createdAt  DateTime     @default(now())
  updatedAt  DateTime     @updatedAt

  @@index([categoryId, sortOrder])
  @@index([isActive])
  @@map("faqs")
}
```

---

### 19. Banner - البنرات الإعلانية

```prisma
model Banner {
  id          String   @id @default(uuid()) @db.Uuid
  title       String   @db.VarChar(255)
  titleAr     String?  @db.VarChar(255)
  description String?  @db.Text
  descriptionAr String? @db.Text
  imageUrl    String   @db.VarChar(500)
  linkUrl     String?  @db.VarChar(500)
  position    String   @db.VarChar(50)     // "HOME_TOP", "HOME_MIDDLE", "SIDEBAR", إلخ
  sortOrder   Int      @default(0)
  isActive    Boolean  @default(true)
  startsAt    DateTime?
  endsAt      DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([position, isActive, sortOrder])
  @@index([startsAt, endsAt])
  @@map("banners")
}
```

---

### 20. AnalyticsEvent - أحداث التحليلات

```prisma
model AnalyticsEvent {
  id        String           @id @default(uuid()) @db.Uuid
  metric    AnalyticsMetric
  userId    String?          @db.Uuid
  sessionId String?          @db.VarChar(255)
  ipAddress String?          @db.VarChar(45)
  userAgent String?          @db.Text
  path      String?          @db.VarChar(500)
  referrer  String?          @db.VarChar(500)
  metadata  Json?            @db.JsonB
  createdAt DateTime          @default(now())

  @@index([metric, createdAt])
  @@index([userId])
  @@index([createdAt])
  @@index([path])
  @@map("analytics_events")
}
```

---

### 21. UserDevice - أجهزة المستخدمين

```prisma
model UserDevice {
  id        String   @id @default(uuid()) @db.Uuid
  userId    String   @db.Uuid
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  deviceId  String   @db.VarChar(255)
  platform  String?  @db.VarChar(50)     // "IOS", "ANDROID", "WEB"
  browser   String?  @db.VarChar(100)
  os        String?  @db.VarChar(100)
  ipAddress String?  @db.VarChar(45)
  isTrusted Boolean  @default(false)
  lastUsedAt DateTime @default(now())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([userId, deviceId])
  @@index([userId, lastUsedAt])
  @@index([deviceId])
  @@map("user_devices")
}
```

---

### 22. SecurityLog - سجل الأمان

```prisma
model SecurityLog {
  id          String   @id @default(uuid()) @db.Uuid
  type        String   @db.VarChar(50)     // "LOGIN_FAILED", "PASSWORD_CHANGED", "2FA_ENABLED", "SUSPICIOUS_ACTIVITY"
  severity    String   @db.VarChar(20)     // "LOW", "MEDIUM", "HIGH", "CRITICAL"
  userId      String?  @db.Uuid
  user        User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
  ipAddress   String?  @db.VarChar(45)
  userAgent   String?  @db.Text
  location    String?  @db.VarChar(255)
  details     Json?    @db.JsonB
  createdAt   DateTime @default(now())

  @@index([type])
  @@index([severity])
  @@index([userId])
  @@index([createdAt])
  @@index([ipAddress])
  @@map("security_logs")
}
```

---

## العلاقات مع الجداول الموجودة

```
User
  ├── AdminProfile (1:1)
  ├── AdminUserRole (1:n)
  ├── AdminLoginHistory (1:n)
  ├── AdminNotification (1:n)
  ├── AdminActivityLog (1:n)
  ├── Subscription (1:n)
  ├── UserReport (1:n) [كمبلغ]
  ├── UserReport (1:n) [كمبلغ عنه]
  ├── UserDevice (1:n)
  └── SecurityLog (1:n)

Project
  └── UserReport (1:n) [مشروع مبلغ عنه]

Proposal
  └── UserReport (1:n) [عرض مبلغ عنه]

Message
  └── UserReport (1:n) [رسالة مبلغ عنها]

AdminRole
  ├── AdminRolePermission (1:n)
  └── AdminUserRole (1:n)

AdminPermission
  └── AdminRolePermission (1:n)

FaqCategory
  └── Faq (1:n)

SubscriptionPlan
  └── Subscription (1:n)
```

## ملخص الجداول الجديدة

| # | الجدول | الغرض |
|---|--------|-------|
| 1 | `admin_profiles` | بيانات المسؤول الإضافية (2FA، آخر نشاط) |
| 2 | `admin_roles` | الأدوار الديناميكية القابلة للتخصيص |
| 3 | `admin_permissions` | الصلاحيات الذرية (وحدة + إجراء) |
| 4 | `admin_role_permissions` | ربط الأدوار بالصلاحيات |
| 5 | `admin_user_roles` | ربط المستخدمين بالأدوار |
| 6 | `admin_login_history` | سجل تسجيل الدخول للمشرفين |
| 7 | `admin_notifications` | إشعارات المشرفين |
| 8 | `admin_activity_logs` | سجل أنشطة المشرفين |
| 9 | `ip_whitelist` | قائمة IP المسموح بها |
| 10 | `ip_blacklist` | قائمة IP المحظورة |
| 11 | `error_logs` | سجل أخطاء النظام |
| 12 | `subscription_plans` | باقات الاشتراك |
| 13 | `subscriptions` | اشتراكات المستخدمين |
| 14 | `user_reports` | نظام البلاغات |
| 15 | `content_pages` | صفحات المحتوى (سياسة الخصوصية، إلخ) |
| 16 | `blog_posts` | المدونة |
| 17 | `faq_categories` | تصنيفات الأسئلة الشائعة |
| 18 | `faqs` | الأسئلة الشائعة |
| 19 | `banners` | البنرات الإعلانية |
| 20 | `analytics_events` | أحداث التحليلات |
| 21 | `user_devices` | أجهزة المستخدمين |
| 22 | `security_logs` | سجل الأحداث الأمنية |
