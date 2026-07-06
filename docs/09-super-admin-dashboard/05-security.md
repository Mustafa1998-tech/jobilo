# Super Admin Dashboard — Security & RBAC

## نظرة عامة على الأمان

لوحة Super Admin تتعامل مع بيانات حساسة جداً ولها صلاحيات كاملة على المنصة. لذلك، الأمان هو الأولوية القصوى في التصميم.

## طبقات الأمان (Defense in Depth)

```
┌─────────────────────────────────────────────────────┐
│ Layer 1: Network Security                           │
│ - Rate Limiting (100 req/min للـ Admin)             │
│ - IP Whitelist                                      │
│ - IP Blacklist                                      │
│ - Cloudflare WAF (في مرحلة الإنتاج)                 │
├─────────────────────────────────────────────────────┤
│ Layer 2: Authentication                             │
│ - JWT Access Token (15 دقيقة)                       │
│ - JWT Refresh Token (7 أيام)                        │
│ - 2FA (TOTP - في المرحلة الثانية)                   │
│ - Session Management                                │
│ - Account Lock بعد 5 محاولات فاشلة                  │
├─────────────────────────────────────────────────────┤
│ Layer 3: Authorization                              │
│ - RBAC (أدوار ديناميكية)                            │
│ - Granular Permissions (وحدة + إجراء)               │
│ - Route Protection (Guards)                         │
│ - API Scope Validation                              │
├─────────────────────────────────────────────────────┤
│ Layer 4: Application Security                       │
│ - Helmet.js (HTTP Headers)                          │
│ - CSRF Protection                                   │
│ - XSS Prevention (Input Sanitization)               │
│ - SQL Injection Protection (Prisma ORM)             │
│ - Parameter Pollution Prevention                    │
├─────────────────────────────────────────────────────┤
│ Layer 5: Monitoring & Audit                         │
│ - Audit Logs (كل إجراء)                             │
│ - Security Logs (كل حدث أمني)                       │
│ - Error Logs                                        │
│ - Activity Logs                                     │
│ - Real-time Alerts                                  │
└─────────────────────────────────────────────────────┘
```

## RBAC (Role-Based Access Control)

### هيكلية الأدوار

النظام يستخدم أدوار ديناميكية (وليست static enum) يمكن إنشاؤها وتعديلها من لوحة التحكم.

### الأدوار الافتراضية عند التثبيت

| الدور | الوصف | الصلاحيات الكلية |
|-------|-------|------------------|
| **Super Admin** | صلاحية كاملة لكل شيء (لا يمكن حذفه) | جميع الصلاحيات |
| **Admin** | إدارة المنصة بدون صلاحيات الأمان والأدوار | Dashboard, Users, Projects, Proposals, Contracts, Disputes, Reports, Subscriptions, Payments, Content, Blog, FAQ, Banners, Settings, Analytics, Audit Logs |
| **Moderator** | مراقبة المحتوى والمستخدمين | Users (read/update), Projects (read/update), Proposals (read/update), Reports (read/review), Content (read/update) |
| **Support** | دعم العملاء | Users (read), Disputes (read/create), Reports (read/review) |
| **Finance** | إدارة الشؤون المالية | Payments (read/refund), Subscriptions (read), Analytics (read) |
| **Content Manager** | إدارة المحتوى فقط | Content (read/create/update/delete), Blog (read/create/update/delete), FAQ (read/create/update/delete), Banners (read/create/update/delete) |

### مصفوفة الصلاحيات الكاملة

| الوحدة (Module) | الإجراءات (Actions) |
|-----------------|---------------------|
| DASHBOARD | READ |
| USERS | READ, CREATE, UPDATE, DELETE |
| PROJECTS | READ, UPDATE, DELETE |
| PROPOSALS | READ, UPDATE, DELETE |
| CONTRACTS | READ, UPDATE, DELETE, APPROVE |
| PAYMENTS | READ, UPDATE (refund) |
| DISPUTES | READ, CREATE, UPDATE (resolve) |
| REPORTS | READ, UPDATE (review) |
| SUBSCRIPTIONS | READ, CREATE, UPDATE, DELETE |
| CONTENT | READ, CREATE, UPDATE, DELETE |
| BLOG | READ, CREATE, UPDATE, DELETE |
| FAQ | READ, CREATE, UPDATE, DELETE |
| BANNERS | READ, CREATE, UPDATE, DELETE |
| SETTINGS | READ, UPDATE |
| ROLES | READ, CREATE, UPDATE, DELETE |
| AUDIT_LOGS | READ |
| ANALYTICS | READ |
| SECURITY | READ, UPDATE |

### تدفق التحقق من الصلاحية

```typescript
// 1. يأخذ JWT (Super Admin signed)
// 2. JwtStrategy يتحقق من صحة التوكن ويبحث عن المستخدم
// 3. AdminRolesGuard يتحقق من وجود دور نشط للمستخدم
// 4. AdminPermissionsGuard يتحقق من الصلاحية المطلوبة للـ Route
// 5. المسموح → يتم معالجة الطلب
// 6. غير مسموح → 403 Forbidden

// مثال على Decorator للتحقق من الصلاحيات:
@Permissions({ module: AdminModule.USERS, action: AdminAction.DELETE })
```

### إدارة الأدوار في قاعدة البيانات

لقاء إنشاء دور جديد:

```
1. يُدخل الاسم والوصف
2. يختار الصلاحيات من المصفوفة
3. يُحفظ: AdminRole + AdminRolePermissions
4. يصبح الدور متاحاً لتعيينه لأي مشرف
5. يتم تسجيل الإجراء في AdminActivityLog
```

## Account Security

### Account Lock

```
المشرف يدخل بياناته ← 5 محاولات فاشلة ← الحساب يُقفل لمدة 15 دقيقة
                                                                  ↓
                                                     يسجل في AdminLoginHistory
                                                     و SecurityLog
                                                                  ↓
                                          بعد 15 دقيقة ← يفتح الحساب تلقائياً
                                          (أو يمكن لـ Super Admin فتحه يدوياً)
```

### 2FA (Two-Factor Authentication) — المرحلة الثانية

```
المشرف يدخل البريد وكلمة المرور ← التحقق ← طلب رمز 2FA ←
                                                           ↓
                                          يدخل الرمز من Google Authenticator
                                                           ↓
                                          تم تسجيل الدخول بنجاح
```

**تخزين 2FA:**
- Secret مخزن في `AdminProfile.twoFactorSecret` (مشفر AES-256)
- QR Code يُعرض مرة واحدة فقط عند التفعيل
- 10 Recovery Codes (تُحفظ كـ bcrypt hash)

### Session Management

```
كل تسجيل دخول يُنشئ جلسة جديدة مع:
- Access Token (15 دقيقة)
- Refresh Token (7 أيام)
- Device Info (browser, OS, IP)
- Location (تقديري)

المشرف يمكنه:
- عرض جميع جلساته النشطة
- إنهاء جلسة معينة
- إنهاء جميع الجلسات
- رؤية الجهاز والموقع والتاريخ

الإنهاء التلقائي للجلسة عند:
- تغيير كلمة المرور
- تفعيل 2FA
- حظر الحساب
- حذف الحساب
```

### Password Policy

```
- الحد الأدنى: 12 حرف
- يجب أن تحتوي على: حرف كبير، حرف صغير، رقم، رمز خاص
- لا يمكن تكرار آخر 5 كلمات مرور
- صلاحية كلمة المرور: 90 يوم
- إشعار قبل 7 أيام من انتهاء الصلاحية
- تفعيل إجباري لكلمة مرور قوية (عن طريق zxcvbn)
```

## API Security

### Rate Limiting

```
المسار العام: 100 req/min
مسارات الـ Admin: 60 req/min (مقسمة على كل مسار)
مسارات الـ Login: 5 req/min لكل IP
مسارات الـ API Keys: 1000 req/min
```

### CORS

```
مسموح فقط بالـ Origins المحددة في الإعدادات:
- http://localhost:3000 (تطوير)
- https://admin.jobilo.com (إنتاج)
```

### HTTP Headers (Helmet.js)

```
Content-Security-Policy: default-src 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

### CSRF Protection

```
- SameSite=Strict على جميع الـ Cookies
- CSRF Token في الـ Headers للطلبات غير الآمنة
- Validate Referer/Origin Header
```

### Input Validation

```
- Validator Pipes على جميع الـ DTOs (whitelist, forbidNonWhitelisted)
- Sanitize HTML في المحتوى المدخل (HTML Sanitizer)
- Parameterized Queries عبر Prisma
- Request Size Limit: 10MB
- Timeout: 30s للطلبات العادية، 120s للتقارير
```

## IP Security

### IP Whitelist

```
إذا كانت قائمة IP المسموح بها غير فارغة، يتم رفض أي طلب من IP خارج القائمة.
- يُستخدم لتقييد الدخول إلى VPN الشركة أو IP المكتب
- يمكن تعطيل الميزة بالكامل
```

### IP Blacklist

```
يتم رفض أي طلب من IP في القائمة السوداء فوراً.
- يُستخدم لحظر IPs الضارة
- يمكن إضافة IP مع سبب ومدة (أو دائم)
```

## Logging & Monitoring

### Audit Log (سجل التدقيق)

يسجل كل إجراء يقوم به أي مشرف:

```json
{
  "userId": "uuid",
  "action": "USER_BLOCKED",
  "module": "USERS",
  "resourceId": "user-uuid",
  "metadata": {
    "previousStatus": "ACTIVE",
    "newStatus": "BANNED",
    "reason": "Multiple violations of TOS"
  },
  "ipAddress": "192.168.1.1",
  "createdAt": "2026-06-27T14:30:00Z"
}
```

### Security Log (سجل الأمان)

يسجل الأحداث الأمنية الهامة:

| النوع | الخطورة | الوصف |
|-------|---------|-------|
| LOGIN_FAILED | MEDIUM | محاولة دخول فاشلة |
| ACCOUNT_LOCKED | HIGH | الحساب مقفل |
| PASSWORD_CHANGED | MEDIUM | تغيير كلمة المرور |
| 2FA_ENABLED | LOW | تفعيل 2FA |
| 2FA_DISABLED | HIGH | تعطيل 2FA (يحتاج تأكيد) |
| SUSPICIOUS_LOGIN | HIGH | دخول من موقع غير معتاد |
| SESSION_TERMINATED | LOW | إنهاء جلسة |
| ROLE_CHANGED | HIGH | تغيير دور مشرف |
| PERMISSION_CHANGED | HIGH | تغيير صلاحيات دور |
| IP_BLOCKED | LOW | حظر IP |
| EXPORT_DATA | MEDIUM | تصدير بيانات حساسة |

### Error Log (سجل الأخطاء)

```json
{
  "level": "ERROR",
  "message": "Cannot read property 'email' of undefined",
  "stack": "TypeError: ...",
  "context": { "path": "/admin/users", "method": "GET", "userId": "uuid" },
  "statusCode": 500,
  "createdAt": "2026-06-27T14:30:00Z",
  "resolved": false
}
```

## الإجراءات الأمنية الدورية

| الإجراء | التكرار | الوصف |
|---------|---------|-------|
| مراجعة السجلات الأمنية | يومي | فحص السجلات للبحث عن أنشطة مشبوهة |
| مراجعة صلاحيات المشرفين | أسبوعي | التأكد من أن كل مشرف لديه الصلاحيات المناسبة فقط |
| تحديث كلمات المرور | شهري | إجبار المشرفين على تحديث كلمات المرور |
| فحص الثغرات | شهري | استخدام أدوات فحص أمنية |
| النسخ الاحتياطي | يومي | نسخ احتياطي كامل لقاعدة البيانات |
| اختبار الاختراق | ربع سنوي | اختبار أمني شامل |
| مراجعة الـ Logs | مستمر | مراقبة الـ Logs في الوقت الفعلي |
| تحديث التبعيات | أسبوعي | تحديث الـ npm packages للحصول على أحدث التصحيحات الأمنية |
