# دليل استكشاف الأخطاء وإصلاحها | Troubleshooting Guide

> **آخر تحديث:** يوليو 2026  
> **الهدف:** حل المشكلات الشائعة في جميع بيئات Jobilo

---

## 1. الباك إند لا يعمل | Backend Won't Start

### 1.1 تعارض المنافذ (Port Conflict)

| الأعراض | الأسباب | الحل |
|---------|---------|------|
| `Error: listen EADDRINUSE :::4000` | تطبيق آخر يستخدم المنفذ 4000 | 1. اعثر على العملية: `netstat -ano \| findstr :4000` |
| | | 2. أنهِ العملية: `taskkill /PID <PID> /F` |
| | | 3. أو غيّر `PORT` في `.env` |

### 1.2 مشكلة اتصال قاعدة البيانات

| الأعراض | الأسباب | الحل |
|---------|---------|------|
| `connect ECONNREFUSED ::1:5433` | PostgreSQL لم يبدأ | 1. تحقق من Docker: `docker ps` |
| `error: password authentication failed` | كلمة مرور خاطئة | 2. أعد تشغيل: `docker start jobilo-postgres` |
| `database "jobilo_dev" does not exist` | قاعدة البيانات غير موجودة | 3. تحقق من `DATABASE_URL` في `.env` |

```bash
# سلسلة التحقق من قاعدة البيانات
docker ps | findstr postgres           # هل الحاوية تعمل؟
docker logs jobilo-postgres --tail 20  # هل هناك أخطاء؟
psql -h localhost -p 5433 -U user -d jobilo_dev  # اتصال مباشر
```

### 1.3 متغيرات البيئة مفقودة

| الأعراض | السبب | الحل |
|---------|-------|------|
| `JWT_ACCESS_SECRET is not defined` | ملف `.env` غير موجود | `copy .env.example .env` |
| `Missing required config: openai.apiKey` | متغير OpenAI مفقود | أضف المفتاح إلى `.env` |

```bash
# تحقق من وجود ملف .env
Test-Path -LiteralPath "backend\.env"  # ← يجب أن يكون True

# تحقق من المتغيرات المحملة
cd backend
npm run start:dev  # وراقب رسائل الخطأ
```

> راجع [ENV_VARIABLES.md](./ENV_VARIABLES.md) و [LOCAL_DEVELOPMENT.md](./LOCAL_DEVELOPMENT.md).

---

## 2. الفرونت إند لا يعمل | Frontend Won't Build

### 2.1 أخطاء TypeScript

| الأعراض | الأسباب | الحل |
|---------|---------|------|
| `Type 'X' is not assignable to type 'Y'` | عدم تطابق الأنواع | 1. شغّل `npx tsc --noEmit` |
| `Module not found: Can't resolve '...'` | مسار استيراد خاطئ | 2. صحّح الأنواع أو أعد تشغيل IDE |
| | | 3. تحقق من `tsconfig.json` |

### 2.2 اعتماديات مفقودة

| الأعراض | الحل |
|---------|------|
| `Module not found: 'react'` | `cd frontend && npm install` |
| `Error: Cannot find module 'next'` | `cd frontend && npm install` |
| `ERR_OSSL_EVP_UNSUPPORTED` | `set NODE_OPTIONS=--openssl-legacy-provider` |

### 2.3 إصدار Node.js غير صحيح

```bash
# تحقق من الإصدار
node -v  # يجب أن يكون ≥ 18.x

# إذا كان الإصدار قديمًا، قم بتحديثه:
# قم بتنزيل أحدث إصدار من https://nodejs.org
```

---

## 3. رفض اتصال قاعدة البيانات | Database Connection Refused

### التحقق خطوة بخطوة:

```bash
# 1. هل PostgreSQL يعمل؟
docker ps | findstr postgres

# 2. هل المنفذ صحيح؟
netstat -an | findstr 5433

# 3. هل بيانات الدخول صحيحة؟
psql -h localhost -p 5433 -U user -d jobilo_dev

# 4. هل اسم قاعدة البيانات صحيح؟
psql -h localhost -p 5433 -U user -l
```

### مشكلات SSL:

| الخطأ | الحل |
|-------|------|
| `sslmode value "require" invalid` | في الإنتاج: تأكد من `DATABASE_URL?sslmode=require` |
| `root certificate not found` | وفّر مسار الشهادة: `sslrootcert=/path/to/ca.pem` |
| محليًا: `SSL connection refused` | في `.env`: أزل `?sslmode=require` |

> راجع [DATABASE_CONFIGURATION.md](./DATABASE_CONFIGURATION.md).

---

## 4. أخطاء CORS | CORS Errors

### في المتصفح:

| الأعراض | السبب | الحل |
|---------|-------|------|
| `Access to fetch at 'http://localhost:4000' has been blocked by CORS` | النطاق غير مسموح به | أضف النطاق إلى `CORS_ORIGINS` |

```bash
# تحقق من إعدادات CORS في main.ts
# تأكد من أن CORS_ORIGINS تتضمن نطاق الفرونت إند
CORS_ORIGINS=http://localhost:3000,http://localhost:3005

# للبيئات البعيدة:
CORS_ORIGINS=https://dev.jobilo.com,https://staging.jobilo.com
```

### أسباب شائعة:

| السبب | الحل |
|-------|------|
| `CORS_ORIGINS` لا يتضمن النطاق | أضف النطاق إلى المتغير |
| `credentials: true` مع `*` wildcard | لا تستخدم `*` مع الـ credentials |
| Frontend يُرسل إلى URL خاطئ | تحقق من `API_URL` في الفرونت إند |

> راجع [SECURITY_CONFIGURATION.md](./SECURITY_CONFIGURATION.md).

---

## 5. فشل المصادقة | Authentication Failures

| الأعراض | السبب | الحل |
|---------|-------|------|
| `401 Unauthorized` | الرمز غير صالح أو منتهي | سجّل الدخول مرة أخرى |
| `403 Forbidden` | صلاحية غير كافية | تحقق من دور المستخدم |
| `429 Too Many Requests` | تجاوز عدد المحاولات | انتظر دقيقة وحاول مجددًا |

### فشل تسجيل الدخول:

```bash
# تحقق من أن المستخدم موجود
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@jobilo.com","password":"Test@123"}' \
  -v

# تحقق من JWT secrets
# تأكد من أن JWT_ACCESS_SECRET و JWT_REFRESH_SECRET متطابقين
# بين ملف .env والخادم
```

---

## 6. JWT منتهي الصلاحية | JWT Expired

| الأعراض | السبب | الحل |
|---------|-------|------|
| `jwt expired` | انتهت صلاحية Access Token | استخدم Refresh Token للحصول على جديد |
| `invalid signature` | مفتاح JWT غير متطابق | تحقق من `JWT_ACCESS_SECRET` |

```javascript
// تحديث token تلقائيًا
const refreshToken = async () => {
  try {
    const response = await axios.post('/api/v1/auth/refresh', {
      refreshToken: localStorage.getItem('refreshToken'),
    });
    localStorage.setItem('accessToken', response.data.accessToken);
    return response.data.accessToken;
  } catch (error) {
    // إعادة توجيه إلى صفحة تسجيل الدخول
    window.location.href = '/login';
  }
};
```

> راجع [SECURITY_CONFIGURATION.md](./SECURITY_CONFIGURATION.md).

---

## 7. البريد الإلكتروني لا يُرسل | Email Not Sending

| الأعراض | السبب | الحل |
|---------|-------|------|
| `Error: Invalid API key` | مفتاح Resend خاطئ | تحقق من `RESEND_API_KEY` |
| `Email not delivered` | النطاق غير موثّق في Resend | أضف سجلات DNS |
| البريد يصل إلى Spam | سمعة المرسل | تحقق من SPF, DKIM, DMARC |

```bash
# اختبار البريد
curl -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer $RESEND_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"from":"noreply@jobilo.com","to":"test@example.com","subject":"Test","html":"<p>Test</p>"}'
```

> راجع [EMAIL_CONFIGURATION.md](./EMAIL_CONFIGURATION.md).

---

## 8. فشل رفع الملفات | File Upload Fails

| الأعراض | السبب | الحل |
|---------|-------|------|
| `File too large` | تجاوز الحد الأقصى (10MB) | قلّل حجم الملف |
| `Invalid file type` | نوع الملف غير مسموح | استخدم PDF, JPG, PNG فقط |
| `Cloudinary error` | مفتاح Cloudinary خاطئ | تحقق من إعدادات Cloudinary |

```bash
# حدود رفع الملفات
# الموضع في main.ts:
# app.use(bodyParser.json({ limit: '10mb' }));
# app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
```

> راجع [STORAGE_CONFIGURATION.md](./STORAGE_CONFIGURATION.md).

---

## 9. سريع للحلول الشائعة | Quick Fix Reference

| المشكلة | الحل السريع |
|---------|-------------|
| `npm install` يفشل | `npm cache clean --force && npm install` |
| Prisma Client قديم | `npx prisma generate` |
| Docker لا يعمل | أعد تشغيل Docker Desktop |
| `node_modules` تالف | احذف المجلد وأعد التثبيت: `rm -rf node_modules && npm install` |
| Git merge conflict | `git merge --abort` ثم حل التعارضات يدويًا |
| فراغ في القرص | `docker system prune -a` (ينظف الحاويات غير المستخدمة) |

> **لم تحل مشكلتك؟** اتصل بفريق DevOps على Slack `#devops-support` أو افتح Issue على GitHub.

---

> **مواضيع ذات صلة:**  
> [LOCAL_DEVELOPMENT.md](./LOCAL_DEVELOPMENT.md) | [ENV_VARIABLES.md](./ENV_VARIABLES.md) | [DATABASE_CONFIGURATION.md](./DATABASE_CONFIGURATION.md) | [SECURITY_CONFIGURATION.md](./SECURITY_CONFIGURATION.md)
