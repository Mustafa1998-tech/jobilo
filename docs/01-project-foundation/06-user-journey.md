# Jobilo - User Journey Maps

---

## Journey 1: Freelancer Journey - من البحث إلى الاستلام

### Stage 1: Discovery & Signup
| الخطوة | الإجراء | Screen | المشاعر | Notes |
|--------|---------|--------|---------|-------|
| 1.1 | يسمع عن Jobilo من صديق/إعلان | - | 😊 فضول | Landing page مقنعة |
| 1.2 | يزور الموقع لأول مرة | Homepage | 🤔 انطباع أول | تصميم جذاب، سرعة تحميل |
| 1.3 | يقرأ عن المميزات | About/Features | 😌 اهتمام | AI features ملفتة |
| 1.4 | يضغط "اشترك كمستقل" | Signup | 😊 حماس | نموذج بسيط |
| 1.5 | يملأ: الاسم، البريد، كلمة السر | Signup Form | 😊 سريع | Google OAuth option |
| 1.6 | يؤكد البريد الإلكتروني | Email | 😐 انتظار | Verification email |
| 1.7 | يكمل الملف الشخصي | Profile Setup | 😅 كثير شوي | Guided wizard |

**Success**: حساب مفعل، ملف شخصي 50% مكتمل
**Failure**: بريد غير صحيح، عدم تأكيد الحساب
**Drop-off Risk**: نموذج طويل، إيميل تأكيد لا يصل

### Stage 2: Profile Creation
| الخطوة | الإجراء | Screen | المشاعر | Notes |
|--------|---------|--------|---------|-------|
| 2.1 | يضيف الصورة الشخصية | Edit Profile | 🙂 بسيط | AI تحسين الصورة |
| 2.2 | يكتب المهارات (Skills) | Edit Profile | 🤔 تفكير | AI اقتراحات مهارات |
| 2.3 | يضيف الخبرات السابقة | Edit Profile | 😐 متوسط | إضافة 3+ خبرات |
| 2.4 | يرفع أعماله (Portfolio) | Portfolio | 😊 فخر | صور، روابط |
| 2.5 | يكتب السيرة الذاتية | Edit Profile | 😐 جهد | AI مساعد للكتابة |
| 2.6 | يحدد الأسعار | Pricing | 🤔 تردد | AI اقتراح أسعار |
| 2.7 | ينشر الملف (Published) | Profile | 😊 إنجاز! | رابط للمشاركة |

**Success**: ملف شخصي مكتمل 100% (Profile Strength > 80%)
**Edge Cases**: لا يوجد أعمال سابقة → قوالب portfolio افتراضية
**KPIs**: Profile completion rate, Time to complete profile

### Stage 3: Finding Projects
| الخطوة | الإجراء | Screen | المشاعر | Notes |
|--------|---------|--------|---------|-------|
| 3.1 | يذهب إلى "المشاريع" | Project List | 🤔 فضول | بحث وتصفية |
| 3.2 | يكتب كلمات مفتاحية | Search Bar | 😊 سريع | Auto-complete + اقتراحات |
| 3.3 | يستخدم الفلاتر: التخصص، الميزانية | Filters | 😊 مفيد | URL params قابلة للمشاركة |
| 3.4 | يشاهد AI Recommendations | Sidebar | 😲 واو! | "مقترح لك" |
| 3.5 | يضغط على مشروع | Project Details | 😊 يقرأ | تفاصيل كاملة |
| 3.6 | يحفظ المشروع | Save Icon | 😊 لاحقاً | Wishlist |
| 3.7 | يقرر التقديم | Apply Button | 😊 جاهز | CTA واضح |

**Success**: يجد 3+ مشاريع مناسبة
**Edge Cases**: لا مشاريع مناسبة → إشعار عند نشر مشاريع جديدة
**Filters**: Category, Budget, Duration, Location, Status

### Stage 4: Submitting Proposal
| الخطوة | الإجراء | Screen | المشاعر | Notes |
|--------|---------|--------|---------|-------|
| 4.1 | يضغط "تقديم عرض" | Submit Proposal | 😊 متفائل | AI Proposal Writer |
| 4.2 | AI يقترح عرضاً أولياً | AI Draft | 😲 مندهش! | Generate with 1 click |
| 4.3 | يعدل العرض | Editor | 😊 تحكم | Rich text editor |
| 4.4 | يحدد السعر والمدة | Pricing Fields | 🤔 تفكير | AI اقتراح سعر |
| 4.5 | يرفق أعماله | Attachments | 😊 إضافة | Images, PDFs |
| 4.6 | يستعرض العرض قبل الإرسال | Preview | 😐 مراجعة | Validation |
| 4.7 | يرسل العرض | Submit | 😊 ترقب | Confirmation + toast |

**Success**: عرض مقنع مع attachments
**Failure**: حقول ناقصة → validation errors
**Edge Cases**: سعر خارج الميزانية → تحذير
**AI Features**: Generate proposal from project description

### Stage 5: Communication & Negotiation
| الخطوة | الإجراء | Screen | المشاعر | Notes |
|--------|---------|--------|---------|-------|
| 5.1 | يتلقى رسالة من العميل | Chat | 😊 سعيد! | Notification |
| 5.2 | يفتح المحادثة | Chat Window | 😊 يتواصل | Real-time, attachments |
| 5.3 | يتفاوض على السعر | Chat | 😐 تفاوض | AI اقتراح ردود |
| 5.4 | يوافق على البدء | Chat | 😊 اتفاق | Contract proposal |
| 5.5 | يوقع العقد | Contract | 😊 رسمي | E-signature |

**Success**: اتفاق على الشروط
**Failure**: فشل التفاوض → لا مشكلة
**Best Practice**: Keep communication on-platform

### Stage 6: Project Execution
| الخطوة | الإجراء | Screen | المشاعر | Notes |
|--------|---------|--------|---------|-------|
| 6.1 | يبدأ العمل على المشروع | My Projects | 😊 منتج | Status update |
| 6.2 | يرفع deliverable | Deliverable | 😊 إنجاز | File upload |
| 6.3 | العميل يطلب تعديلات | Chat | 😐 تعديل | Version control |
| 6.4 | يرسل النسخة النهائية | Deliverable | 😊 أخيراً | |
| 6.5 | العميل يوافق | Status | 🎉 تمام! | |

**Success**: مشروع مكتمل، تقييم جيد
**Failure**: dispute → mediation
**Tools**: File sharing, milestones, time tracking

### Stage 7: Payment & Review
| الخطوة | الإجراء | Screen | المشاعر | Notes |
|--------|---------|--------|---------|-------|
| 7.1 | يتلقى إشعار الدفع | Notification | 🎉 فرح! | |
| 7.2 | يتحقق من الرصيد | Wallet | 😊 حساب | |
| 7.3 | يقيم العميل | Review | 🙂 عادل | AI-verified review |
| 7.4 | العميل يقيمه | Review | 🙂 نتظار | |
| 7.5 | يقرأ التقييم | Profile | 😊 فخر! | |
| 7.6 | يسحب الأموال | Withdraw | 😊 ربح | اختيار وسيلة السحب |

**Success**: تقييم إيجابي + رصيد قابل للسحب
**Edge Cases**: تقييم سلبي → فرصة للتحسين
**Withdrawal**: MTN MoMo, Zain Cash, Bank Transfer, PayPal

---

## Journey 2: Client Journey - من النشر إلى التسليم

### Stage 1: Posting a Project
| الخطوة | الإجراء | Screen | المشاعر | Notes |
|--------|---------|--------|---------|-------|
| 1.1 | يسجل كـ Client | Signup | 🙂 سريع | |
| 1.2 | يكمل الملف الشخصي للشركة | Company Profile | 🙂 احترامي | logo, description |
| 1.3 | يضغط "نشر مشروع" | Post Project | 🤔 جاد | Guided form |
| 1.4 | يكتب العنوان والوصف | Form | 😐 واضح | AI Help |
| 1.5 | يختار التصنيف والمهارات | Form | 🙂 دقيق | AI اقتراحات |
| 1.6 | يحدد الميزانية والنطاق | Budget | 🤔 تسعير | AI اقتراح نطاق سعري |
| 1.7 | يضيف مرفقات (اختياري) | Attachments | 🙂 إضافة | Brief, references |
| 1.8 | ينشر المشروع | Publish | 🎉 منشور! | Toast: "تم النشر" |

**Success**: مشروع منشور ومرئي للمستقلين
**Edge Cases**: AI ينصح بتحسين الوصف
**AI**: "نحن نرى مشاريع مشابهة نجحت مع..."

### Stage 2: Reviewing Proposals
| الخطوة | الإجراء | Screen | المشاعر | Notes |
|--------|---------|--------|---------|-------|
| 2.1 | يتلقى إشعار بعروض جديدة | Notification | 😊 عروض | |
| 2.2 | يفتح قائمة العروض | Proposals List | 🤔 مقارنة | Sorted by AI score |
| 2.3 | يقرأ كل عرض | Proposal Detail | 😐 تقييم | |
| 2.4 | يشاهد ملف المستقل | Freelancer Profile | 😐 بحث | Portfolio, reviews |
| 2.5 | AI يُظهر match score | AI Badge | 😊 مفيد | "95% match" |
| 2.6 | يضغط "قبول" أو "رفض" | Actions | 😊 قرار | |
| 2.7 | يرسل رسالة للترحيب | Chat | 😊 تواصل | |

**Success**: يجد المستقل المناسب
**Edge Cases**: عروض كثيرة → AI تصفية; لا عروض → تشجيع

### Stage 3: Contract & Payment
| الخطوة | الإجراء | Screen | المشاعر | Notes |
|--------|---------|--------|---------|-------|
| 3.1 | يستعرض العقد | Contract | 😊 مقروء | شروط واضحة |
| 3.2 | يحدد milestones | Milestones | 🤔 تخطيط | تقسيم المبلغ |
| 3.3 | يدفع في Escrow | Payment | 😐 أمان | 100% أو milestone |
| 3.4 | يوقع العقد | E-sign | 😊 رسمي | 2-click signature |
| 3.5 | يبدأ المشروع رسمياً | Dashboard | 🚀 انطلاق | |

**Success**: عقد موقع + مبلغ في escrow
**Edge Cases**: رفض الشروط → تفاوض إضافي

### Stage 4: Review & Accept Work
| الخطوة | الإجراء | Screen | المشاعر | Notes |
|--------|---------|--------|---------|-------|
| 4.1 | يتلقى work submission | Notification | 🤔 مراجعة | |
| 4.2 | يراجع العمل | File Viewer | 😐 فحص | Zoom, annotate |
| 4.3 | يطلب تعديلات (إن لزم) | Comments | 😊 دقيق | |
| 4.4 | يوافق على التسليم النهائي | Accept | 🎉 رائع! | |
| 4.5 | يحرر المبلغ من escrow | Payment | 😊 تم | |
| 4.6 | يقيم المستقل | Review | 😊 شكراً | Detailed review |

**Success**: مشروع مكتمل بجودة + تقييم
**Failure**: dispute → mediation

---

## Journey 3: Admin Journey

### Overview
| الخطوة | الإجراء | Notes |
|--------|---------|-------|
| 1 | Login to Admin Dashboard | 2FA required |
| 2 | View Analytics Overview | MAU, GMV, disputes |
| 3 | Moderate New Projects | Approve/reject flagged |
| 4 | Review Disputes | Mediate between parties |
| 5 | Verify Users | ID verification |
| 6 | Manage Platform Settings | Commission, categories |
| 7 | View Audit Logs | Security review |

---
