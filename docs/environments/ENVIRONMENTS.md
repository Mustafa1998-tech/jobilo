# بيئات التطوير | Environments Overview

> **آخر تحديث:** يوليو 2026  
> **الهدف:** توثيق جميع بيئات تشغيل منصة Jobilo وأغراض كل بيئة

---

## 1. نظرة عامة | Overview

تتكون منصة Jobilo من **خمس بيئات** منفصلة، كل منها يخدم غرضًا محددًا في دورة حياة تطوير البرمجيات:

| البيئة | Environment | الغرض | URL |
|--------|-------------|-------|-----|
| 🖥️ **تطوير محلي** | Local Development | تطوير الميزات محليًا على جهاز المطور | `http://localhost:3005` |
| 🟢 **تطوير مشترك** | Development | اختبار التكامل بين أعضاء الفريق | `https://dev.jobilo.com` |
| 🟡 **اختبار** | Testing | تشغيل الاختبارات الآلية وQA | `https://test.jobilo.com` |
| 🟠 **ما قبل الإنتاج** | Staging | التحقق النهائي قبل الإنتاج | `https://staging.jobilo.com` |
| 🔴 **إنتاج** | Production | البيئة المباشرة للمستخدمين | `https://jobilo.com` |

---

## 2. جدول المقارنة | Environment Comparison

| الخاصية | Local | Dev | Testing | Staging | Production |
|----------|-------|-----|---------|---------|------------|
| **الغرض** | تطوير فردي | تكامل الفريق | اختبار آلي | تحقق نهائي | إنتاج مباشر |
| **URL** | `localhost:3005` | `dev.jobilo.com` | `test.jobilo.com` | `staging.jobilo.com` | `jobilo.com` |
| **قاعدة البيانات** | PostgreSQL محلي (:5433) | DB مشتركة | DB منفصل للاختبارات | نسخة قريبة من الإنتاج | DB رئيسي (مع نسخ احتياطي) |
| **المصادر** | جهاز المطور | VM/Small Cloud | CI/CD Runner | Cloud (مشابه للإنتاج) | Cloud (موزّع) |
| **من يستخدمها** | المطورون | فريق التطوير | CI/CD + فريق QA | العملاء + PM | المستخدمون النهائيون |
| **البيانات** | بيانات وهمية | بيانات وهمية | بيانات اختبار | بيانات مجهولة | بيانات حقيقية |
| **الأمان** | منخفض | متوسط | متوسط | عالي | عالي جدًا |
| **SSL/TLS** | ❌ | ✅ Let's Encrypt | ✅ Let's Encrypt | ✅ Let's Encrypt | ✅ Enterprise |
| **مراقبة** | ❌ | ✅ أساسية | ✅ أساسية | ✅ كاملة | ✅ كاملة + تنبيهات |
| **النسخ الاحتياطي** | ❌ | ❌ | ❌ | يومي | كل 6 ساعات |

---

## 3. سير العمل عبر البيئات | Environment Workflow

```mermaid
flowchart LR
    A[Local Dev] --> B[Dev]
    B --> C[Testing]
    C --> D[Staging]
    D --> E[Production]
    style A fill:#green,color:white
    style B fill:#green,color:white
    style C fill:#yellow,color:black
    style D fill:#orange,color:white
    style E fill:#red,color:white
```

1. **المطور** يبني الميزة على البيئة المحلية (Local)
2. **يدفع** الكود إلى فرع التطوير (Dev) لاختبار التكامل
3. **CI/CD** يشغل الاختبارات الآلية (Testing)
4. **بعد الموافقة** يُنشر إلى البيئة التجريبية (Staging) للـ UAT
5. **بعد الاعتماد** يُنشر إلى الإنتاج (Production)

---

## 4. أدلة تفصيلية | Detailed Guides

| الدليل | الرابط |
|--------|--------|
| إعداد البيئة المحلية | [LOCAL_DEVELOPMENT.md](./LOCAL_DEVELOPMENT.md) |
| بيئة التطوير المشتركة | [DEVELOPMENT.md](./DEVELOPMENT.md) |
| بيئة الاختبارات | [TESTING.md](./TESTING.md) |
| بيئة ما قبل الإنتاج | [STAGING.md](./STAGING.md) |
| بيئة الإنتاج | [PRODUCTION.md](./PRODUCTION.md) |
| متغيرات البيئة | [ENV_VARIABLES.md](./ENV_VARIABLES.md) |
| إدارة الإعدادات | [CONFIGURATION.md](./CONFIGURATION.md) |
| إدارة الأسرار | [SECRETS_MANAGEMENT.md](./SECRETS_MANAGEMENT.md) |
| قاعدة البيانات | [DATABASE_CONFIGURATION.md](./DATABASE_CONFIGURATION.md) |
| التسجيل والمراقبة | [LOGGING_CONFIGURATION.md](./LOGGING_CONFIGURATION.md) |
| الأمان | [SECURITY_CONFIGURATION.md](./SECURITY_CONFIGURATION.md) |
| قائمة الإصدار | [RELEASE_CHECKLIST.md](./RELEASE_CHECKLIST.md) |
| دليل التراجع | [ROLLBACK_GUIDE.md](./ROLLBACK_GUIDE.md) |
| حل المشكلات | [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) |
| تخزين الملفات | [STORAGE_CONFIGURATION.md](./STORAGE_CONFIGURATION.md) |
| البريد الإلكتروني | [EMAIL_CONFIGURATION.md](./EMAIL_CONFIGURATION.md) |

---

## 5. متغيرات البيئة الأساسية | Core Environment Variables

جميع البيئات تشترك في نفس متغيرات البيئة لكن بقيم مختلفة. راجع [ENV_VARIABLES.md](./ENV_VARIABLES.md) للتفاصيل الكاملة.

```env
# مثال على إعدادات البيئات المختلفة
NODE_ENV=development|test|staging|production
PORT=4000
DATABASE_URL=postgresql://user:pass@host:5432/jobilo
CORS_ORIGINS=http://localhost:3000,https://dev.jobilo.com
```

---

## 6. سياسة النشر | Deployment Policy

| البيئة | تلقائي | مراجعة | توقيت |
|--------|--------|--------|-------|
| Dev | ✅ CI/CD | ❌ | كل push إلى `dev` |
| Testing | ✅ CI/CD | ✅ PR | كل push إلى `main` |
| Staging | ✅ CI/CD | ✅ إصدار | يدويًا بعد موافقة QA |
| Production | ❌ يدويًا | ✅ موافقة مدير | وفق الجدول الزمني |

---

> **مواضيع ذات صلة:**  
> [CONFIGURATION.md](./CONFIGURATION.md) | [SECRETS_MANAGEMENT.md](./SECRETS_MANAGEMENT.md) | [SECURITY_CONFIGURATION.md](./SECURITY_CONFIGURATION.md)
