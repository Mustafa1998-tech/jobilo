# إعدادات البريد الإلكتروني | Email Configuration

> **آخر تحديث:** يوليو 2026  
> **الهدف:** توثيق نظام البريد الإلكتروني في Jobilo عبر Resend.com

---

## 1. التكامل مع Resend | Resend.com Integration

يستخدم Jobilo **Resend.com** كخدمة البريد الإلكتروني الأساسية.

```env
# إعدادات Resend
RESEND_API_KEY=re_123456789abcdef
RESEND_FROM=Jobilo <noreply@jobilo.com>
```

### إعداد Resend:

```bash
# 1. إنشاء حساب في https://resend.com
# 2. إضافة النطاق (jobilo.com) والتحقق من ملكيته عبر DNS
# 3. إنشاء API Key
# 4. إضافة المفتاح إلى .env أو Vault
```

> راجع [SECRETS_MANAGEMENT.md](./SECRETS_MANAGEMENT.md) و [ENV_VARIABLES.md](./ENV_VARIABLES.md).

---

## 2. خدمة البريد الإلكتروني | Email Service

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor(private configService: ConfigService) {
    this.resend = new Resend(configService.get('resend.apiKey'));
  }

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    await this.resend.emails.send({
      from: this.configService.get('resend.from'),
      to,
      subject,
      html,
    });
  }

  async sendVerificationEmail(email: string, otp: string): Promise<void> {
    const html = `
      <div dir="rtl" style="font-family: 'Cairo', sans-serif;">
        <h1>مرحبًا بك في Jobilo!</h1>
        <p>رمز التحقق الخاص بك هو:</p>
        <h2 style="color: #4F46E5; font-size: 32px; letter-spacing: 8px;">${otp}</h2>
        <p>ينتهي هذا الرمز بعد 10 دقائق.</p>
        <hr>
        <p style="color: #666;">إذا لم تطلب هذا الرمز، يرجى تجاهل هذه الرسالة.</p>
      </div>
    `;
    await this.sendEmail(email, '📧 تأكيد البريد الإلكتروني | Verify Your Email', html);
  }
}
```

---

## 3. قوالب البريد الإلكتروني | Email Templates

| القالب | المشغل | المحتوى | اللغة |
|--------|--------|---------|-------|
| **تأكيد البريد الإلكتروني** | التسجيل | رمز OTP مكون من 6 أرقام | عربي + إنجليزي |
| **إعادة تعيين كلمة المرور** | نسيت كلمة المرور | رابط إعادة التعيين (صلاحية 1 ساعة) | عربي + إنجليزي |
| **إشعار برسالة جديدة** | رسالة جديدة | اسم المرسل + مقتطف من الرسالة | عربي + إنجليزي |
| **تحديث حالة المشروع** | تغيير حالة المشروع | الحالة الجديدة + رابط المشروع | عربي + إنجليزي |
| **إشعار العروض** | عرض جديد على مشروعك | اسم المستقل + مبلغ العرض | عربي + إنجليزي |
| **تأكيد العقد** | توقيع العقد | رابط العقد + ملخص الشروط | عربي + إنجليزي |
| **إشعار الدفع** | إتمام الدفع | المبلغ + تاريخ الدفع | عربي + إنجليزي |
| **إشعار النزاع** | فتح نزاع | تفاصيل النزاع + رابط | عربي + إنجليزي |

### مثال قالب HTML (ثنائي اللغة):

```html
<!DOCTYPE html>
<html dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Cairo', Arial, sans-serif; background: #f4f4f4; padding: 20px;">
  <table style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px;">
    <tr>
      <td style="padding: 30px; text-align: center; background: #4F46E5; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0;">Jobilo</h1>
        <p style="color: #ddd; margin: 5px 0 0;">سوق العمل الحر بالعربية</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 30px;">
        {{content_ar}}
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        {{content_en}}
      </td>
    </tr>
    <tr>
      <td style="padding: 15px 30px; text-align: center; color: #999; font-size: 12px;">
        <p>© 2026 Jobilo. جميع الحقوق محفوظة.</p>
        <p><a href="https://jobilo.com" style="color: #4F46E5;">jobilo.com</a></p>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## 4. الإعدادات حسب البيئة | Per-Environment Settings

| البيئة | وضع الإرسال | RESEND_API_KEY | البريد الإلكتروني للمرسل | ملاحظات |
|--------|-------------|----------------|--------------------------|---------|
| **Local** | **محجوب (Blocked)** | قيمة وهمية | `noreply@jobilo.com` | يُسجَّل في console فقط |
| **Dev** | **صندوق اختبار** | `re_test_xxx` | `dev@jobilo.com` | يُحتجز في Resend Test Mode |
| **Testing** | **محجوب** | ❌ معطل | — | لا ترسل بريدًا أثناء الاختبارات |
| **Staging** | **صندوق اختبار** | `re_test_xxx` | `staging@jobilo.com` | يُحتجز في Resend Test Mode |
| **Production** | **فعال** | مفتاح حقيقي | `noreply@jobilo.com` | إرسال فعلي للمستخدمين |

```typescript
// منطق إرسال البريد حسب البيئة
if (process.env.NODE_ENV === 'production') {
  await this.resend.emails.send({ ... });
} else if (process.env.NODE_ENV === 'development') {
  console.log(`[EMAIL] To: ${to}, Subject: ${subject}`);
  console.log(`[EMAIL] HTML: ${html.substring(0, 200)}...`);
} else {
  // Testing: لا تفعل شيئًا
}
```

---

## 5. اختبار البريد الإلكتروني في التطوير | Testing Emails in Development

### 5.1 سجل Console (Local)

في البيئة المحلية، تُسجَّل رسائل البريد في console بدلاً من إرسالها:

```bash
# مثال على سجل console
[EMAIL] To: test@example.com
[EMAIL] Subject: 📧 تأكيد البريد الإلكتروني | Verify Your Email
[EMAIL] HTML: <div dir="rtl">...<h2>123456</h2>...</div>
```

### 5.2 Resend Test Mode (Dev/Staging)

```env
# في Dev و Staging
RESEND_API_KEY=re_test_xxxxxxxxx  # مفتاح اختبار من Resend
```

مع وضع الاختبار:
- ✅ تُرسَل رسائل البريد ولكن لا تُسَلَّم فعليًا
- ✅ يمكن عرضها في لوحة تحكم Resend (قسم "Test Emails")
- ✅ لا تُحتسب ضمن حصة الإرسال
- ❌ لا تصل إلى البريد الوارد الحقيقي

### 5.3 أدوات اختبار البريد (اختياري):

| الأداة | الوصف |
|--------|-------|
| **Mailpit** | واجهة محلية لعرض رسائل البريد |
| **MailHog** | أداة اختبار SMTP محلية |
| **Etcher** | أداة اختبار رسائل البريد HTML |

```bash
# تشغيل Mailpit محليًا
docker run -d --name mailpit -p 1025:1025 -p 8025:8025 axllent/mailpit
# عرض: http://localhost:8025
```

---

## 6. إمكانية تسليم البريد | Email Deliverability

### إعدادات DNS (SPF, DKIM, DMARC):

```dns
# TXT Record: SPF
jobilo.com.  IN  TXT  "v=spf1 include:spf.resend.com ~all"

# TXT Record: DKIM (يوفره Resend)
resend._domainkey.jobilo.com.  IN  TXT  "k=rsa; p=MIIBIjANBgkqhkiG9w0BAQ..."

# TXT Record: DMARC
_dmarc.jobilo.com.  IN  TXT  "v=DMARC1; p=quarantine; rua=mailto:dmarc@jobilo.com"
```

### أفضل الممارسات:

| الممارسة | التفاصيل |
|----------|---------|
| ✅ تسخين النطاق (Warming up) | ابدأ بحجم صغير وزده تدريجيًا |
| ✅ مراقبة السمعة (Reputation) | راجع لوحة Resend dashboard بانتظام |
| ✅ تجنب كلمات Spam | لا تستخدم "مجاني", "اكسب المال", إلخ. |
| ✅ تنسيق HTML متوافق | اختبر على Gmail و Outlook |
| ✅ روابط إلغاء الاشتراك | تأكد من وجود رابط إلغاء في كل بريد |
| ❌ عدم إرسال كميات كبيرة فجأة | زيادة تدريجية لتجنب حظر IP |

---

> **مواضيع ذات صلة:**  
> [ENV_VARIABLES.md](./ENV_VARIABLES.md) | [SECRETS_MANAGEMENT.md](./SECRETS_MANAGEMENT.md) | [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) | [LOCAL_DEVELOPMENT.md](./LOCAL_DEVELOPMENT.md)
