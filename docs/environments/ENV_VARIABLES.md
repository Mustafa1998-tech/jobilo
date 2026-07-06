# متغيرات البيئة | Environment Variables Reference

> **آخر تحديث:** يوليو 2026  
> **الهدف:** توثيق شامل لجميع متغيرات البيئة المستخدمة في Jobilo

---

## 1. قاعدة البيانات | Database

| المتغير | الوصف | النوع | إلزامي | القيمة الافتراضية | سري | مثال | البيئات |
|----------|-------|------|--------|-------------------|-----|------|---------|
| `DATABASE_URL` | رابط اتصال PostgreSQL | string | ✅ | — | ✅ | `postgresql://user:pass@localhost:5433/jobilo` | الكل |
| `DATABASE_READ_REPLICA` | رابط قاعدة القراءة فقط | string | ❌ | — | ✅ | `postgresql://user:pass@db-replica:5432/jobilo` | staging, prod |
| `DATABASE_POOL_MIN` | الحد الأدنى لاتصالات pool | number | ❌ | `2` | ❌ | `2` | الكل |
| `DATABASE_POOL_MAX` | الحد الأقصى لاتصالات pool | number | ❌ | `10` | ❌ | `10` | الكل |
| `DATABASE_SSL` | تفعيل SSL لقاعدة البيانات | boolean | ❌ | `false` | ❌ | `true` | staging, prod |

---

## 2. JWT (JSON Web Tokens)

| المتغير | الوصف | النوع | إلزامي | القيمة الافتراضية | سري | مثال | البيئات |
|----------|-------|------|--------|-------------------|-----|------|---------|
| `JWT_ACCESS_SECRET` | مفتاح توقيع Access Token | string | ✅ | — | ✅ | `min-32-char-secret-key-for-access-token` | الكل |
| `JWT_REFRESH_SECRET` | مفتاح توقيع Refresh Token | string | ✅ | — | ✅ | `min-32-char-secret-key-for-refresh-token` | الكل |
| `JWT_ACCESS_EXPIRY` | مدة صلاحية Access Token | string | ❌ | `15m` | ❌ | `15m` | الكل |
| `JWT_REFRESH_EXPIRY` | مدة صلاحية Refresh Token | string | ❌ | `7d` | ❌ | `7d` | الكل |

---

## 3. إعدادات التطبيق | App

| المتغير | الوصف | النوع | إلزامي | القيمة الافتراضية | سري | مثال | البيئات |
|----------|-------|------|--------|-------------------|-----|------|---------|
| `PORT` | منفذ تشغيل الخادم | number | ❌ | `4000` | ❌ | `4000` | الكل |
| `NODE_ENV` | بيئة التشغيل | string | ❌ | `development` | ❌ | `production` | الكل |
| `APP_URL` | رابط التطبيق الأمامي | string | ❌ | `http://localhost:3000` | ❌ | `https://jobilo.com` | الكل |
| `API_URL` | رابط API | string | ❌ | `http://localhost:4000` | ❌ | `https://api.jobilo.com` | الكل |

---

## 4. CORS

| المتغير | الوصف | النوع | إلزامي | القيمة الافتراضية | سري | مثال | البيئات |
|----------|-------|------|--------|-------------------|-----|------|---------|
| `CORS_ORIGINS` | النطاقات المسموح بها (مفصولة بفاصلة) | string | ❌ | `http://localhost:3000` | ❌ | `https://jobilo.com,https://www.jobilo.com` | الكل |

---

## 5. تحديد معدل الطلبات | Rate Limit

| المتغير | الوصف | النوع | إلزامي | القيمة الافتراضية | سري | مثال | البيئات |
|----------|-------|------|--------|-------------------|-----|------|---------|
| `RATE_LIMIT_TTL` | الوقت بالثواني للنافذة | number | ❌ | `60` | ❌ | `60` | الكل |
| `RATE_LIMIT_MAX` | الحد الأقصى للطلبات في النافذة | number | ❌ | `100` | ❌ | `50` | الكل |

---

## 6. البريد الإلكتروني | Email (Resend)

| المتغير | الوصف | النوع | إلزامي | القيمة الافتراضية | سري | مثال | البيئات |
|----------|-------|------|--------|-------------------|-----|------|---------|
| `RESEND_API_KEY` | مفتاح API لخدمة Resend | string | ✅ | — | ✅ | `re_123456789abcdef` | الكل |
| `RESEND_FROM` | عنوان البريد الإلكتروني للمرسل | string | ❌ | `noreply@jobilo.com` | ❌ | `noreply@jobilo.com` | الكل |

---

## 7. تخزين الملفات | Storage (Cloudinary)

| المتغير | الوصف | النوع | إلزامي | القيمة الافتراضية | سري | مثال | البيئات |
|----------|-------|------|--------|-------------------|-----|------|---------|
| `CLOUDINARY_CLOUD_NAME` | اسم السحابة في Cloudinary | string | ✅ | — | ❌ | `jobilo` | الكل |
| `CLOUDINARY_API_KEY` | مفتاح API لـ Cloudinary | string | ✅ | — | ✅ | `123456789012345` | الكل |
| `CLOUDINARY_API_SECRET` | المفتاح السري لـ Cloudinary | string | ✅ | — | ✅ | `abc123secret456` | الكل |
| `CLOUDINARY_FOLDER` | المجلد الافتراضي للرفع | string | ❌ | `jobilo` | ❌ | `jobilo` | الكل |

---

## 8. الذكاء الاصطناعي | OpenAI

| المتغير | الوصف | النوع | إلزامي | القيمة الافتراضية | سري | مثال | البيئات |
|----------|-------|------|--------|-------------------|-----|------|---------|
| `OPENAI_API_KEY` | مفتاح API لـ OpenAI | string | ✅ | — | ✅ | `sk-proj-xxxxx` | الكل |
| `OPENAI_MODEL` | نموذج OpenAI المستخدم | string | ❌ | `gpt-4o-mini` | ❌ | `gpt-4o-mini` | الكل |
| `OPENAI_MAX_TOKENS` | الحد الأقصى للـ Tokens | number | ❌ | `2000` | ❌ | `2000` | الكل |

---

## 9. الدفع | Stripe

| المتغير | الوصف | النوع | إلزامي | القيمة الافتراضية | سري | مثال | البيئات |
|----------|-------|------|--------|-------------------|-----|------|---------|
| `STRIPE_SECRET_KEY` | المفتاح السري لـ Stripe | string | ❌ | — | ✅ | — | الكل |
| `STRIPE_WEBHOOK_SECRET` | مفتاح Webhook لـ Stripe | string | ❌ | — | ✅ | — | الكل |

---

## 10. المراقبة | Monitoring

| المتغير | الوصف | النوع | إلزامي | القيمة الافتراضية | سري | مثال | البيئات |
|----------|-------|------|--------|-------------------|-----|------|---------|
| `SENTRY_DSN` | رابط DSN لتطبيق Sentry | string | ❌ | `""` | ❌ | `https://xxx@o123.ingest.sentry.io/123` | dev, staging, prod |

---

## 11. ملخص حسب البيئة | Summary by Environment

| البيئة | Database | JWT Secrets | OpenAI | Cloudinary | Resend | Stripe |
|--------|----------|-------------|--------|------------|--------|--------|
| **Local** | 🔴 وهمي | 🔴 تطوير | 🔴 وهمي/حقيقي | 🔴 وهمي | 🔴 اختبار | 🔴 اختبار |
| **Dev** | 🔴 وهمي | 🔴 تطوير | 🔴 وهمي | 🔴 وهمي | 🔴 اختبار | 🔴 اختبار |
| **Testing** | 🔴 اختبار | 🔴 اختبار | ❌ معطل | 🔴 وهمي | 🔴 معطل | 🔴 اختبار |
| **Staging** | 🟡 مجهول | 🟡 إصدار | 🟡 محدود | 🟡 اختبار | 🟡 اختبار | 🟡 اختبار |
| **Production** | 🟢 حقيقي | 🟢 حقيقي | 🟢 حقيقي | 🟢 حقيقي | 🟢 حقيقي | 🟢 حقيقي |

> **🔴 = غير حقيقي** | **🟡 = مجهول/محدود** | **🟢 = حقيقي/إنتاج**

---

## 12. مثال كامل لملف `.env` | Complete `.env` Example

```env
# ============================
# Database
# ============================
DATABASE_URL=postgresql://user:root@localhost:5433/jobilo_dev
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# ============================
# JWT
# ============================
JWT_ACCESS_SECRET="dev-access-secret-at-least-32-characters-long-for-security"
JWT_REFRESH_SECRET="dev-refresh-secret-at-least-32-characters-long-for-security"
JWT_ACCESS_EXPIRY="15m"
JWT_REFRESH_EXPIRY="7d"

# ============================
# Server
# ============================
PORT=4000
NODE_ENV=development
CORS_ORIGINS="http://localhost:3000,http://localhost:3005"
APP_URL="http://localhost:3000"
API_URL="http://localhost:4000"

# ============================
# Rate Limiting
# ============================
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100

# ============================
# OpenAI
# ============================
OPENAI_API_KEY="sk-your-key-here"
OPENAI_MODEL="gpt-4o-mini"
OPENAI_MAX_TOKENS=2000

# ============================
# Cloudinary
# ============================
CLOUDINARY_CLOUD_NAME="your-cloud"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
CLOUDINARY_FOLDER="jobilo"

# ============================
# Email (Resend)
# ============================
RESEND_API_KEY="re_your-key"
RESEND_FROM="noreply@jobilo.com"

# ============================
# Stripe
# ============================
STRIPE_SECRET_KEY="sk_test_your-key"
STRIPE_WEBHOOK_SECRET="whsec_your-secret"

# ============================
# Monitoring
# ============================
SENTRY_DSN=""
```

---

> **مواضيع ذات صلة:**  
> [CONFIGURATION.md](./CONFIGURATION.md) | [SECRETS_MANAGEMENT.md](./SECRETS_MANAGEMENT.md) | [ENVIRONMENTS.md](./ENVIRONMENTS.md)
