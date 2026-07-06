# بيئة التطوير المشتركة | Shared Development Environment

> **آخر تحديث:** يوليو 2026  
> **URL:** `https://dev.jobilo.com`  
> **الهدف:** بيئة مشتركة لاختبار التكامل بين أعضاء الفريق

---

## 1. الغرض | Purpose

بيئة التطوير المشتركة (Dev) هي البيئة الأولى بعد البيئة المحلية. تهدف إلى:

- **اختبار التكامل** بين وحدات النظام المختلفة
- **مشاركة التغييرات** مع باقي الفريق قبل المراجعة
- **تشغيل تلقائي** عند كل push إلى فرع `dev`
- **اكتشاف المشكلات مبكرًا** قبل الوصول إلى بيئة الاختبارات

---

## 2. الفروقات عن البيئة المحلية | Differences from Local

| الخاصية | Local | Dev |
|----------|-------|-----|
| قاعدة البيانات | PostgreSQL محلي (:5433) | PostgreSQL سحابي مشترك |
| SSL/TLS | ❌ | ✅ Let's Encrypt |
| CDN | ❌ | ✅ أساسي |
| البيانات | بيانات وهمية (seed) | بيانات وهمية (أكثر تنوعًا) |
| مراقبة | ❌ | ✅ Sentry + Logs |
| مدة الإبقاء | غير محدود | إعادة تعيين كل أسبوعين |
| الوصول | المطور فقط | فريق التطوير بأكمله |

---

## 3. إعدادات قاعدة البيانات | Database Connection

```env
DATABASE_URL=postgresql://dev_user:password@dev-db.jobilo.com:5432/jobilo_dev
```

**الخصوصية:** قاعدة بيانات Dev تحتوي فقط على **بيانات وهمية**. لا يتم استخدام بيانات حقيقية أبدًا.

> راجع [DATABASE_CONFIGURATION.md](./DATABASE_CONFIGURATION.md) للتفاصيل الكاملة.

---

## 4. متغيرات البيئة الخاصة | Dev-Specific Environment Variables

```env
NODE_ENV=development
PORT=4000
CORS_ORIGINS=https://dev.jobilo.com,http://localhost:3000,http://localhost:3005
APP_URL=https://dev.jobilo.com
API_URL=https://dev-api.jobilo.com
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=200           # أعلى من الإنتاج للتطوير
SENTRY_DSN=https://xxx@sentry.jobilo.com/1
```

| المتغير | القيمة | ملاحظة |
|----------|--------|--------|
| `NODE_ENV` | `development` | تفعيل Debug Logs |
| `RATE_LIMIT_MAX` | 200 | حد أعلى لاختبار الأداء |
| `SENTRY_DSN` | مفعّل | تتبع الأخطاء |

> راجع [ENV_VARIABLES.md](./ENV_VARIABLES.md) للقائمة الكاملة.

---

## 5. عملية النشر | Deployment Process

```mermaid
flowchart LR
    A[Push to dev branch] --> B[GitHub Actions]
    B --> C[Build & Test]
    C --> D[Deploy to Dev]
    D --> E[Notify Team]
```

**التفاصيل:**

1. **يدفع** المطور الكود إلى فرع `dev`
2. **GitHub Actions** يشغل:
   - `npm install`
   - `npm run build`
   - `npm run test` (unit + integration)
   - فحص TypeScript
3. **ينشر** تلقائيًا إلى `https://dev.jobilo.com`
4. **يُرسل** إشعار إلى فريق التطوير عبر Slack

> راجع [RELEASE_CHECKLIST.md](./RELEASE_CHECKLIST.md) قبل الدفع إلى Dev.

---

## 6. المراقبة | Monitoring

| الأداة | الغرض | الرابط |
|--------|--------|--------|
| **Sentry** | تتبع الأخطاء في الوقت الفعلي | `https://sentry.jobilo.com/dev` |
| **Logs** | سجلات الخادم (JSON منظم) | لوحة تحكم Dev |
| **Health Endpoint** | التحقق من صحة الخدمة | `https://dev-api.jobilo.com/api/health` |

> راجع [LOGGING_CONFIGURATION.md](./LOGGING_CONFIGURATION.md) للتفاصيل.

---

## 7. التحكم في الوصول | Access Control

| المستخدم | الصلاحية | المصادقة |
|----------|----------|-----------|
| المطورون | قراءة + كتابة | VPN + مفتاح SSH |
| DevOps | إدارة كاملة | VPN + MFA |
| PM/QA | قراءة فقط | VPN |

**الإجراءات الأمنية:**
- يتطلب VPN للوصول إلى لوحة التحكم
- يتم تسجيل جميع عمليات الوصول إلى قاعدة البيانات
- إعادة تعيين البيانات كل أسبوعين

> راجع [SECURITY_CONFIGURATION.md](./SECURITY_CONFIGURATION.md) للتفاصيل الأمنية.

---

## 8. استكشاف الأخطاء وإصلاحها | Troubleshooting

| المشكلة | الحل |
|----------|-------|
| التعارض مع البيئة المحلية | تحقق من `NODE_ENV` و `DATABASE_URL` |
| فشل النشر التلقائي | راجع GitHub Actions logs |
| مشكلة في قاعدة البيانات | اتصل بفريق DevOps لإعادة تعيين DB |

> راجع [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) للمزيد.

---

> **مواضيع ذات صلة:**  
> [LOCAL_DEVELOPMENT.md](./LOCAL_DEVELOPMENT.md) | [TESTING.md](./TESTING.md) | [STAGING.md](./STAGING.md) | [ENV_VARIABLES.md](./ENV_VARIABLES.md)
