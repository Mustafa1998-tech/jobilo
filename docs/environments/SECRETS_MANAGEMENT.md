# إدارة الأسرار | Secrets Management

> **آخر تحديث:** يوليو 2026  
> **الهدف:** توثيق سياسة إدارة المفاتيح السرية وكلمات المرور في Jobilo

---

## 1. ما يعتبر سِرًا | What Constitutes a Secret

| النوع | مثال | مستوى السرية |
|-------|------|-------------|
| **مفاتيح JWT** | `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` | 🔴 عالي |
| **مفاتيح API** | `OPENAI_API_KEY`, `RESEND_API_KEY`, `STRIPE_SECRET_KEY` | 🔴 عالي |
| **بيانات اعتماد قاعدة البيانات** | `DATABASE_URL` (كلمة المرور داخله) | 🔴 عالي |
| **مفاتيح Cloudinary** | `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | 🟡 متوسط |
| **مفاتيح Webhook** | `STRIPE_WEBHOOK_SECRET` | 🔴 عالي |
| **رابط Sentry DSN** | `SENTRY_DSN` | 🟢 منخفض (لكن يعرض معلومات) |
| **أسماء السحابة** | `CLOUDINARY_CLOUD_NAME` | 🟢 منخفض |

---

## 2. أبدًا لا تُدرج الأسرار في Git | Never Commit Secrets to Git

### الملفات المستثناة (`.gitignore`):

```gitignore
# الأسرار
.env
.env.local
.env.production
.env.development
*.pem
*.key
**/secrets/
```

### التحقق التلقائي:

تستخدم Jobibo **GitLeaks** لاكتشاف الأسرار قبل الـ commit:

```bash
# تشغيل GitLeaks محليًا
npx gitleaks detect --source . -v

# فحص كامل للتأكد من عدم وجود أسرار
npx gitleaks detect --source . --verbose
```

> **ملاحظة:** إذا تم دفع سر عن طريق الخطأ، اتصل بفريق DevOps فورًا لتدوير المفتاح.

---

## 3. إدارة ملفات `.env` | .env File Management

| البيئة | اسم الملف | المصدر | ملاحظات |
|--------|-----------|--------|---------|
| **Local** | `backend/.env` | ينسخه المطور من `.env.example` | لكل مطور قيمه الخاصة |
| **Dev** | CI/CD Variables | GitHub Secrets | لا يوجد ملف محلي |
| **Testing** | CI/CD Variables | GitHub Secrets | قيم اختبارية |
| **Staging** | CI/CD Variables | GitHub Secrets + Vault | قيم شبه إنتاجية |
| **Production** | Vault + CI/CD | HashiCorp Vault | أعلى مستوى أمان |

```bash
# إعداد البيئة المحلية الآمن
copy backend\.env.example backend\.env
# ثم عدّل القيم السرية في .env (لا تشاركها)
```

> راجع [ENV_VARIABLES.md](./ENV_VARIABLES.md) للقيم الافتراضية والأنواع.

---

## 4. متغيرات البيئة في CI/CD | Environment Variables for CI/CD

تُخزن الأسرار في **GitHub Secrets** (مشفرة):

```yaml
# .github/workflows/deploy.yml
jobs:
  deploy:
    steps:
      - name: Deploy to Production
        env:
          DATABASE_URL: ${{ secrets.PROD_DATABASE_URL }}
          JWT_ACCESS_SECRET: ${{ secrets.PROD_JWT_ACCESS_SECRET }}
          JWT_REFRESH_SECRET: ${{ secrets.PROD_JWT_REFRESH_SECRET }}
          OPENAI_API_KEY: ${{ secrets.PROD_OPENAI_API_KEY }}
          # ...
```

**قائمة الأسرار المخزنة في GitHub:**

| السر في GitHub | البيئة |
|----------------|--------|
| `DEV_DATABASE_URL` | Dev |
| `DEV_JWT_ACCESS_SECRET` | Dev |
| `PROD_DATABASE_URL` | Production |
| `PROD_JWT_ACCESS_SECRET` | Production |
| `PROD_JWT_REFRESH_SECRET` | Production |
| `PROD_OPENAI_API_KEY` | Production |
| `PROD_CLOUDINARY_API_SECRET` | Production |
| `PROD_STRIPE_SECRET_KEY` | Production |
| `PROD_RESEND_API_KEY` | Production |

---

## 5. سياسة تدوير الأسرار | Secret Rotation Policy

| السر | وتيرة التدوير | مهلة الإشعار | العملية |
|------|--------------|-------------|---------|
| `JWT_ACCESS_SECRET` | كل 30 يومًا | 7 أيام | إنشاء مفتاح جديد، تحديث الخدمات، إبطال القديم |
| `JWT_REFRESH_SECRET` | كل 30 يومًا | 7 أيام | نفس الإجراء |
| `DATABASE_URL` | كل 90 يومًا | 14 يومًا | تغيير كلمة مرور DB، تحديث التطبيقات |
| `OPENAI_API_KEY` | كل 90 يومًا | 7 أيام | إنشاء مفتاح جديد في OpenAI dashboard |
| `CLOUDINARY_API_SECRET` | كل 180 يومًا | 14 يومًا | إنشاء مفتاح جديد في Cloudinary |
| `RESEND_API_KEY` | كل 90 يومًا | 7 أيام | إنشاء مفتاح جديد في Resend |
| `STRIPE_SECRET_KEY` | كل 90 يومًا | 14 يومًا | إنشاء مفتاح جديد في Stripe Dashboard |

**إجراء الطوارئ:** إذا تم تسريب سر، يتم تدويره فورًا دون انتظار الموعد المقرر.

---

## 6. خزنة الأسرار في الإنتاج | Production Secrets Vault

يستخدم Jobibo **HashiCorp Vault** لتخزين الأسرار في الإنتاج:

```bash
# قراءة سر من Vault
vault kv get prod/jobilo/database

# كتابة سر
vault kv put prod/jobilo/database url="postgresql://..."
```

**فوائد Vault:**
- 🔐 تشفير جميع الأسرار في حالة السكون والانتقال
- 📋 سجل تدقيق لكل عملية وصول
- 🔄 تجديد تلقائي للأسرار
- 🚫 انتهاء صلاحية مؤقت للأسرار (Lease)

---

## 7. التحكم في الوصول للأسرار | Access Control for Secrets

| الدور | الصلاحية | الطريقة |
|-------|----------|---------|
| **DevOps** | قراءة + كتابة + تدوير | Vault Policy + GitHub Admin |
| **Tech Lead** | قراءة (باستثناء الإنتاج) | Vault Read-only |
| **المطورون** | كتابة أسرار Dev فقط | GitHub Secrets (Dev only) |
| **CI/CD** | قراءة أثناء النشر | GitHub Actions + Vault Agent |
| **التطبيق** | قراءة عند بدء التشغيل | Vault Agent Sidecar |

**المبادئ:**
- **مبدأ أقل الامتيازات (Least Privilege):** كل دور يصل فقط إلى ما يحتاجه
- **فصل المسؤوليات:** لا يمكن لشخص واحد الوصول إلى جميع الأسرار
- **التدقيق:** كل وصول إلى سر يُسجَّل

---

## 8. تدقيق الوصول إلى الأسرار | Audit Logging for Secret Access

| الحدث | يُسجَّل؟ | التفاصيل المسجلة |
|-------|---------|-----------------|
| قراءة سر من Vault | ✅ | المستخدم، الوقت، السر، IP |
| كتابة سر جديد | ✅ | المستخدم، الوقت، اسم السر |
| تدوير سر | ✅ | المستخدم، السر القديم والجديد |
| فشل الوصول | ✅ | محاولة الوصول غير المصرح بها |
| وصول CI/CD | ✅ | اسم الـ Workflow، البيئة |

```json
// مثال على سجل تدقيق Vault
{
  "time": "2026-07-06T10:30:00Z",
  "user": "ci-cd-pipeline",
  "action": "read",
  "path": "prod/jobilo/database",
  "source_ip": "10.0.1.50",
  "result": "success"
}
```

---

> **مواضيع ذات صلة:**  
> [ENV_VARIABLES.md](./ENV_VARIABLES.md) | [CONFIGURATION.md](./CONFIGURATION.md) | [SECURITY_CONFIGURATION.md](./SECURITY_CONFIGURATION.md) | [ENVIRONMENTS.md](./ENVIRONMENTS.md)
