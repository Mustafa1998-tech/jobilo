# إعدادات الأمان | Security Configuration per Environment

> **آخر تحديث:** يوليو 2026  
> **الهدف:** توثيق إعدادات الأمان لكل بيئة في Jobilo

---

## 1. نطاقات CORS المسموح بها | CORS Origins

| البيئة | النطاقات المسموح بها | ملاحظات |
|--------|---------------------|---------|
| **Local** | `http://localhost:3000, http://localhost:3005` | جميع منافذ التطوير |
| **Dev** | `https://dev.jobilo.com, http://localhost:*` | مرونة للتطوير |
| **Testing** | `https://test.jobilo.com` | مقيدة بالكامل |
| **Staging** | `https://staging.jobilo.com` | مقيدة |
| **Production** | `https://jobilo.com, https://www.jobilo.com` | مقيدة تمامًا |

```env
# إعداد CORS لكل بيئة
LOCAL:  CORS_ORIGINS=http://localhost:3000,http://localhost:3005
PROD:   CORS_ORIGINS=https://jobilo.com,https://www.jobilo.com
```

> راجع [ENV_VARIABLES.md](./ENV_VARIABLES.md) لمزيد من التفاصيل.

---

## 2. إعدادات تحديد معدل الطلبات | Rate Limiting Settings

```typescript
// backend/src/app.module.ts
ThrottlerModule.forRoot([{
  ttl: 60000,  // نافذة 60 ثانية
  limit: 100,  // الحد الأقصى
}])
```

| البيئة | TTL (ثوانٍ) | الحد الأقصى | لكل مسار خاص؟ |
|--------|-------------|-------------|---------------|
| **Local** | 60 | 200 | لا |
| **Dev** | 60 | 200 | لا |
| **Testing** | 60 | 500 | لا |
| **Staging** | 60 | 150 | ✅ `/api/auth`: 20 req/min |
| **Production** | 60 | 50 | ✅ `/api/auth`: 10 req/min, `/api/upload`: 5 req/min |

**مسارات خاصة في الإنتاج:**

| المسار | الحد | السبب |
|--------|------|-------|
| `/api/v1/auth/login` | 10/دقيقة | منع هجمات التخمين |
| `/api/v1/auth/register` | 5/دقيقة | منع إنشاء حسابات وهمية |
| `/api/v1/auth/forgot-password` | 3/دقيقة | منع إغراق البريد |
| `/api/v1/files/upload` | 5/دقيقة | حماية التخزين |
| `/api/v1/ai/generate` | 10/دقيقة | التحكم في تكاليف API |

---

## 3. ترويسات Helmet | Helmet Headers

```typescript
// backend/src/main.ts
app.use(helmet.default());
```

| الترويسة | Local | Dev | Testing | Staging | Production |
|----------|-------|-----|---------|---------|------------|
| `Content-Security-Policy` | ❌ | ✅ | ✅ | ✅ | ✅ |
| `X-Content-Type-Options` | ✅ | ✅ | ✅ | ✅ | ✅ (`nosniff`) |
| `X-Frame-Options` | ✅ | ✅ | ✅ | ✅ | ✅ (`DENY`) |
| `X-XSS-Protection` | ✅ | ✅ | ✅ | ✅ | ✅ (`1; mode=block`) |
| `Strict-Transport-Security` | ❌ | ✅ | ✅ | ✅ | ✅ (`max-age=31536000`) |
| `Referrer-Policy` | ❌ | ✅ | ✅ | ✅ | ✅ (`strict-origin-when-cross-origin`) |
| `Permissions-Policy` | ❌ | ❌ | ❌ | ✅ | ✅ |

---

## 4. مدة صلاحية JWT | JWT Expiry Times

| الرمز | Local | Dev | Staging | Production |
|-------|-------|-----|---------|------------|
| **Access Token** | `60m` | `30m` | `15m` | `15m` |
| **Refresh Token** | `30d` | `14d` | `7d` | `7d` |

```env
# إعدادات JWT
JWT_ACCESS_EXPIRY="15m"
JWT_REFRESH_EXPIRY="7d"
```

> راجع [ENV_VARIABLES.md](./ENV_VARIABLES.md) و [SECRETS_MANAGEMENT.md](./SECRETS_MANAGEMENT.md) لمفاتيح JWT.

---

## 5. سياسة كلمات المرور | Password Policy

| المعيار | القيمة |
|---------|--------|
| **الحد الأدنى للطول** | 8 أحرف |
| **الأحرف الكبيرة** | حرف واحد على الأقل |
| **الأحرف الصغيرة** | حرف واحد على الأقل |
| **الأرقام** | رقم واحد على الأقل |
| **الرموز** | رمز واحد على الأقل (`!@#$%^&*`) |
| **محاولات تسجيل الدخول** | 5 محاولات فاشلة ← قفل لمدة 15 دقيقة |
| **حفظ كلمات المرور السابقة** | آخر 5 كلمات مرور |
| **انتهاء الصلاحية** | كل 90 يومًا (اختياري) |

---

## 6. مهلة الجلسة | Session Timeout

| البيئة | مهلة الخمول | مهلة التسجيل القصوى | تجديد تلقائي |
|--------|-------------|---------------------|-------------|
| **Local** | 24 ساعة | 30 يومًا | ✅ |
| **Dev** | 8 ساعات | 14 يومًا | ✅ |
| **Testing** | 1 ساعة | 1 يوم | ❌ |
| **Staging** | 2 ساعة | 7 أيام | ✅ |
| **Production** | 30 دقيقة | 7 أيام | ✅ |

---

## 7. القائمة البيضاء لعناوين IP (للمسارات الإدارية) | IP Whitelisting

| البيئة | المسارات المحمية | عناوين IP المسموح بها |
|--------|------------------|----------------------|
| **Local** | `/api/v1/admin/**` | `127.0.0.1, ::1` |
| **Dev** | `/api/v1/admin/**` | عنوان VPN للفريق |
| **Staging** | `/api/v1/admin/**` | عنوان VPN للفريق + QA |
| **Production** | `/api/v1/admin/**` | عنوان VPN للفريق فقط |

```typescript
// مثال على حماية مسار إداري
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@IpWhitelist(['10.0.0.0/8', '172.16.0.0/12']) // فقط الشبكة الداخلية
export class AdminController {}
```

---

## 8. مستوى تدقيق الأمان | Audit Logging Level

| البيئة | مستوى التدقيق | الأحداث المسجلة |
|--------|--------------|----------------|
| **Local** | أساسي | تسجيل الدخول، الأخطاء الجسيمة |
| **Dev** | عادي | كل ما في Local + تغييرات البيانات المهمة |
| **Staging** | عالي | كل ما في Dev + كل عمليات CRUD |
| **Production** | كامل | كل طلب API (بدون body), كل عملية إدارية |

**الأحداث المُدقَّقة في الإنتاج:**
- ✅ تسجيل الدخول والخروج (نجاح وفشل)
- ✅ إنشاء وتعديل وحذف المستخدمين
- ✅ تغيير الأدوار والصلاحيات
- ✅ عمليات الدفع
- ✅ رفع الملفات
- ❌ لا تُسجَّل كلمات المرور أو الرموز

---

## 9. تطبيق SSL | SSL Enforcement

| البيئة | HTTP → HTTPS | HSTS | شهادة SSL |
|--------|-------------|------|-----------|
| **Local** | ❌ لا | ❌ | ❌ |
| **Dev** | ✅ نعم | ✅ | ✅ Let's Encrypt |
| **Testing** | ✅ نعم | ❌ | ✅ Let's Encrypt |
| **Staging** | ✅ نعم | ✅ | ✅ Let's Encrypt |
| **Production** | ✅ نعم | ✅ | ✅ Enterprise + Let's Encrypt |

```typescript
// تطبيق HTTPS في NestJS (خلف Proxy)
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);  // الثقة في Nginx reverse proxy
}
```

---

> **مواضيع ذات صلة:**  
> [ENV_VARIABLES.md](./ENV_VARIABLES.md) | [SECRETS_MANAGEMENT.md](./SECRETS_MANAGEMENT.md) | [PRODUCTION.md](./PRODUCTION.md) | [LOGGING_CONFIGURATION.md](./LOGGING_CONFIGURATION.md) | [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
