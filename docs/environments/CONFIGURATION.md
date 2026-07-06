# إدارة الإعدادات | Configuration Management

> **آخر تحديث:** يوليو 2026  
> **الهدف:** توثيق كيفية إدارة إعدادات التطبيق في Jobilo

---

## 1. كيف يتم تحميل الإعدادات | How Config is Loaded

يستخدم Jobilo **NestJS ConfigModule** مع ملف `app.config.ts` لتحميل الإعدادات:

```typescript
// backend/src/config/app.config.ts
export default () => ({
  port: parseInt(process.env.PORT, 10) || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
    refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
  },
  database: {
    url: process.env.DATABASE_URL,
  },
  openai: { ... },
  cloudinary: { ... },
  resend: { ... },
  cors: {
    origins: (process.env.CORS_ORIGINS || 'http://localhost:3000').split(','),
  },
  rateLimit: {
    ttl: parseInt(process.env.RATE_LIMIT_TTL, 10) || 60,
    max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  },
  app: {
    url: process.env.APP_URL || 'http://localhost:3000',
    apiUrl: process.env.API_URL || 'http://localhost:4000',
  },
});
```

**سلسلة التحميل:**
```
.env file → process.env → ConfigModule → app.config.ts → ConfigService
```

1. NestJS يقرأ ملف `.env` تلقائيًا
2. `app.config.ts` يعيِّن القيم الافتراضية للمتغيرات المفقودة
3. `ConfigService` يوفر واجهة موحدة للوصول إلى الإعدادات

> راجع [app.config.ts](../../backend/src/config/app.config.ts) للمصدر الكامل.

---

## 2. هيكل الإعدادات المتداخل | Nested Config Structure

```
appConfig
├── port                  # number
├── nodeEnv               # string
├── jwt
│   ├── accessSecret      # string (required)
│   ├── refreshSecret     # string (required)
│   ├── accessExpiry      # string (default: 15m)
│   └── refreshExpiry     # string (default: 7d)
├── database
│   └── url               # string (required)
├── openai
│   ├── apiKey            # string (required)
│   ├── model             # string (default: gpt-4o-mini)
│   └── maxTokens         # number (default: 2000)
├── cloudinary
│   ├── cloudName         # string (required)
│   ├── apiKey            # string (required)
│   └── apiSecret         # string (required)
├── resend
│   ├── apiKey            # string (required)
│   └── from              # string (default: noreply@jobilo.com)
├── cors
│   └── origins           # string[] (default: ['http://localhost:3000'])
├── rateLimit
│   ├── ttl               # number (default: 60)
│   └── max               # number (default: 100)
├── app
│   ├── url               # string (default: http://localhost:3000)
│   └── apiUrl            # string (default: http://localhost:4000)
└── stripe
    ├── secretKey         # string (required)
    └── webhookSecret     # string (required)
```

> راجع [ENV_VARIABLES.md](./ENV_VARIABLES.md) للقائمة الكاملة للمتغيرات.

---

## 3. الوصول إلى الإعدادات في الخدمات | Accessing Config in Services

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(private configService: ConfigService) {}

  getJwtSecret(): string {
    return this.configService.get<string>('jwt.accessSecret');
  }

  getDatabaseUrl(): string {
    return this.configService.get<string>('database.url');
  }

  // الوصول إلى القيم المتداخلة
  getPort(): number {
    return this.configService.get<number>('port');
  }
}
```

**أنماط الوصول:**
- `configService.get('key')` — إرجاع `T | undefined`
- `configService.getOrThrow('key')` — يرمي خطأ إذا كانت القيمة `undefined`
- `configService.get<Type>('nested.key')` — وصول متداخل بنقطة

---

## 4. تجاوز الإعدادات حسب البيئة | Environment-Specific Overrides

يتم تجاوز الإعدادات عبر **ملفات `.env` مختلفة** أو **متغيرات بيئة النظام**:

```bash
# بيئة الإنتاج (عبر CI/CD)
NODE_ENV=production
PORT=4000
CORS_ORIGINS=https://jobilo.com,https://www.jobilo.com
RATE_LIMIT_MAX=50
```

| الأولوية | المصدر |
|----------|--------|
| 1 (أعلى) | متغيرات بيئة النظام (process.env) |
| 2 | ملف `.env` في جذر المشروع |
| 3 | ملف `.env.local` (للتجاوزات المحلية) |
| 4 (أدنى) | القيم الافتراضية في `app.config.ts` |

> راجع [SECRETS_MANAGEMENT.md](./SECRETS_MANAGEMENT.md) لإدارة الأسرار عبر البيئات.

---

## 5. التحقق من صحة الإعدادات | Validation of Required Config

```typescript
// مثال على التحقق عند بدء التشغيل
function validateConfig(config: ConfigService): void {
  const requiredVars = [
    'database.url',
    'jwt.accessSecret',
    'jwt.refreshSecret',
    'openai.apiKey',
    'cloudinary.cloudName',
    'cloudinary.apiKey',
    'cloudinary.apiSecret',
    'resend.apiKey',
  ];

  for (const key of requiredVars) {
    if (!config.get(key)) {
      throw new Error(`Missing required config: ${key}`);
    }
  }
}
```

**في الإنتاج:**
- يُستخدم `ConfigModule.forRoot({ validationSchema: Joi.object({...}) })` للتحقق باستخدام Joi
- يُمنع تشغيل الخادم إذا كانت الإعدادات الإلزامية مفقودة
- يتم تسجيل تحذير (Warning) للقيم الافتراضية المستخدمة

---

## 6. أفضل الممارسات | Best Practices

| الممارسة | الشرح |
|----------|--------|
| ✅ استخدام `ConfigService` | لا تقرأ `process.env` مباشرة في الخدمات |
| ✅ تحديد قيم افتراضية | لكل متغير اختياري قيمة افتراضية آمنة |
| ✅ التحقق عند بدء التشغيل | تأكد من وجود جميع المتغيرات الإلزامية |
| ✅ تجميع الإعدادات | استخدم كائنات متداخلة للتنظيم |
| ❌ لا تشارك الأسرار | لا تطبع أو تسجل المفاتيح السرية |
| ❌ لا تستخدم القيم الافتراضية للإنتاج | الإنتاج يتطلب إعدادات صريحة |

---

## 7. إعدادات إضافية | Additional Configuration

| الملف | الوصف |
|-------|-------|
| `backend/src/config/app.config.ts` | الإعدادات الأساسية للباك إند |
| `backend/.env` | متغيرات البيئة المحلية |
| `backend/prisma/schema.prisma` | إعدادات قاعدة البيانات |
| `frontend/.env.local` | متغيرات البيئة للفرونت إند |

---

> **مواضيع ذات صلة:**  
> [ENV_VARIABLES.md](./ENV_VARIABLES.md) | [SECRETS_MANAGEMENT.md](./SECRETS_MANAGEMENT.md) | [ENVIRONMENTS.md](./ENVIRONMENTS.md) | [app.config.ts](../../backend/src/config/app.config.ts)
