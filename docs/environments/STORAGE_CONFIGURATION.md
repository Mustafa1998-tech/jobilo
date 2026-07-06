# إعدادات تخزين الملفات | Storage Configuration

> **آخر تحديث:** يوليو 2026  
> **الهدف:** توثيق نظام تخزين الملفات في Jobilo

---

## 1. نظرة عامة | Overview

تستخدم Jobilo **نظام تخزين هجين**:

| البيئة | التخزين المحلي | التخزين السحابي |
|--------|----------------|-----------------|
| **Local** | ✅ `./uploads/` | ❌ |
| **Dev** | ❌ | ✅ Cloudinary (بيئة تجريبية) |
| **Testing** | ✅ `./test-uploads/` | ❌ |
| **Staging** | ❌ | ✅ Cloudinary (اختبار) |
| **Production** | ❌ | ✅ Cloudinary (إنتاج) |

---

## 2. Cloudinary (الإنتاج) | Cloudinary for Production

```env
# إعدادات Cloudinary
CLOUDINARY_CLOUD_NAME=jobilo
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abc123def456
CLOUDINARY_FOLDER=jobilo
```

**الميزات المستخدمة من Cloudinary:**
- رفع الصور والملفات
- تحويل الصور (تغيير الحجم، الاقتصاص، تحسين الجودة)
- CDN مدمج (توزيع عالمي)
- تحسين الصور للجوال
- صور WebP تلقائية

> راجع [ENV_VARIABLES.md](./ENV_VARIABLES.md).

### مثال على الرفع:

```typescript
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadFile(file: Express.Multer.File): Promise<string> {
  const result = await cloudinary.uploader.upload(file.path, {
    folder: process.env.CLOUDINARY_FOLDER,
    resource_type: 'auto',  // auto-detect: image, video, raw
    transformation: [
      { quality: 'auto', fetch_format: 'auto' },  // تحسين تلقائي
    ],
  });
  return result.secure_url;
}
```

---

## 3. التخزين المحلي (التطوير) | Local Storage for Development

```typescript
// تخزين محلي باستخدام multer
import { diskStorage } from 'multer';
import { extname, join } from 'path';

const storage = diskStorage({
  destination: join(__dirname, '..', 'uploads'),
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
  },
});
```

**بنية مجلد `uploads/`:**

```
uploads/
├── avatars/          # صور الملفات الشخصية
├── projects/         # مرفقات المشاريع
├── proposals/        # مرفقات العروض
├── messages/         # مرفقات الرسائل
├── portfolios/       # صور البورتفوليو
├── banners/          # صور البانرات الإعلانية
└── temp/             # ملفات مؤقتة (تُحذف بعد 24 ساعة)
```

---

## 4. حدود رفع الملفات | File Upload Limits

```typescript
// backend/src/main.ts
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
```

| نوع الملف | الحد الأقصى | البيئات |
|-----------|-------------|---------|
| **الصور** | 10 MB | جميع البيئات |
| **المستندات** (PDF, DOC) | 25 MB | جميع البيئات |
| **الفيديو** | 100 MB | الإنتاج فقط |
| **الملفات المضغوطة** (ZIP) | 50 MB | الإنتاج فقط |
| **السير الذاتية** | 10 MB | جميع البيئات |
| **البورتفوليو** | 10 MB لكل صورة | جميع البيئات |

---

## 5. أنواع الملفات المسموح بها | Allowed File Types

| الفئة | الامتدادات المسموح بها | حالات الاستخدام |
|-------|-----------------------|-----------------|
| **الصور** | `.jpg, .jpeg, .png, .gif, .webp, .svg` | الصورة الشخصية، صور المشاريع |
| **المستندات** | `.pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx` | السيرة الذاتية، العقود |
| **المقاطع الصوتية** | `.mp3, .wav, .ogg` | رسائل صوتية |
| **الفيديو** | `.mp4, .webm, .mov` | عروض فيديو |
| **النصوص** | `.txt, .csv, .json, .xml` | ملفات بيانات |
| **الأخرى** | `.zip, .rar` | مشاريع كاملة |

```typescript
const ALLOWED_FILE_TYPES = {
  image: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
  document: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'],
  video: ['mp4', 'webm', 'mov'],
  audio: ['mp3', 'wav', 'ogg'],
};

function validateFileType(filename: string): boolean {
  const ext = extname(filename).toLowerCase().slice(1);
  return Object.values(ALLOWED_FILE_TYPES).some(types => types.includes(ext));
}
```

---

## 6. بنية التخزين في Cloudinary | Storage Structure

```
jobilo/                          # الجذر (CLOUDINARY_FOLDER)
├── avatars/
│   ├── user_001_avatar.jpg
│   └── user_002_avatar.jpg
├── projects/
│   ├── project_100/
│   │   ├── overview.png
│   │   └── requirements.pdf
│   └── project_101/
│       └── design.jpg
├── proposals/
│   ├── proposal_500/
│   │   └── portfolio.pdf
├── logos/
│   ├── client_50_logo.png
├── banners/
│   ├── promo_1.jpg
└── temp/                        # ملفات مؤقتة (TTL: 24 ساعة)
    └── upload_abc123.jpg
```

---

## 7. تكامل CDN | CDN Integration

توفر Cloudinary CDN مدمجًا. جميع الملفات تُوزَّع عبر CDN تلقائيًا:

| النطاق | الوجهة | مثال |
|--------|--------|------|
| `res.cloudinary.com/jobilo/` | Cloudinary CDN | رابط مباشر للصورة |
| `images.jobilo.com` | CNAME → Cloudinary | نطاق مخصص |

```bash
# تحويل URL إلى Cloudinary
# исходный: /uploads/avatars/user_001.jpg
# Cloudinary: https://res.cloudinary.com/jobilo/image/upload/v1234567/avatars/user_001.jpg

# مع تحسينات:
# https://res.cloudinary.com/jobilo/image/upload/q_auto,f_auto,w_300/v1234567/avatars/user_001.jpg
```

**فوائد CDN:**
- ⚡ سرعة تحميل عالية عالميًا
- 📱 تحويل تلقائي إلى WebP (حجم أقل 30-50%)
- 🖼️ تغيير حجم الصور حسب الجهاز
- 🔒 تشفير HTTPS

---

> **مواضيع ذات صلة:**  
> [ENV_VARIABLES.md](./ENV_VARIABLES.md) | [PRODUCTION.md](./PRODUCTION.md) | [SECURITY_CONFIGURATION.md](./SECURITY_CONFIGURATION.md) | [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
