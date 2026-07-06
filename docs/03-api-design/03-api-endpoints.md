# Jobilo - Complete API Endpoints

---

## Module: Auth (`/api/v1/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | Public | تسجيل مستخدم جديد |
| POST | `/auth/login` | Public | تسجيل الدخول |
| POST | `/auth/logout` | Protected | تسجيل الخروج |
| POST | `/auth/refresh` | Public (Cookie) | تجديد token |
| POST | `/auth/verify-email` | Public | تأكيد البريد الإلكتروني |
| POST | `/auth/resend-verification` | Public | إعادة إرسال رمز التأكيد |
| POST | `/auth/forgot-password` | Public | طلب إعادة تعيين كلمة السر |
| POST | `/auth/reset-password` | Public | إعادة تعيين كلمة السر |
| POST | `/auth/change-password` | Protected | تغيير كلمة السر |
| GET | `/auth/sessions` | Protected | عرض الجلسات النشطة |
| DELETE | `/auth/sessions/:id` | Protected | إنهاء جلسة |
| DELETE | `/auth/sessions` | Protected | إنهاء جميع الجلسات |

### POST /auth/register
```json
{
  "email": "user@example.com",
  "password": "StrongPass1",
  "confirmPassword": "StrongPass1",
  "firstName": "أحمد",
  "lastName": "عبدالله",
  "role": "FREELANCER",
  "agreeToTerms": true,
  "locale": "ar"
}
```

### POST /auth/login
```json
{
  "email": "user@example.com",
  "password": "StrongPass1",
  "rememberMe": false
}
```
**Response:**
```json
{
  "accessToken": "jwt-token...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "FREELANCER",
    "status": "ACTIVE",
    "profile": { "firstName": "أحمد", "lastName": "عبدالله" }
  }
}
```

---

## Module: Users (`/api/v1/users`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/users/me` | Protected | عرض ملفي الشخصي |
| PATCH | `/users/me` | Protected | تحديث ملفي الشخصي |
| DELETE | `/users/me` | Protected | حذف حسابي |
| GET | `/users/:id` | Public | عرض ملف مستخدم |
| GET | `/users/:id/portfolio` | Public | عرض أعمال المستخدم |
| GET | `/users/:id/reviews` | Public | عرض تقييمات المستخدم |
| PATCH | `/users/:id/role` | Admin | تغيير دور المستخدم |
| PATCH | `/users/:id/status` | Admin | تغيير حالة المستخدم |
| POST | `/users/:id/verify` | Admin | توثيق المستخدم |
| GET | `/users` | Admin | قائمة المستخدمين |

### PATCH /users/me (Freelancer)
```json
{
  "firstName": "أحمد",
  "lastName": "عبدالله",
  "title": "Full Stack Developer",
  "bio": "مطور ويب بخبرة 3 سنوات...",
  "hourlyRate": 25.00,
  "experienceLevel": "ADVANCED",
  "languages": ["ar", "en"],
  "availableForHire": true,
  "skills": [
    { "skillId": "uuid", "level": "ADVANCED", "isTop": true },
    { "skillId": "uuid", "level": "INTERMEDIATE" }
  ]
}
```

### PATCH /users/me (Client)
```json
{
  "companyName": "شركة تقنية",
  "companyWebsite": "https://tech.com",
  "companySize": "11-50",
  "industry": "Technology",
  "description": "شركة رائدة في..."
}
```

### GET /users (Admin)
| Query | Type | Description |
|-------|------|-------------|
| page | number | الصفحة |
| pageSize | number | عدد العناصر |
| role | UserRole | تصفية حسب الدور |
| status | UserStatus | تصفية حسب الحالة |
| search | string | بحث بالاسم أو البريد |
| sortBy | string | createdAt, email, role |
| sortOrder | asc/desc | |

---

## Module: Projects (`/api/v1/projects`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/projects` | Public | قائمة المشاريع |
| GET | `/projects/featured` | Public | مشاريع مميزة |
| POST | `/projects` | Client | إنشاء مشروع |
| GET | `/projects/:id` | Public | تفاصيل المشروع |
| PATCH | `/projects/:id` | Client | تحديث المشروع |
| DELETE | `/projects/:id` | Client | حذف المشروع |
| PATCH | `/projects/:id/status` | Client | تغيير حالة المشروع |
| POST | `/projects/:id/feature` | Admin | ترقية المشروع |
| POST | `/projects/:id/bookmark` | Protected | حفظ المشروع |
| DELETE | `/projects/:id/bookmark` | Protected | إزالة من المحفوظات |
| POST | `/projects/:id/report` | Protected | الإبلاغ عن مشروع |
| GET | `/projects/:id/proposals` | Client | عروض المشروع |
| GET | `/projects/:id/similar` | Public | مشاريع مشابهة |

### POST /projects
```json
{
  "title": "تطوير موقع إلكتروني بـ React",
  "description": "أحتاج مطور Frontend لبناء موقع...",
  "categoryId": "uuid",
  "projectType": "FIXED",
  "budgetMin": 500,
  "budgetMax": 1000,
  "durationDays": 30,
  "experienceLevel": "INTERMEDIATE",
  "skills": [
    { "skillId": "uuid", "level": "ADVANCED" },
    { "skillId": "uuid", "level": "INTERMEDIATE" }
  ],
  "attachments": [
    { "fileUrl": "https://cloudinary.com/...", "fileName": "brief.pdf", "fileType": "DOCUMENT" }
  ],
  "isUrgent": false,
  "location": "remote"
}
```

### GET /projects (Query Parameters)
| Query | Type | Description |
|-------|------|-------------|
| search | string | بحث في العنوان والوصف |
| categoryId | UUID | تصفية حسب التصنيف |
| skillIds | UUID[] | تصفية حسب المهارات |
| status | ProjectStatus | الحالة (default: OPEN) |
| projectType | FIXED/HOURLY | نوع المشروع |
| budgetMin | number | أقل ميزانية |
| budgetMax | number | أعلى ميزانية |
| durationMin | number | أقل مدة (أيام) |
| durationMax | number | أقصى مدة (أيام) |
| experienceLevel | SkillLevel | مستوى الخبرة المطلوب |
| location | string | الموقع |
| isUrgent | boolean | مشاريع عاجلة فقط |
| sortBy | string | budgetMax, createdAt, proposalsCount |
| sortOrder | asc/desc | ترتيب |
| page | number | الصفحة |
| pageSize | number | العناصر لكل صفحة (max 100) |

---

## Module: Proposals (`/api/v1/proposals`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/projects/:id/proposals` | Freelancer | تقديم عرض |
| GET | `/proposals` | Protected | عروضي |
| GET | `/proposals/:id` | Protected | تفاصيل العرض |
| PATCH | `/proposals/:id` | Freelancer | تعديل العرض |
| DELETE | `/proposals/:id` | Freelancer | سحب العرض |
| PATCH | `/proposals/:id/accept` | Client | قبول العرض |
| PATCH | `/proposals/:id/reject` | Client | رفض العرض |
| PATCH | `/proposals/:id/shortlist` | Client | إضافة للقائمة المختصرة |

### POST /projects/:id/proposals
```json
{
  "coverLetter": "أنا مطور React بخبرة 3 سنوات...",
  "bidAmount": 750.00,
  "durationDays": 25,
  "attachments": [
    { "fileUrl": "https://...", "fileName": "portfolio.pdf", "fileType": "DOCUMENT" }
  ]
}
```

---

## Module: Contracts (`/api/v1/contracts`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/contracts` | Client | إنشاء عقد (عند قبول عرض) |
| GET | `/contracts` | Protected | قائمة العقود |
| GET | `/contracts/:id` | Protected | تفاصيل العقد |
| POST | `/contracts/:id/sign` | Protected | توقيع العقد |
| POST | `/contracts/:id/cancel` | Protected | إلغاء العقد |
| POST | `/contracts/:id/complete` | Protected | اكتمال العقد |
| POST | `/contracts/:id/milestones` | Client | إضافة milestone |
| PATCH | `/contracts/:id/milestones/:mid` | Client | تعديل milestone |
| POST | `/contracts/:id/milestones/:mid/submit` | Freelancer | تسليم milestone |
| POST | `/contracts/:id/milestones/:mid/approve` | Client | قبول milestone |

### POST /contracts
```json
{
  "proposalId": "uuid",
  "projectId": "uuid",
  "freelancerId": "uuid",
  "totalAmount": 750.00,
  "platformFee": 37.50,
  "terms": "شروط العقد...",
  "milestones": [
    {
      "title": "المرحلة الأولى - التصميم",
      "description": "تصميم واجهات المستخدم",
      "amount": 300.00,
      "dueDate": "2026-08-01T00:00:00Z",
      "sortOrder": 1
    },
    {
      "title": "المرحلة الثانية - التطوير",
      "description": "تطوير الواجهات",
      "amount": 450.00,
      "dueDate": "2026-08-15T00:00:00Z",
      "sortOrder": 2
    }
  ]
}
```

---

## Module: Payments (`/api/v1/payments`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/payments/escrow/fund` | Client | إيداع في escrow |
| POST | `/payments/escrow/release` | Client | تحرير المبلغ |
| POST | `/payments/escrow/refund` | Admin | استرداد المبلغ |
| GET | `/payments/transactions` | Protected | سجل المعاملات |
| GET | `/payments/transactions/:id` | Protected | تفاصيل المعاملة |
| GET | `/payments/wallet` | Protected | رصيد المحفظة |
| POST | `/payments/withdraw` | Protected | سحب الأموال |
| POST | `/payments/accounts` | Protected | إضافة وسيلة سحب |
| GET | `/payments/accounts` | Protected | وسائل السحب |
| DELETE | `/payments/accounts/:id` | Protected | حذف وسيلة سحب |
| GET | `/payments/invoices/:id` | Protected | تحميل الفاتورة |

### POST /payments/escrow/fund
```json
{
  "contractId": "uuid",
  "milestoneId": "uuid", // optional (fund specific milestone)
  "amount": 750.00,
  "paymentMethodId": "stripe-payment-method-id"
}
```

### POST /payments/withdraw
```json
{
  "amount": 500.00,
  "paymentAccountId": "uuid"
}
```

---

## Module: Messages (`/api/v1/messages`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/messages/conversations` | Protected | قائمة المحادثات |
| GET | `/messages/conversations/:userId` | Protected | محادثة مع مستخدم |
| GET | `/messages/projects/:projectId` | Protected | محادثة المشروع |
| POST | `/messages` | Protected | إرسال رسالة |
| PATCH | `/messages/:id/read` | Protected | تحديد كمقروء |
| POST | `/messages/:id/report` | Protected | الإبلاغ عن رسالة |
| DELETE | `/messages/:id` | Protected | حذف رسالة |

### POST /messages
```json
{
  "receiverId": "uuid",
  "projectId": "uuid", // optional
  "content": "مرحباً، أنا مهتم بمشروعك...",
  "attachments": [
    { "fileUrl": "https://...", "fileName": "image.jpg", "fileType": "IMAGE" }
  ]
}
```

**WebSocket Events:**
| Event | Direction | Payload |
|-------|-----------|---------|
| `message:send` | Client → Server | Message data |
| `message:new` | Server → Client | New message |
| `message:read` | Server → Client | Read receipt |
| `typing:start` | Client → Server | Conversation ID |
| `typing:stop` | Client → Server | Conversation ID |

---

## Module: Reviews (`/api/v1/reviews`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/contracts/:id/review` | Protected | إرسال تقييم |
| GET | `/reviews/users/:userId` | Public | تقييمات مستخدم |
| GET | `/reviews/:id` | Public | تفاصيل تقييم |
| POST | `/reviews/:id/flag` | Protected | الإبلاغ عن تقييم |
| DELETE | `/reviews/:id` | Admin | حذف تقييم |

### POST /contracts/:id/review
```json
{
  "rating": 5,
  "quality": 5,
  "communication": 4,
  "adherence": 5,
  "timeliness": 4,
  "comment": "عمل ممتاز، تعاون رائع والتزم بالوقت"
}
```

---

## Module: Notifications (`/api/v1/notifications`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/notifications` | Protected | قائمة الإشعارات |
| PATCH | `/notifications/:id/read` | Protected | تحديد كمقروء |
| PATCH | `/notifications/read-all` | Protected | تحديد الكل مقروء |
| GET | `/notifications/settings` | Protected | إعدادات الإشعارات |
| PATCH | `/notifications/settings` | Protected | تحديث الإعدادات |

---

## Module: Categories & Skills

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/categories` | Public | قائمة التصنيفات |
| GET | `/categories/:id` | Public | تفاصيل تصنيف |
| POST | `/categories` | Admin | إنشاء تصنيف |
| PATCH | `/categories/:id` | Admin | تعديل تصنيف |
| DELETE | `/categories/:id` | Admin | حذف تصنيف |
| GET | `/skills` | Public | قائمة المهارات |
| GET | `/skills/:id` | Public | تفاصيل مهارة |
| POST | `/skills` | Admin | إنشاء مهارة |
| PATCH | `/skills/:id` | Admin | تعديل مهارة |

---

## Module: Admin (`/api/v1/admin`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/dashboard` | Admin | لوحة التحكم الرئيسية |
| GET | `/admin/users` | Admin | إدارة المستخدمين |
| GET | `/admin/users/:id` | Admin | تفاصيل مستخدم |
| PATCH | `/admin/users/:id/status` | Admin | تغيير حالة مستخدم |
| POST | `/admin/users/:id/verify` | Admin | توثيق مستخدم |
| GET | `/admin/projects` | Admin | إدارة المشاريع |
| GET | `/admin/projects/:id` | Admin | تفاصيل مشروع |
| PATCH | `/admin/projects/:id/status` | Admin | تغيير حالة مشروع |
| POST | `/admin/projects/:id/feature` | Admin | ترقية مشروع |
| GET | `/admin/disputes` | Admin | إدارة النزاعات |
| GET | `/admin/disputes/:id` | Admin | تفاصيل نزاع |
| POST | `/admin/disputes/:id/resolve` | Admin | حل نزاع |
| GET | `/admin/reports` | Admin | التقارير |
| GET | `/admin/audit-logs` | Admin | سجل التدقيق |
| GET | `/admin/settings` | Admin | إعدادات المنصة |
| PATCH | `/admin/settings` | SuperAdmin | تحديث الإعدادات |

### GET /admin/dashboard
**Response:**
```json
{
  "overview": {
    "totalUsers": 5000,
    "activeUsers": 3200,
    "totalProjects": 1200,
    "openProjects": 450,
    "totalTransactions": 850,
    "totalRevenue": 25000.00,
    "pendingDisputes": 5
  },
  "charts": {
    "usersGrowth": [...],
    "projectsGrowth": [...],
    "revenueGrowth": [...]
  },
  "recentUsers": [...],
  "recentProjects": [...],
  "recentDisputes": [...]
}
```

---

## Module: AI (`/api/v1/ai`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/ai/generate-proposal` | Freelancer | كتابة عرض باستخدام AI |
| POST | `/ai/improve-profile` | Freelancer | تحسين الملف الشخصي |
| POST | `/ai/suggest-skills` | Freelancer | اقتراح مهارات |
| POST | `/ai/recommend-freelancers` | Client | اقتراح مستقلين |
| POST | `/ai/recommend-projects` | Freelancer | اقتراح مشاريع |
| POST | `/ai/analyze-project` | Client | تحليل مشروع |
| POST | `/ai/translate` | Protected | ترجمة نص |
| POST | `/ai/fraud-check` | Protected | كشف احتيال |
| GET | `/ai/matches` | Protected | قائمة التوصيات |

### POST /ai/generate-proposal
```json
{
  "projectId": "uuid",
  "tone": "professional",
  "includePortfolio": true,
  "keyPoints": ["React", "Node.js", "MongoDB"]
}
```
**Response:**
```json
{
  "proposal": "عزيزي العميل، أنا مطور Full Stack بخبرة...",
  "suggestedPrice": 750,
  "suggestedDuration": 25,
  "matchScore": 95,
  "highlights": ["مطابقة للمهارات بنسبة 95%", "..."]
}
```

---

## Module: Files (`/api/v1/files`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/files/upload` | Protected | رفع ملف |
| POST | `/files/upload-multiple` | Protected | رفع عدة ملفات |
| DELETE | `/files/:id` | Protected | حذف ملف |

### POST /files/upload
```
Content-Type: multipart/form-data
file: <binary>
type: IMAGE|DOCUMENT|VIDEO
```

**Response:**
```json
{
  "url": "https://res.cloudinary.com/...",
  "publicId": "cloudinary-public-id",
  "fileName": "image.jpg",
  "fileType": "IMAGE",
  "fileSize": 1024000,
  "width": 1200,
  "height": 800
}
```

---

## Module: Platform Settings (`/api/v1/settings`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/settings` | Public | إعدادات عامة |
| PATCH | `/settings/notifications` | Protected | إعدادات الإشعارات |
| PATCH | `/settings/profile` | Protected | إعدادات الملف الشخصي |
| PATCH | `/settings/privacy` | Protected | إعدادات الخصوصية |
| DELETE | `/settings/account` | Protected | حذف الحساب |

---

## API Response Times (Targets)

| Endpoint Type | p50 | p95 | p99 |
|--------------|-----|-----|-----|
| Auth (login/register) | 200ms | 500ms | 1000ms |
| List endpoints | 100ms | 300ms | 500ms |
| Detail endpoints | 50ms | 200ms | 400ms |
| Create/Update | 150ms | 400ms | 800ms |
| Search | 200ms | 500ms | 1000ms |
| AI endpoints | 2000ms | 5000ms | 10000ms |
| File upload | 1000ms | 3000ms | 5000ms |
| WebSocket message | 50ms | 100ms | 200ms |
