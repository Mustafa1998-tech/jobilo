# بيئة الإنتاج | Production Environment

> **آخر تحديث:** يوليو 2026  
> **URL:** `https://jobilo.com` | `https://api.jobilo.com`  
> **الهدف:** البيئة المباشرة للمستخدمين النهائيين

---

## 1. مواصفات البيئة | Environment Specifications

| المكون | المواصفة |
|--------|----------|
| **CPU** | 8 vCPUs (Intel Xeon / AMD EPYC) |
| **RAM** | 32 GB |
| **التخزين** | 500 GB NVMe SSD (قابل للتوسع) |
| **الشبكة** | 10 Gbps مع CDN |
| **نظام التشغيل** | Ubuntu 24.04 LTS |
| **الحاوية** | Docker + Kubernetes (اختياري) |

---

## 2. التوفر العالي | High Availability Setup

```mermaid
flowchart TD
    A[User] --> B[Cloudflare CDN]
    B --> C[Load Balancer 1]
    B --> D[Load Balancer 2]
    C --> E[App Server 1]
    C --> F[App Server 2]
    D --> G[App Server 3]
    D --> H[App Server 4]
    E --> I[(Primary DB)]
    F --> I
    G --> I
    H --> I
    I --> J[(Replica DB 1)]
    I --> K[(Replica DB 2)]
```

| المكون | العدد | ملاحظات |
|--------|-------|---------|
| خوادم التطبيق | 4+ | في مناطق توفر مختلفة |
| Load Balancer | 2 | Nginx + HAProxy (استباق) |
| قاعدة البيانات الأساسية | 1 | PostgreSQL 16 |
| قواعد البيانات التابعة | 2 | Read Replicas للقراءة |

---

## 3. موازنة التحميل | Load Balancing

**الموازن:** Nginx (عكسي) + AWS ALB / HAProxy

```nginx
# nginx.conf - تكوين موازنة التحميل
upstream jobilo_backend {
    least_conn;
    server app1.jobilo.internal:4000 weight=5;
    server app2.jobilo.internal:4000 weight=5;
    server app3.jobilo.internal:4000 weight=3;
    server app4.jobilo.internal:4000 weight=3;
    keepalive 32;
}

server {
    listen 443 ssl http2;
    server_name api.jobilo.com;

    location / {
        proxy_pass http://jobilo_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 4. تكرار قاعدة البيانات | Database Replication

**طريقة التكرار:** Streaming Replication (PostgreSQL 16)

| الخادم | الدور | النوع | المنطقة |
|--------|-------|------|---------|
| `db-1` | Primary | قراءة + كتابة | us-east-1 |
| `db-2` | Replica | قراءة فقط | us-east-1 |
| `db-3` | Replica | قراءة فقط | us-west-1 |

```env
# فصل القراءة والكتابة
DATABASE_URL=postgresql://app:password@db-1:5432/jobilo      # Primary (اكتب)
DATABASE_READ_REPLICA=postgresql://app:password@db-2:5432/jobilo  # Replica (اقرأ)
```

---

## 5. استراتيجية النسخ الاحتياطي | Backup Strategy

| النوع | التكرار | الاحتفاظ | الهدف |
|-------|---------|----------|-------|
| **كامل** | كل 6 ساعات | 30 يومًا | استعادة كاملة |
| **WAL** | مستمر (كل 5 دقائق) | 7 أيام | Point-in-Time Recovery |
| **يومي** | يوميًا | 90 يومًا | احتياطي طويل الأمد |
| **شهري** | شهريًا | 12 شهرًا | أرشفة |

**الأداة:** `pg_dump` + `wal-g` (مخزن على S3 مع تشفير)

```bash
# النسخ الاحتياطي اليومي
pg_dump -Fc -h db-1 -U app -d jobilo > /backups/jobilo_$(date +%Y%m%d_%H%M%S).dump

# الاستعادة
pg_restore -h new-db -U app -d jobilo /backups/jobilo_20260701_120000.dump
```

> راجع [DATABASE_CONFIGURATION.md](./DATABASE_CONFIGURATION.md) للتفاصيل.

---

## 6. المراقبة والتنبيهات | Monitoring & Alerting

| الأداة | الغرض | التنبيهات |
|--------|-------|-----------|
| **Sentry** | تتبع الأخطاء | 🔔 أي خطأ جديد |
| **Datadog / Grafana** | مقاييس الأداء | 🔔 CPU > 80%, RAM > 85% |
| **PagerDuty** | الإخطار للحالات الطارئة | 🔔 انقطاع الخدمة |
| **Uptime Robot** | مراقبة التوفر | 🔔 Downtime > 5 دقائق |
| **Loki + Promtail** | تجميع السجلات | 🔔 معدل خطأ > 1% |

**لوحات المعلومات (Dashboards):**
- `https://grafana.jobilo.com/d/api` — أداء API
- `https://grafana.jobilo.com/d/db` — أداء قاعدة البيانات
- `https://sentry.jobilo.com/production` — أخطاء الإنتاج

> راجع [LOGGING_CONFIGURATION.md](./LOGGING_CONFIGURATION.md).

---

## 7. الاستجابة للحوادث | Incident Response

| المستوى | الوصف | وقت الاستجابة | مثال |
|---------|-------|---------------|------|
| **P0** | انقطاع تام | < 5 دقائق | الموقع لا يعمل |
| **P1** | ميزة رئيسية معطلة | < 15 دقيقة | لا يمكن تسجيل الدخول |
| **P2** | ميزة ثانوية معطلة | < 1 ساعة | مشكلة في البحث |
| **P3** | خطأ تجميلي بسيط | < 24 ساعة | خطأ في الترجمة |

**خطوات الاستجابة:**
1. **كشف** ← التنبيه التلقائي (Sentry/PagerDuty)
2. **تصنيف** ← تحديد مستوى الخطورة
3. **استجابة** ← الفريق المناوب يتولى
4. **حل** ← إصلاح أو تراجع (راجع [ROLLBACK_GUIDE.md](./ROLLBACK_GUIDE.md))
5. **مراجعة** ← Post-mortem بعد الحل

---

## 8. نوافذ الصيانة | Maintenance Windows

| اليوم | التوقيت | المدة | النشاط |
|-------|---------|-------|--------|
| الأحد | 02:00 - 04:00 صباحًا (UTC) | 2 ساعة | تحديثات أمنية |
| الأربعاء | 02:00 - 04:00 صباحًا (UTC) | 2 ساعة | إصدارات جديدة |

**سياسة الصيانة:**
- يتم الإعلان قبل 48 ساعة على الأقل
- إشعار عبر البريد الإلكتروني للمستخدمين
- الصيانة خلال أقل أوقات الاستخدام (حسب التحليلات)
- يتم نشر التحديثات تدريجيًا (Rolling Update)

---

## 9. جدول متغيرات البيئة | Environment Variables Table

| المتغير | القيمة في الإنتاج |
|----------|------------------|
| `NODE_ENV` | `production` |
| `PORT` | `4000` |
| `CORS_ORIGINS` | `https://jobilo.com,https://www.jobilo.com` |
| `RATE_LIMIT_TTL` | `60` |
| `RATE_LIMIT_MAX` | `50` |
| `JWT_ACCESS_EXPIRY` | `15m` |
| `JWT_REFRESH_EXPIRY` | `7d` |
| `SENTRY_DSN` | `https://xxx@sentry.jobilo.com/prod` |

> راجع [ENV_VARIABLES.md](./ENV_VARIABLES.md) للقائمة الكاملة.

---

## 10. تكوين SSL/TLS | SSL/TLS Configuration

| الخاصية | القيمة |
|----------|--------|
| **الشهادة** | Let's Encrypt / Enterprise |
| **البروتوكول** | TLS 1.3 (1.2 كاحتياطي) |
| **HTTP→HTTPS** | إعادة توجيه إجباري |
| **HSTS** | `max-age=31536000; includeSubDomains` |

```bash
# إعادة توجيه HTTP إلى HTTPS
server {
    listen 80;
    server_name jobilo.com www.jobilo.com;
    return 301 https://$server_name$request_uri;
}
```

> راجع [SECURITY_CONFIGURATION.md](./SECURITY_CONFIGURATION.md).

---

## 11. إعداد CDN | CDN Setup

| المورد | CDN | النطاق الفرعي |
|--------|-----|---------------|
| **الصور الثابتة** | Cloudinary | `images.jobilo.com` |
| **الملفات المرفوعة** | Cloudinary | `files.jobilo.com` |
| **الملفات الثابتة (CSS/JS)** | Cloudflare | `static.jobilo.com` |

> راجع [STORAGE_CONFIGURATION.md](./STORAGE_CONFIGURATION.md).

---

## 12. التعافي من الكوارث | Disaster Recovery

| السيناريو | RPO | RTO | الإجراء |
|-----------|-----|-----|---------|
| فشل خادم تطبيق | 0 | < 5 دقائق | خادم آخر يستلم |
| فشل قاعدة البيانات الأساسية | < 5 دقائق | < 30 دقيقة | التبديل إلى Replica |
| فشل كامل في المنطقة | < 1 ساعة | < 4 ساعات | التبديل إلى المنطقة الأخرى |
| هجوم سيبراني | < 1 ساعة | < 8 ساعات | استعادة من النسخ الاحتياطي |

**خطة التعافي:**
1. تفعيل خطة الطوارئ (DR Plan)
2. التبديل إلى المنطقة الاحتياطية
3. استعادة أحدث نسخة احتياطية
4. التحقق من سلامة البيانات
5. إعادة توجيه DNS
6. إخطار المستخدمين

> راجع [ROLLBACK_GUIDE.md](./ROLLBACK_GUIDE.md).

---

> **مواضيع ذات صلة:**  
> [STAGING.md](./STAGING.md) | [ENV_VARIABLES.md](./ENV_VARIABLES.md) | [SECURITY_CONFIGURATION.md](./SECURITY_CONFIGURATION.md) | [DATABASE_CONFIGURATION.md](./DATABASE_CONFIGURATION.md) | [ROLLBACK_GUIDE.md](./ROLLBACK_GUIDE.md)
