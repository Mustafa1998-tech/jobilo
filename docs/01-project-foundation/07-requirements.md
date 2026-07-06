# Jobilo - Functional & Non-Functional Requirements

---

## Functional Requirements

### FR-1: User Management

#### FR-1.1: Registration
| ID | Requirement | Priority |
|----|------------|----------|
| FR-1.1.1 | تسجيل مستخدم جديد بالبريد الإلكتروني وكلمة السر | P0 |
| FR-1.1.2 | تسجيل مستخدم جديد عبر Google OAuth | P0 |
| FR-1.1.3 | تسجيل مستخدم جديد عبر LinkedIn OAuth | P1 |
| FR-1.1.4 | اختيار نوع الحساب (Freelancer / Client / Both) أثناء التسجيل | P0 |
| FR-1.1.5 | التحقق من البريد الإلكتروني عبر OTP | P0 |
| FR-1.1.6 | التحقق من رقم الهاتف عبر OTP | P1 |
| FR-1.1.7 | الموافقة على شروط الاستخدام وسياسة الخصوصية | P0 |
| FR-1.1.8 | CAPTCHA للحماية من البوتات | P0 |

#### FR-1.2: Authentication
| ID | Requirement | Priority |
|----|------------|----------|
| FR-1.2.1 | تسجيل الدخول بالبريد الإلكتروني وكلمة السر | P0 |
| FR-1.2.2 | تسجيل الدخول عبر Google/LinkedIn | P0 |
| FR-1.2.3 | تسجيل الخروج من جميع الأجهزة | P1 |
| FR-1.2.4 | تذكرني (Remember Me) | P0 |
| FR-1.2.5 | استعادة كلمة المرور عبر البريد الإلكتروني | P0 |
| FR-1.2.6 | تغيير كلمة المرور | P0 |
| FR-1.2.7 | Two-Factor Authentication (2FA) - تطبيق مصادقة | P1 |
| FR-1.2.8 | جلسة آمنة مع Refresh Token | P0 |
| FR-1.2.9 | كشف تسجيل الدخول المشبوه (جهاز جديد/موقع جديد) | P2 |

#### FR-1.3: Profile Management (Freelancer)
| ID | Requirement | Priority |
|----|------------|----------|
| FR-1.3.1 | إضافة/تعديل الصورة الشخصية مع cropping | P0 |
| FR-1.3.2 | إضافة/تعديل الاسم الكامل، العنوان، نبذة مختصرة | P0 |
| FR-1.3.3 | إضافة المهارات (Skills) من قائمة معتمدة أو إضافة مخصصة | P0 |
| FR-1.3.4 | تحديد مستوى كل مهارة (Beginner, Intermediate, Advanced, Expert) | P0 |
| FR-1.3.5 | إضافة الخبرات السابقة (شركة، منصب، تاريخ، وصف) | P1 |
| FR-1.3.6 | إضافة التعليم (جامعة، تخصص، سنة) | P1 |
| FR-1.3.7 | إضافة الشهادات والجوائز | P1 |
| FR-1.3.8 | رفع أعمال سابقة (Portfolio) مع صور وفيديو | P0 |
| FR-1.3.9 | تحديد الأسعار (سعر ثابت، سعر بالساعة) | P0 |
| FR-1.3.10 | ربط حسابات التواصل الاجتماعي (LinkedIn, GitHub, Twitter) | P1 |
| FR-1.3.11 | تفعيل/إلغاء تفعيل الملف الشخصي | P1 |
| FR-1.3.12 | AI يساعد في تحسين الوصف والمهارات | P1 |
| FR-1.3.13 | Profile Strength Indicator (نسبة اكتمال الملف) | P0 |

#### FR-1.4: Profile Management (Client)
| ID | Requirement | Priority |
|----|------------|----------|
| FR-1.4.1 | إضافة شعار الشركة (Logo) | P0 |
| FR-1.4.2 | إضافة اسم الشركة، الموقع، الوصف | P0 |
| FR-1.4.3 | إضافة المجال والصناعة | P0 |
| FR-1.4.4 | التحقق من الشركة (Business Verification) | P1 |
| FR-1.4.5 | إضافة أعضاء الفريق (Team Members) | P2 |
| FR-1.4.6 | تحديد أماكن العمل (Countries) | P1 |
| FR-1.4.7 | عرض تاريخ المشاريع المنشورة | P1 |

### FR-2: Project Management

#### FR-2.1: Project Creation (Client)
| ID | Requirement | Priority |
|----|------------|----------|
| FR-2.1.1 | إنشاء مشروع جديد مع عنوان فريد | P0 |
| FR-2.1.2 | وصف المشروع (Rich Text Editor) | P0 |
| FR-2.1.3 | تحديد التصنيف (Category) | P0 |
| FR-2.1.4 | تحديد المهارات المطلوبة مع مستوى الإتقان | P0 |
| FR-2.1.5 | تحديد نوع الميزانية (ثابت / بالساعة / negotiable) | P0 |
| FR-2.1.6 | تحديد الميزانية (نطاق سعري أو ثابت) | P0 |
| FR-2.1.7 | تحديد المدة المتوقعة | P0 |
| FR-2.1.8 | رفع ملفات المشروع (Brief, References, إلخ) | P0 |
| FR-2.1.9 | تحديد مستوى الخبرة المطلوب (Entry, Intermediate, Expert) | P0 |
| FR-2.1.10 | نشر المشروع (Draft → Published) | P0 |
| FR-2.1.11 | حفظ كمسودة (Draft) | P0 |
| FR-2.1.12 | معاينة المشروع قبل النشر | P0 |
| FR-2.1.13 | AI ينصح بتحسينات للوصف | P1 |
| FR-2.1.14 | AI يقترح الميزانية المناسبة | P2 |

#### FR-2.2: Project Browsing & Search
| ID | Requirement | Priority |
|----|------------|----------|
| FR-2.2.1 | عرض قائمة المشاريع مع Pagination | P0 |
| FR-2.2.2 | Search بالكلمات المفتاحية (Full-text search) | P0 |
| FR-2.2.3 | Filter: Category | P0 |
| FR-2.2.4 | Filter: Budget Range | P0 |
| FR-2.2.5 | Filter: Project Type (Fixed, Hourly) | P0 |
| FR-2.2.6 | Filter: Duration | P0 |
| FR-2.2.7 | Filter: Experience Level | P0 |
| FR-2.2.8 | Filter: Status (Open, In Progress, Completed) | P0 |
| FR-2.2.9 | Sort: Latest, Budget (High-Low), Bids Count | P0 |
| FR-2.2.10 | AI توصيات ذكية "مقترح لك" | P1 |
| FR-2.2.11 | حفظ نتائج البحث | P2 |
| FR-2.2.12 | URL parameters قابلة للمشاركة | P1 |

#### FR-2.3: Project Details
| ID | Requirement | Priority |
|----|------------|----------|
| FR-2.3.1 | عرض تفاصيل المشروع الكاملة | P0 |
| FR-2.3.2 | عرض معلومات العميل (اسم، تقييم، تاريخ) | P0 |
| FR-2.3.3 | عرض عدد العروض المقدمة | P0 |
| FR-2.3.4 | عرض متوسط العروض | P0 |
| FR-2.3.5 | زر "تقديم عرض" (للمستقل) | P0 |
| FR-2.3.6 | زر "حفظ المشروع" (Bookmark) | P0 |
| FR-2.3.7 | زر "الإبلاغ عن مخالفة" | P0 |
| FR-2.3.8 | مشاريع مشابهة (Related Projects بواسطة AI) | P1 |
| FR-2.3.9 | Share project link | P1 |

#### FR-2.4: Project Status Lifecycle
| ID | State | Description |
|----|-------|-------------|
| FR-2.4.1 | **Draft** | لم ينشر بعد |
| FR-2.4.2 | **Open** | يستقبل عروضاً |
| FR-2.4.3 | **Under Review** | العميل يراجع العروض |
| FR-2.4.4 | **In Progress** | تم التعاقد وجار التنفيذ |
| FR-2.4.5 | **Under Review** | تم التسليم والعميل يراجع |
| FR-2.4.6 | **Completed** | اكتمل وتم الدفع |
| FR-2.4.7 | **Cancelled** | ألغي من قبل أي طرف |
| FR-2.4.8 | **On Hold** | معلق مؤقتاً |
| FR-2.4.9 | **Disputed** | يوجد نزاع |
| FR-2.4.10 | **Archived** | أرشفة بعد 90 يوم من الإكمال |

### FR-3: Proposals & Offers

| ID | Requirement | Priority |
|----|------------|----------|
| FR-3.1 | تقديم عرض على مشروع (Freelancer) | P0 |
| FR-3.2 | إدخال مبلغ العرض والمدة | P0 |
| FR-3.3 | كتابة رسالة تعريفية (Cover Letter) | P0 |
| FR-3.4 | إرفاق ملفات مع العرض | P0 |
| FR-3.5 | AI اقتراح عرض مبدئي بناءً على المشروع والملف الشخصي | P1 |
| FR-3.6 | معاينة العرض قبل الإرسال | P0 |
| FR-3.7 | تحرير العرض بعد الإرسال (قبل الرد) | P1 |
| FR-3.8 | سحب العرض | P0 |
| FR-3.9 | عرض جميع عروض المستخدم (My Proposals) | P0 |
| FR-3.10 | عرض حالة كل عرض (Pending, Accepted, Rejected, Withdrawn) | P0 |
| FR-3.11 | قبول/رفض عرض (Client) | P0 |
| FR-3.12 | إشعار للمستقل عند قبول/رفض العرض | P0 |
| FR-3.13 | تحديد حد أقصى لعدد العروض للمشروع | P1 |
| FR-3.14 | AI تقييم جودة العرض قبل الإرسال | P2 |

### FR-4: Contracts & Agreements

| ID | Requirement | Priority |
|----|------------|----------|
| FR-4.1 | إنشاء عقد عند قبول عرض | P0 |
| FR-4.2 | تضمين: المشروع، المبلغ، المدة، الشروط العامة | P0 |
| FR-4.3 | إضافة Milestones (دفعات مرحلية) | P0 |
| FR-4.4 | تحديد مبلغ كل Milestone | P0 |
| FR-4.5 | توقيع العقد إلكترونياً من الطرفين | P0 |
| FR-4.6 | تخزين العقد كـ PDF وربطه بالمشروع | P0 |
| FR-4.7 | إمكانية تعديل العقد مع موافقة الطرفين | P1 |
| FR-4.8 | إلغاء العقد قبل البدء مع استرداد المبلغ | P0 |
| FR-4.9 | إنهاء العقد باتفاق الطرفين | P1 |
| FR-4.10 | عقد عمل حر موحد وفق قوانين السودان والمنطقة | P0 |

### FR-5: Payments & Escrow

| ID | Requirement | Priority |
|----|------------|----------|
| FR-5.1 | إيداع المبلغ في حساب Escrow (Client) | P0 |
| FR-5.2 | دعم الدفع: بطاقات ائتمان، PayPal، تحويل بنكي | P0 |
| FR-5.3 | دعم الدفع المحلي: MTN MoMo, Zain Cash, Bankak | P1 |
| FR-5.4 | تحرير المبلغ حسب Milestones | P0 |
| FR-5.5 | تحرير المبلغ عند اكتمال المشروع | P0 |
| FR-5.6 | عرض رصيد المحفظة (Wallet Balance) | P0 |
| FR-5.7 | سحب الأموال من المحفظة إلى وسيلة الدفع | P0 |
| FR-5.8 | تاريخ المعاملات الكامل مع التفاصيل | P0 |
| FR-5.9 | فواتير لكل معاملة | P0 |
| FR-5.10 | استرداد المبلغ (Refund) في حالات محددة | P0 |
| FR-5.11 | خصم عمولة Jobilo تلقائياً | P0 |
| FR-5.12 | إشعارات بحركات الحساب | P1 |
| FR-5.13 | دعم متعدد العملات (USD, SAR, AED, SDG) | P2 |

### FR-6: Messaging System

| ID | Requirement | Priority |
|----|------------|----------|
| FR-6.1 | محادثة نصية فورية (Real-time WebSocket) | P0 |
| FR-6.2 | إرسال ملفات (صور، PDF، مستندات) | P0 |
| FR-6.3 | محادثة لكل مشروع (Context-based) | P0 |
| FR-6.4 | محادثة مباشرة قبل العقد (Pre-contract) | P0 |
| FR-6.5 | إشعارات الرسائل الجديدة | P0 |
| FR-6.6 | قراءة/غير مقروء | P0 |
| FR-6.7 | typing indicator | P1 |
| FR-6.8 | emoji والرموز التعبيرية | P1 |
| FR-6.9 | حظر المستخدمين | P1 |
| FR-6.10 | الإبلاغ عن محادثة | P0 |
| FR-6.11 | أرشفة المحادثات | P2 |
| FR-6.12 | نسخ احتياطي وتشفير End-to-End | P2 |
| FR-6.13 | AI ترجمة فورية للرسائل | P2 |

### FR-7: Reviews & Ratings

| ID | Requirement | Priority |
|----|------------|----------|
| FR-7.1 | تقييم المستقل بعد إكمال المشروع (Client → Freelancer) | P0 |
| FR-7.2 | تقييم العميل بعد إكمال المشروع (Freelancer → Client) | P0 |
| FR-7.3 | تقييم عام (1-5 نجوم) | P0 |
| FR-7.4 | تقييم تفصيلي (جودة، التزام، تواصل، وقت) | P0 |
| FR-7.5 | كتابة تعليق نصي | P0 |
| FR-7.6 | عرض التقييمات في الملف الشخصي | P0 |
| FR-7.7 | عرض متوسط التقييم وعدد التقييمات | P0 |
| FR-7.8 | إمكانية الرد على التقييم | P1 |
| FR-7.9 | الإبلاغ عن تقييم غير لائق | P1 |
| FR-7.10 | AI كشف التقييمات المزيفة | P2 |
| FR-7.11 | Job Success Score (نسبة نجاح المشاريع) | P1 |
| FR-7.12 | نظام Badges للمتميزين (Top Rated, Best Value) | P1 |

### FR-8: Notifications

| ID | Requirement | Priority |
|----|------------|----------|
| FR-8.1 | إشعارات داخل المنصة (In-app) | P0 |
| FR-8.2 | إشعارات بريد إلكتروني | P0 |
| FR-8.3 | إشعارات متصفح (Browser Push) | P1 |
| FR-8.4 | إعدادات الإشعارات (تفعيل/تعطيل كل نوع) | P0 |
| FR-8.5 | إشعارات عند: عرض جديد، رسالة، تغيير حالة، دفع | P0 |
| FR-8.6 | مركز إشعارات (Notification Center) | P0 |
| FR-8.7 | علامة (Badge) بعدد الإشعارات غير المقروءة | P0 |
| FR-8.8 | تحديد الكل كمقروء | P1 |

### FR-9: Admin Dashboard

| ID | Requirement | Priority |
|----|------------|----------|
| FR-9.1 | لوحة تحكم رئيسية (Overview: MAU, GMV, Projects, Users) | P0 |
| FR-9.2 | إدارة المستخدمين (View, Suspend, Verify, Delete) | P0 |
| FR-9.3 | إدارة المشاريع (View, Feature, Moderate, Archive) | P0 |
| FR-9.4 | إدارة النزاعات (View, Mediate, Rule) | P0 |
| FR-9.5 | إدارة التصنيفات والمهارات | P1 |
| FR-9.6 | إدارة الإشعارات الجماعية (Broadcast) | P2 |
| FR-9.7 | عرض الإحصائيات والتقارير | P0 |
| FR-9.8 | Audit Logs (سجل النشاط) | P0 |
| FR-9.9 | إدارة الإعدادات (عمولة، شروط، إلخ) | P1 |
| FR-9.10 | دعم فني (Ticket System) | P1 |

### FR-10: AI Features (Basic MVP)

| ID | Requirement | Priority |
|----|------------|----------|
| FR-10.1 | توصيات ذكية للمشاريع حسب مهارات المستخدم | P1 |
| FR-10.2 | توصيات ذكية للمستقلين حسب المشروع | P1 |
| FR-10.3 | كشف احتيال أساسي (Project/User) | P1 |
| FR-10.4 | فرز ذكي للعروض حسب الجودة | P1 |

---

## Non-Functional Requirements

### NFR-1: Performance

| ID | Requirement | Target | Priority |
|----|------------|--------|----------|
| NFR-1.1 | Page Load Time (First Contentful Paint) | < 2s | P0 |
| NFR-1.2 | Time to Interactive | < 3s | P0 |
| NFR-1.3 | API Response Time (p95) | < 300ms | P0 |
| NFR-1.4 | API Response Time (p99) | < 500ms | P0 |
| NFR-1.5 | Concurrent Users Supported | 10,000+ | P0 |
| NFR-1.6 | Database Query Time (p95) | < 100ms | P0 |
| NFR-1.7 | Search Result Time | < 500ms | P0 |
| NFR-1.8 | File Upload (10MB) Time | < 5s | P1 |
| NFR-1.9 | Lighthouse Performance Score | > 90 | P1 |
| NFR-1.10 | Time to First Byte (TTFB) | < 200ms | P0 |

### NFR-2: Availability & Reliability

| ID | Requirement | Target |
|----|------------|--------|
| NFR-2.1 | Uptime (SLA) | 99.9% (8.76 hours/year downtime) |
| NFR-2.2 | Planned Downtime | < 4 hours/month |
| NFR-2.3 | Disaster Recovery - RPO | < 15 minutes |
| NFR-2.4 | Disaster Recovery - RTO | < 1 hour |
| NFR-2.5 | Backup Frequency | Every 6 hours |
| NFR-2.6 | Backup Retention | 30 days |
| NFR-2.7 | Failover Time | < 5 minutes |

### NFR-3: Security

| ID | Requirement | Priority |
|----|------------|----------|
| NFR-3.1 | Password Hashing (bcrypt, 12 rounds) | P0 |
| NFR-3.2 | JWT with Access + Refresh Tokens | P0 |
| NFR-3.3 | HTTPS Only (SSL/TLS) | P0 |
| NFR-3.4 | CSRF Protection | P0 |
| NFR-3.5 | XSS Prevention | P0 |
| NFR-3.6 | SQL Injection Prevention (via Prisma) | P0 |
| NFR-3.7 | Rate Limiting (100 req/min per user) | P0 |
| NFR-3.8 | CORS Configuration | P0 |
| NFR-3.9 | Helmet Headers | P0 |
| NFR-3.10 | Input Validation (Zod + class-validator) | P0 |
| NFR-3.11 | Data Encryption at Rest | P0 |
| NFR-3.12 | Secure File Validation (type, size, scan) | P0 |
| NFR-3.13 | Session Management | P0 |
| NFR-3.14 | Audit Logging for Critical Actions | P0 |
| NFR-3.15 | OWASP Top 10 Compliance | P0 |
| NFR-3.16 | 2FA (later phase) | P1 |
| NFR-3.17 | API Key Rotation | P1 |
| NFR-3.18 | Secrets Management (Environment Variables) | P0 |

### NFR-4: Scalability

| ID | Requirement | Target |
|----|------------|--------|
| NFR-4.1 | Horizontal Scaling | 10x without code changes |
| NFR-4.2 | Database Connection Pooling | 100+ concurrent |
| NFR-4.3 | Caching Layer (Redis - later) | 80% cache hit rate |
| NFR-4.4 | CDN for Static Assets | Global edge |
| NFR-4.5 | Database Read Replicas | Support up to 5 replicas |
| NFR-4.6 | Stateless API Design | Ready for scale |
| NFR-4.7 | Message Queue (later) | Async processing |

### NFR-5: Maintainability

| ID | Requirement | Priority |
|----|------------|----------|
| NFR-5.1 | Clean Architecture (Separation of Concerns) | P0 |
| NFR-5.2 | Modular Design | P0 |
| NFR-5.3 | TypeScript Throughout | P0 |
| NFR-5.4 | Comprehensive Test Coverage (> 80%) | P0 |
| NFR-5.5 | API Documentation (Swagger/OpenAPI) | P0 |
| NFR-5.6 | Code Documentation | P0 |
| NFR-5.7 | Linting & Formatting (ESLint, Prettier) | P0 |
| NFR-5.8 | Git Commit Convention (Conventional Commits) | P0 |
| NFR-5.9 | Environment-based Configuration | P0 |
| NFR-5.10 | Feature Flags Support | P1 |

### NFR-6: Usability

| ID | Requirement | Priority |
|----|------------|----------|
| NFR-6.1 | Responsive Design (Desktop, Tablet, Mobile) | P0 |
| NFR-6.2 | RTL Support | P0 |
| NFR-6.3 | i18n (Arabic, English initially) | P0 |
| NFR-6.4 | WCAG 2.1 AA Accessibility | P0 |
| NFR-6.5 | Keyboard Navigation | P0 |
| NFR-6.6 | Screen Reader Support | P1 |
| NFR-6.7 | Mobile-First Design | P0 |
| NFR-6.8 | Loading States (Skeleton, Spinner) | P0 |
| NFR-6.9 | Error States (User-friendly messages) | P0 |
| NFR-6.10 | Empty States | P0 |
| NFR-6.11 | Form Validation Feedback (Real-time) | P0 |
| NFR-6.12 | Optimistic Updates for Better UX | P1 |

### NFR-7: SEO

| ID | Requirement | Priority |
|----|------------|----------|
| NFR-7.1 | Server-Side Rendering (Next.js SSR) | P0 |
| NFR-7.2 | Dynamic Meta Tags per Page | P0 |
| NFR-7.3 | Open Graph Tags | P0 |
| NFR-7.4 | Structured Data (JSON-LD) | P1 |
| NFR-7.5 | Sitemap Generation | P0 |
| NFR-7.6 | robots.txt | P0 |
| NFR-7.7 | Canonical URLs | P0 |
| NFR-7.8 | Semantic HTML | P0 |
| NFR-7.9 | Core Web Vitals Optimization | P0 |

### NFR-8: Monitoring & Observability

| ID | Requirement | Priority |
|----|------------|----------|
| NFR-8.1 | Error Tracking (Sentry) | P0 |
| NFR-8.2 | API Monitoring (Health Checks) | P0 |
| NFR-8.3 | Performance Monitoring | P1 |
| NFR-8.4 | Structured Logging | P0 |
| NFR-8.5 | Database Query Monitoring | P1 |
| NFR-8.6 | Uptime Monitoring | P0 |
| NFR-8.7 | Alerting on Critical Metrics | P0 |
| NFR-8.8 | Dashboard for System Health | P1 |

### NFR-9: Compliance & Legal

| ID | Requirement | Priority |
|----|------------|----------|
| NFR-9.1 | GDPR Compliance (for EU users) | P1 |
| NFR-9.2 | Data Privacy Policy | P0 |
| NFR-9.3 | User Data Export | P1 |
| NFR-9.4 | User Account Deletion | P0 |
| NFR-9.5 | terms of Service | P0 |
| NFR-9.6 | Cookie Consent | P0 |
| NFR-9.7 | Age Verification (18+) | P0 |
| NFR-9.8 | Anti-Money Laundering (AML) Checks | P2 |

### NFR-10: Internationalization

| ID | Requirement | Priority |
|----|------------|----------|
| NFR-10.1 | Arabic (العربية) - Full RTL | P0 |
| NFR-10.2 | English - Full LTR | P0 |
| NFR-10.3 | French (Français) | P2 |
| NFR-10.4 | Date Format (localized) | P0 |
| NFR-10.5 | Number Format (localized) | P0 |
| NFR-10.6 | Currency Format (localized) | P0 |
| NFR-10.7 | Timezone Support | P0 |
| NFR-10.8 | AI Translation for Content | P2 |
