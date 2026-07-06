# بيئة الاختبارات | Testing Environment

> **آخر تحديث:** يوليو 2026  
> **URL:** `https://test.jobilo.com`  
> **الهدف:** تشغيل الاختبارات الآلية وفحص الجودة

---

## 1. الغرض | Purpose

بيئة الاختبارات (Testing) مخصصة لـ:
- **تشغيل الاختبارات الآلية** (Unit, Integration, E2E) في CI/CD pipeline
- **فحص الجودة** (QA) قبل الانتقال إلى Staging
- **التحقق من عدم وجود أخطاء انحدارية** (Regression)
- **اختبار أداء APIs**

---

## 2. التكامل مع CI/CD | CI/CD Integration

```mermaid
flowchart LR
    A[PR to main] --> B[CI/CD Pipeline]
    B --> C[Lint & Type Check]
    C --> D[Unit Tests]
    D --> E[Integration Tests]
    E --> F[E2E Tests]
    F --> G[QA Review]
    G --> H{Approved?}
    H -->|Yes| I[Deploy to Staging]
    H -->|No| J[Fix & Re-run]
```

**الأدوات المستخدمة:**
- **GitHub Actions** — تنفيذ الـ Pipeline
- **Jest** — اختبارات الوحدة والتكامل
- **Playwright** — اختبارات E2E للواجهة الأمامية

---

## 3. إعداد قاعدة بيانات الاختبارات | Test Database Setup

```env
# اختبارات الوحدة
DATABASE_URL=postgresql://test_user:password@test-db.jobilo.com:5432/jobilo_test

# اختبارات E2E
E2E_DATABASE_URL=postgresql://e2e_user:password@test-db.jobilo.com:5432/jobilo_e2e
```

**ملاحظات مهمة:**
- يتم إنشاء قاعدة بيانات منفصلة لكل شوط اختبار
- تُحذف البيانات بعد انتهاء الاختبارات
- لا تحتوي أبدًا على بيانات حقيقية

---

## 4. تعبئة بيانات الاختبارات | Test Data Seeding

```bash
# تعبئة قاعدة بيانات الاختبار
cd backend
NODE_ENV=test npx prisma db push --force-reset
NODE_ENV=test npx prisma db seed

# أو استخدام seed مخصص للاختبارات
NODE_ENV=test npx ts-node prisma/test-seed.ts
```

**بيانات الاختبار:**
- 50 مستخدمًا (مستقلين + عملاء)
- 100 مشروع في حالات مختلفة
- 200 عرض (Proposal)
- 30 عقدًا
- 500 رسالة

---

## 5. تشغيل الاختبارات | Running Tests

```bash
# اختبارات الوحدة (Backend)
cd backend
npm run test

# اختبارات التكامل (Backend)
npm run test:e2e

# اختبارات الوحدة (Frontend)
cd frontend
npm run test

# جميع الاختبارات مرة واحدة
npm run test:all
```

**الأمراض (Scripts) المتاحة:**

| الأمر | الوصف |
|-------|-------|
| `npm run test` | تشغيل اختبارات الوحدة |
| `npm run test:e2e` | تشغيل اختبارات E2E |
| `npm run test:coverage` | تشغيل مع تقرير التغطية |
| `npm run test:watch` | تشغيل مع watch mode |
| `npm run test:ci` | تشغيل للـ CI (بدون تفاعل) |

---

## 6. عرض نتائج الاختبارات | Viewing Test Results

| الأداة | الرابط | الوصف |
|--------|--------|-------|
| **GitHub Actions** | `github.com/jobilo/jobilo/actions` | نتائج الـ Pipeline الكاملة |
| **Jest HTML Report** | `coverage/lcov-report/index.html` | تقرير تغطية الكود |
| **Playwright Report** | `playwright-report/index.html` | تقرير اختبارات E2E |
| **Allure Reports** | `allure-report/index.html` | تقارير تفصيلية (اختياري) |

### معايير القبول:

| المقياس | الحد الأدنى |
|---------|-------------|
| تغطية الكود (Code Coverage) | 80% |
| نجاح اختبارات الوحدة | 100% |
| نجاح اختبارات E2E الحرجة | 100% |
| وقت التنفيذ | < 15 دقيقة |

---

## 7. تقارير الاختبارات | Test Reports

```bash
# إنشاء تقرير التغطية
cd backend
npm run test:coverage

# فتح التقرير
npx http-server coverage -p 8080
```

```bash
# تشغيل Playwright E2E
cd frontend
npx playwright test --reporter=html
npx playwright show-report
```

---

## 8. اختبارات الأمان | Security Testing

| النوع | الأداة | التردد |
|-------|--------|--------|
| Scanning dependencies | `npm audit` | كل build |
| SAST | SonarCloud | كل PR |
| Secret detection | GitLeaks | كل commit |

> راجع [SECURITY_CONFIGURATION.md](./SECURITY_CONFIGURATION.md) للتفاصيل الأمنية.

---

## 9. إدارة بيانات الاختبار | Test Data Management

- يتم إعادة تعيين قاعدة البيانات يوميًا
- تُستخدم **مفاتيح API وهمية** (لا توجد مفاتيح حقيقية)
- **لا توجد** بيانات قابلة للتعريف الشخصي (PII)
- جميع البيانات مشفرة عشوائيًا

---

> **مواضيع ذات صلة:**  
> [DEVELOPMENT.md](./DEVELOPMENT.md) | [STAGING.md](./STAGING.md) | [DATABASE_CONFIGURATION.md](./DATABASE_CONFIGURATION.md) | [RELEASE_CHECKLIST.md](./RELEASE_CHECKLIST.md)
