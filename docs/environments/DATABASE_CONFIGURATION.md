# إعدادات قاعدة البيانات | Database Configuration

> **آخر تحديث:** يوليو 2026  
> **الهدف:** توثيق إعدادات قاعدة البيانات PostgreSQL لمنصة Jobilo

---

## 1. صيغة رابط الاتصال | Connection String Format

```env
# الصيغة العامة
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE

# مثال للتطوير المحلي
DATABASE_URL=postgresql://user:root@localhost:5433/jobilo_dev

# مثال للإنتاج
DATABASE_URL=postgresql://jobilo_app:password@db-main-1.jobilo.internal:5432/jobilo
```

| الجزء | الشرح | مثال محلي | مثال إنتاج |
|-------|-------|-----------|------------|
| **USER** | اسم المستخدم | `user` | `jobilo_app` |
| **PASSWORD** | كلمة المرور | `root` | (مخزنة في Vault) |
| **HOST** | اسم المضيف | `localhost` | `db-main-1.jobilo.internal` |
| **PORT** | المنفذ | `5433` | `5432` |
| **DATABASE** | اسم قاعدة البيانات | `jobilo_dev` | `jobilo` |

---

## 2. إعدادات Pool | Pool Configuration

```env
# إعدادات pool (اختياري)
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10
```

| البيئة | Pool Min | Pool Max | ملاحظات |
|--------|---------|---------|---------|
| **Local** | 2 | 5 | موارد محلية محدودة |
| **Dev** | 2 | 10 | استخدام معتدل |
| **Testing** | 1 | 5 | اختبارات متزامنة قليلة |
| **Staging** | 5 | 15 | محاكاة حركة الإنتاج |
| **Production** | 10 | 50 | حركة مستخدمين عالية |

```typescript
// استخدام pool في Prisma
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  // إعدادات الاتصال
  connection: {
    pool: {
      min: parseInt(process.env.DATABASE_POOL_MIN || '2'),
      max: parseInt(process.env.DATABASE_POOL_MAX || '10'),
    },
  },
});
```

---

## 3. إعدادات SSL حسب البيئة | SSL Settings per Environment

| البيئة | SSL | الوضع | ملاحظات |
|--------|-----|-------|---------|
| **Local** | ❌ معطل | — | اتصال محلي بدون تشفير |
| **Dev** | ✅ مفعّل | `require` | اتصال مشفر |
| **Testing** | ❌ معطل | — | بيئة داخلية |
| **Staging** | ✅ مفعّل | `verify-ca` | اتصال مشفر مع التحقق |
| **Production** | ✅ مفعّل | `verify-full` | أعلى مستوى أمان |

```env
# SSL في الإنتاج
DATABASE_URL=postgresql://app:password@db-host:5432/jobilo?sslmode=verify-full&sslrootcert=/etc/ssl/certs/ca-cert.pem
```

---

## 4. استراتيجية الترحيل | Migration Strategy

```bash
# إنشاء ترحيل جديد بعد تعديل schema.prisma
cd backend
npx prisma migrate dev --name add_user_avatar

# تطبيق الترحيلات في الإنتاج
npx prisma migrate deploy

# إعادة تعيين (للبيئات غير الإنتاجية فقط)
npx prisma migrate reset --force
```

| الأمر | الاستخدام | البيئة |
|-------|-----------|--------|
| `prisma migrate dev` | إنشاء + تطبيق أثناء التطوير | Local |
| `prisma migrate deploy` | تطبيق الترحيلات المعلقة | Staging, Production |
| `prisma migrate reset` | إعادة تعيين + حذف البيانات | Local, Dev |
| `prisma db push` | مزامنة سريعة (بدون ترحيل) | Local, Dev |

**سياسة الترحيل:**
- كل ترحيل يجب أن يكون **قابلًا للتراجع** (Reversible)
- يتم اختبار الترحيلات في Staging قبل الإنتاج
- ترحيلات قاعدة البيانات **جزء من الإصدار** (Release)
- يتم أخذ نسخة احتياطية قبل تطبيق الترحيلات في الإنتاج

> راجع [ROLLBACK_GUIDE.md](./ROLLBACK_GUIDE.md) للتراجع عن الترحيلات.

---

## 5. جدول النسخ الاحتياطي والاحتفاظ | Backup Schedule & Retention

| التكرار | النوع | وقت التنفيذ (UTC) | الاحتفاظ | الموقع |
|---------|-------|-------------------|----------|--------|
| **كل 6 ساعات** | كامل | 00:00, 06:00, 12:00, 18:00 | 30 يومًا | S3 (مشفّر) |
| **يومي** | كامل | 23:00 | 90 يومًا | S3 (مشفّر) |
| **شهري** | كامل | أول يوم من الشهر | 12 شهرًا | S3 Glacier |
| **WAL (مستمر)** | Incremental | كل 5 دقائق | 7 أيام | S3 Standard |

```bash
# النسخ الاحتياطي اليدوي
pg_dump -Fc -h localhost -p 5433 -U user -d jobilo_dev > backup_$(date +%Y%m%d).dump

# استعادة من نسخة احتياطية
pg_restore -h localhost -p 5433 -U user -d jobilo_dev --clean backup_20260706.dump
```

---

## 6. إجراءات الاستعادة | Restoration Procedure

```mermaid
flowchart TD
    A[حدد نقطة الاستعادة] --> B{نوع الاستعادة}
    B -->|كامل| C[استعادة آخر نسخة كاملة]
    B -->|Point-in-Time| D[استعادة النسخة الكاملة + WAL]
    C --> E[التحقق من سلامة البيانات]
    D --> E
    E --> F[اختبار التطبيق]
    F --> G[توجيه حركة المرور]
```

```bash
# خطوات الاستعادة:
# 1. إيقاف التطبيق
systemctl stop jobilo-api

# 2. استعادة قاعدة البيانات
pg_restore -h db-host -U app -d jobilo --clean /backups/jobilo_20260706_000000.dump

# 3. التحقق من Integrity
psql -h db-host -U app -d jobilo -c "SELECT count(*) FROM users;"

# 4. تشغيل التطبيق
systemctl start jobilo-api
```

---

## 7. مراقبة الأداء | Monitoring Queries

```sql
-- الاستعلامات البطيئة
SELECT query, calls, total_time / calls AS avg_time_ms
FROM pg_stat_statements
ORDER BY avg_time_ms DESC
LIMIT 10;

-- اتصالات نشطة
SELECT pid, state, application_name, query_start, query
FROM pg_stat_activity
WHERE state != 'idle'
ORDER BY query_start DESC;

-- حجم قاعدة البيانات
SELECT pg_database_size('jobilo') / 1024 / 1024 AS size_mb;

-- الجداول الأكبر حجمًا
SELECT relname, n_live_tup, pg_size_pretty(pg_total_relation_size(relid))
FROM pg_stat_user_tables
ORDER BY pg_total_relation_size(relid) DESC
LIMIT 10;
```

**أدوات المراقبة:**
- **pg_stat_statements** — تحليل أداء الاستعلامات
- **pg_stat_activity** — مراقبة الاتصالات النشطة
- **pg_stat_replication** — مراقبة التكرار
- **Grafana + Prometheus** — لوحات مراقبة الأداء

> راجع [LOGGING_CONFIGURATION.md](./LOGGING_CONFIGURATION.md) و [PRODUCTION.md](./PRODUCTION.md) للمزيد.

---

> **مواضيع ذات صلة:**  
> [ENV_VARIABLES.md](./ENV_VARIABLES.md) | [PRODUCTION.md](./PRODUCTION.md) | [ROLLBACK_GUIDE.md](./ROLLBACK_GUIDE.md) | [SECURITY_CONFIGURATION.md](./SECURITY_CONFIGURATION.md) | [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
