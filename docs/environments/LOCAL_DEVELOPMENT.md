# إعداد البيئة المحلية | Local Development Setup

> **آخر تحديث:** يوليو 2026  
> **الهدف:** تمكين المطورين من تشغيل Jobilo محليًا لأغراض التطوير

---

## 1. المتطلبات الأساسية | Prerequisites

| المتطلب | الإصدار المطلوب | ملاحظات |
|----------|----------------|---------|
| **Node.js** | 18.x أو أحدث | تأكد من تثبيت `node -v` |
| **Docker Desktop** | أحدث إصدار | لتشغيل PostgreSQL محليًا |
| **PostgreSQL** | 16 | يعمل عبر Docker |
| **Git** | 2.40+ | `git --version` للتحقق |
| **npm** | 9+ | يأتي مع Node.js |
| **PowerShell 7+** | 7.x | للتشغيل على Windows |

> **ملاحظة:** يمكن استخدام `pnpm` بدلاً من npm إذا كان مثبتًا.

---

## 2. خطوات الإعداد خطوة بخطوة | Step-by-Step Setup

### 2.1 استنساخ المستودع | Clone the Repository

```bash
git clone https://github.com/jobilo/jobilo.git
cd jobilo
```

### 2.2 إعداد متغيرات البيئة | Setup Environment Variables

```bash
# انسخ ملف البيئة النموذجي
copy backend\.env.example backend\.env
# أو في Linux/Mac:
# cp backend/.env.example backend/.env
```

**تأكد من تعديل القيم الحساسة** مثل مفاتيح JWT و API Keys.

راجع [ENV_VARIABLES.md](./ENV_VARIABLES.md) لشرح كل متغير.

### 2.3 تشغيل قاعدة البيانات عبر Docker | Start Database via Docker

```bash
docker run -d \
  --name jobilo-postgres \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=root \
  -e POSTGRES_DB=jobilo_dev \
  -p 5433:5432 \
  postgres:16
```

**المنافذ المستخدمة:**

| الخدمة | المنفذ الداخلي | المنفذ الخارجي |
|--------|---------------|----------------|
| PostgreSQL | 5432 | **5433** |
| Backend (NestJS) | 4000 | **4000** |
| Frontend (Next.js) | 3005 | **3005** |

> **ملاحظة:** منفذ PostgreSQL الخارجي 5433 لتجنب التعارض مع أي PostgreSQL محلي على المنفذ 5432.

### 2.4 تثبيت الاعتماديات | Install Dependencies

```bash
# تثبيت اعتماديات الباك إند
cd backend
npm install

# تثبيت اعتماديات الفرونت إند
cd ../frontend
npm install
```

### 2.5 مزامنة قاعدة البيانات | Push Database Schema

```bash
cd backend
npx prisma generate
npx prisma db push
```

### 2.6 تعبئة البيانات الأولية | Seed the Database

```bash
cd backend
npx prisma db seed
```

### 2.7 تشغيل الباك إند | Run Backend

```bash
# نافذة 1 - تشغيل الباك إند مع إعادة التحميل التلقائي
cd backend
npm run start:dev

# توقع رؤية:
# 🚀 Jobilo API running on port 4000
# 📚 API Docs: http://localhost:4000/api/docs
```

### 2.8 تشغيل الفرونت إند | Run Frontend

```bash
# نافذة 2 - تشغيل الفرونت إند
cd frontend
npm run dev
# متوقع على: http://localhost:3005
```

---

## 3. Docker Compose Services

في حال وجود ملف `docker-compose.yml` في المشروع، يمكنك تشغيل جميع الخدمات أمرًا واحدًا:

```bash
docker compose up -d
```

**الخدمات المتوقعة:**

| الخدمة | الصورة | المنفذ |
|--------|--------|--------|
| `postgres` | postgres:16 | 5433 |
| `redis` (مستقبلي) | redis:7-alpine | 6379 |

> راجع [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) إذا واجهتك مشكلة في تشغيل Docker.

---

## 4. إعادة التحميل التلقائي | Hot Reload

| الجزء | الأداة | الإعداد |
|--------|--------|---------|
| **Backend** | NestJS `start:dev` | يستخدم `ts-node` + `--watch` |
| **Frontend** | Next.js `dev` | Turbopack / Webpack HMR |

لا تحتاج إلى إعادة تشغيل الخوادم يدويًا عند تعديل الملفات — يتم إعادة التحميل تلقائيًا.

---

## 5. المشكلات الشائعة والحلول | Common Issues

| المشكلة | السبب | الحل |
|----------|-------|------|
| `EADDRINUSE` منفذ 4000 مستخدم | تطبيق آخر يستخدم المنفذ | غيّر `PORT` في `.env` أو أنهِ العملية |
| رفض اتصال قاعدة البيانات | PostgreSQL لم يبدأ أو بيانات الدخول خاطئة | تحقق من Docker: `docker ps` |
| Prisma Client غير محدث | تم تغيير schema.prisma | شغّل `npx prisma generate` |
| npm install يفشل | تعارض إصدارات أو اتصال إنترنت | جرب `npm cache clean --force` |
| Next.js لا يعثر على API | `NEXT_PUBLIC_API_URL` غير مضبوط | تأكد من `API_URL=http://localhost:4000` |

> لمزيد من المشكلات، راجع [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

## 6. إضافات VS Code الموصى بها | Recommended VS Code Extensions

| الإضافة | الغرض |
|----------|--------|
| **ESLint** | تحليل الكود وتصحيح الأخطاء |
| **Prettier** | تنسيق الكود تلقائيًا |
| **Prisma** | دعم لملفات Prisma schema |
| **Tailwind CSS IntelliSense** | إكمال تلقائي لـ Tailwind |
| **NestJS Snippets** | اختصارات لـ NestJS |
| **Pretty TypeScript Errors** | تحسين عرض أخطاء TypeScript |
| **GitLens** | تحسين تجربة Git |
| **Thunder Client** | اختبار APIs (بديل Postman) |
| **Docker** | إدارة حاويات Docker |
| **Arabic/English Spell Check** | التدقيق الإملائي للغتين |

---

## 7. URLs المحلية | Local URLs

| الخدمة | URL |
|--------|-----|
| Frontend | http://localhost:3005 |
| API (NestJS) | http://localhost:4000/api |
| API Documentation (Swagger) | http://localhost:4000/api/docs |
| Prisma Studio | `npx prisma studio` ← http://localhost:5555 |

---

> **مواضيع ذات صلة:**  
> [DEVELOPMENT.md](./DEVELOPMENT.md) | [ENV_VARIABLES.md](./ENV_VARIABLES.md) | [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) | [CONFIGURATION.md](./CONFIGURATION.md)
