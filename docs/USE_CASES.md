# Jobilo — Detailed Use Cases

> **Cross-References:** [User Stories](USER_STORIES.md), [Functional Requirements](FUNCTIONAL_REQUIREMENTS.md), [Business Rules](BUSINESS_RULES.md)

---

## UC-1: User Registration

| Element | Description |
|---------|------------|
| **ID** | UC-1 |
| **Name** | تسجيل مستخدم جديد (User Registration) |
| **Actors** | زائر (Visitor) |
| **Preconditions** | User is not logged in; email is not already registered |
| **Postconditions** | New account created with status `UNVERIFIED`; OTP sent to email |
| **Trigger** | User clicks "اشترك" (Sign Up) |

### Main Flow

1. User navigates to `/register` and selects account type (Freelancer / Client / Both)
2. System displays registration form: full name, email, password, confirm password
3. User fills in all fields and accepts Terms & Privacy Policy
4. User completes CAPTCHA challenge
5. System validates input (see [Business Rules — Registration](BUSINESS_RULES.md#BR-1))
6. System checks email uniqueness in database
7. System hashes password with bcrypt (12 rounds) and creates user (status: `UNVERIFIED`)
8. System generates 6-digit OTP and sends to user's email
9. User enters OTP in verification form
10. System validates OTP (correct + not expired — 15 min window)
11. System updates user status to `ACTIVE`
12. System issues JWT tokens (access + refresh)
13. System redirects user to onboarding page (profile setup)

### Alternative Flows

**AF-1: Google OAuth Registration**
1. User clicks "تسجيل بـ Google" button
2. System redirects to Google OAuth consent screen
3. User approves requested scopes (profile, email)
4. Google returns OAuth code to callback endpoint
5. System exchanges code for access token and fetches user info
6. If email exists → redirect to login with message
7. If new → auto-create user account (verified, no OTP needed)
8. System prompts user to select account type
9. Continue from Main Flow step 13

**AF-2: Duplicate Email**
1. At step 6, system finds email already exists
2. System returns error: "البريد الإلكتروني مسجل مسبقاً. هل ترغب في تسجيل الدخول؟"
3. User can click "تسجيل الدخول" → redirected to login page

**AF-3: OTP Expired**
1. At step 10, OTP is expired (> 15 min)
2. System shows error: "انتهت صلاحية رمز التحقق"
3. User clicks "إعادة إرسال" (resend)
4. System generates new OTP (max 3 resends within 15 min window)
5. Repeat from step 9

**AF-4: Invalid OTP**
1. At step 10, OTP is incorrect
2. System shows error: "رمز التحقق غير صحيح"
3. User can retry (max 5 attempts before lockout for 15 min)

### Exceptions

| Exception | Handling |
|-----------|----------|
| Email service down | Log error, retry queue, show message "سيتم إرسال رمز التحقق خلال دقائق" |
| CAPTCHA verification fails | Show error: "التحقق الأمني فشل، حاول مرة أخرى" |
| Password validation fails | Show specific field errors |

---

## UC-2: Email Verification

| Element | Description |
|---------|------------|
| **ID** | UC-2 |
| **Name** | التحقق من البريد الإلكتروني (Email Verification) |
| **Actors** | مستخدم جديد (New User — unverified) |
| **Preconditions** | User registered successfully; status = `UNVERIFIED` |
| **Postconditions** | User status = `ACTIVE`; user can access platform features |
| **Trigger** | Registration completion or manual "إعادة إرسال التحقق" |

### Main Flow

1. System displays OTP input screen after registration
2. User checks email inbox for 6-digit OTP code
3. User enters OTP into the form
4. System validates OTP against stored hash and expiry timestamp
5. On success: account activated, redirect to dashboard
6. System sends welcome email

### Alternative Flows

**AF-1: Resend OTP**
1. User clicks "إعادة إرسال"
2. System checks resend count (max 3 in 15 min)
3. If allowed, system generates new OTP and sends email
4. System increments resend counter

**AF-2: Change Email**
1. User clicks "تغيير البريد الإلكتروني"
2. System returns to registration form with email field editable
3. User enters new email
4. System checks uniqueness and sends OTP to new email

### Exceptions

| Exception | Handling |
|-----------|----------|
| Email bounces | Mark email as invalid, prompt user to re-enter |
| Account already verified | Redirect to login with message "الحساب مفعل بالفعل" |

---

## UC-3: Freelancer Submits Proposal

| Element | Description |
|---------|------------|
| **ID** | UC-3 |
| **Name** | تقديم عرض على مشروع (Freelancer Submits Proposal) |
| **Actors** | مستقل (Freelancer — authenticated, verified) |
| **Preconditions** | Freelancer is logged in; project is in `OPEN` status; freelancer has not submitted a proposal for this project |
| **Postconditions** | Proposal created with status `PENDING`; client receives notification |
| **Trigger** | Freelancer clicks "تقديم عرض" on project page |

### Main Flow

1. Freelancer navigates to project detail page
2. Freelancer clicks "تقديم عرض" button
3. System displays proposal form: cover letter, bid amount, estimated duration, file attachments
4. System populates AI-generated draft suggestion (if enabled — optional)
5. Freelancer composes/proofreads proposal
6. Freelancer optionally attaches files (max 3, 10MB each)
7. Freelancer clicks "معاينة العرض" (Preview Proposal)
8. System shows proposal preview with all details
9. Freelancer clicks "إرسال العرض" (Submit Proposal)
10. System validates proposal (see [Business Rules — Proposal](BUSINESS_RULES.md#BR-3))
11. System saves proposal with status `PENDING`
12. System sends in-app + email notification to client
13. System increments proposal count on project
14. System redirects freelancer to "عروضي" (My Proposals) page

### Alternative Flows

**AF-1: AI Proposal Draft**
1. At step 4, freelancer clicks "إنشاء باستخدام AI"
2. System sends project details + freelancer profile to AI service
3. AI returns generated cover letter and suggested bid
4. System fills proposal form with AI content
5. Freelancer edits as needed
6. Resume from step 7

**AF-2: Edit Proposal Before Client Response**
1. Freelancer goes to "عروضي" page
2. Finds proposal with status `PENDING`
3. Clicks "تعديل" button
4. System opens editable proposal form
5. Freelancer updates fields and resubmits
6. System updates proposal (replaces old version)

**AF-3: Withdraw Proposal**
1. Freelancer views "عروضي" page
2. Clicks "سحب العرض" on a `PENDING` proposal
3. System shows confirmation dialog
4. Freelancer confirms withdrawal
5. System updates status to `WITHDRAWN`
6. System notifies client

### Exceptions

| Exception | Handling |
|-----------|----------|
| Project already closed/reassigned | Show error: "هذا المشروع لم يعد متاحاً" |
| Bid below minimum budget | Show warning (non-blocking): "العرض أقل من ميزانية المشروع" |
| Duplicate submission attempt | Show error: "لقد قدمت عرضاً على هذا المشروع بالفعل" |
| File too large | Show error with max size limit |
| Network timeout while submitting | Save draft locally and retry |

---

## UC-4: Client Accepts Proposal

| Element | Description |
|---------|------------|
| **ID** | UC-4 |
| **Name** | قبول عرض (Client Accepts Proposal) |
| **Actors** | عميل (Client — authenticated) |
| **Preconditions** | Client owns the project; project is in `OPEN` status; at least one proposal exists |
| **Postconditions** | Proposal status = `ACCEPTED`; other proposals = `REJECTED`; project status = `IN_PROGRESS` (or contract created in future) |
| **Trigger** | Client clicks "قبول العرض" on a proposal |

### Main Flow

1. Client navigates to project proposals page
2. Client reviews proposals list (sorted by AI score or date)
3. Client clicks on a freelancer's name to view their full profile
4. Client returns to proposals and clicks "قبول العرض" on chosen proposal
5. System shows confirmation dialog: "سيتم رفض باقي العروض تلقائياً. هل أنت متأكد؟"
6. Client confirms acceptance
7. System updates selected proposal status to `ACCEPTED`
8. System updates all other pending proposals on this project to `REJECTED`
9. System updates project status to `IN_PROGRESS` (MVP: no contract creation)
10. System sends notifications:
    - Accepted freelancer: "تم قبول عرضك على مشروع [title]"
    - Rejected freelancers: "تم رفض عرضك على مشروع [title]"
    - (Optional feedback from client included)
11. System enables the project messaging workspace for both parties

### Alternative Flows

**AF-1: Shortlist Before Decision**
1. Client clicks the star icon on proposals of interest
2. System adds proposal to shortlist
3. Shortlisted proposals appear at top of list with highlighted indicator
4. Client later accepts from shortlist

**AF-2: Client Changes Mind**
1. After acceptance, client contacts admin to reverse (no self-service)
2. Admin manually adjusts statuses (see [UC-5](USE_CASES.md#UC-5))

### Exceptions

| Exception | Handling |
|-----------|----------|
| Project status changed (e.g., closed by admin) | Show error: "تعذر قبول العرض، المشروع غير متاح حالياً" |
| Freelancer account suspended | Show warning: "حساب المستقل معلق حالياً. يرجى الاتصال بالدعم." |
| Freelancer already accepted for another project | System checks availability; show warning if conflict |

---

## UC-5: Admin Manages User Account

| Element | Description |
|---------|------------|
| **ID** | UC-5 |
| **Name** | إدارة حساب المستخدم (Admin Manages User Account) |
| **Actors** | مسؤول (Admin — authenticated, with user management permission) |
| **Preconditions** | Admin is logged in with appropriate role; target user exists |
| **Postconditions** | User account status is updated; audit log entry created |
| **Trigger** | Admin searches for user and selects "إدارة" |

### Main Flow

1. Admin navigates to Admin Dashboard → User Management
2. System displays paginated user list with search bar and filters (role, status, date range)
3. Admin searches by email, name, or user ID
4. Admin clicks on a user row to view full details
5. System shows: user info, account status, join date, project count, proposal count, activity log
6. Admin selects an action:
   - **Suspend:** Temporarily disable account access
   - **Verify:** Mark as verified (blue badge)
   - **Ban:** Permanently disable account
   - **Restore:** Reactivate suspended/banned account
7. System prompts for reason (required for suspend/ban)
8. Admin enters reason and confirms
9. System executes action:
   - Updates user status
   - Invalidates existing JWT tokens
   - Sends email notification to user with reason
10. System logs action in audit trail

### Alternative Flows

**AF-1: Bulk Actions**
1. Admin selects multiple users via checkboxes
2. Admin chooses bulk action (suspend, verify, export)
3. System applies action to all selected users
4. System logs each action individually

**AF-2: Export User Data**
1. Admin clicks "تصدير" button
2. System generates CSV/PDF of filtered user list
3. Admin downloads the report

### Exceptions

| Exception | Handling |
|-----------|----------|
| Attempting to ban a Super Admin | Blocked: "لا يمكن حظر مدير عام" |
| User already has requested status | Show info: "المستخدم بالفعل في هذه الحالة" |
| Database error during update | Log error, show generic error, retry |

---

## UC-6: Admin Creates Content Page

| Element | Description |
|---------|------------|
| **ID** | UC-6 |
| **Name** | إنشاء صفحة محتوى (Admin Creates Content Page) |
| **Actors** | مسؤول (Admin — with content management permission) |
| **Preconditions** | Admin is logged in with appropriate role |
| **Postconditions** | New page created; visible on public site (if published) |
| **Trigger** | Admin clicks "صفحة جديدة" in Content Manager |

### Main Flow

1. Admin navigates to Admin Dashboard → Content Management → Pages
2. System lists all pages with status (draft/published), last edited date
3. Admin clicks "إضافة صفحة جديدة" button
4. System displays page editor:
   - Title (required, Arabic)
   - Slug (auto-generated from title, editable)
   - Content (rich text / markdown editor)
   - Meta description
   - Status toggle (Draft / Published)
   - Language toggle (Arabic / English)
5. Admin fills in content and optionally sets a featured image
6. Admin clicks "معاينة" (Preview) to see how the page will render
7. Admin clicks "نشر" (Publish) or "حفظ كمسودة" (Save as Draft)
8. System validates required fields
9. System saves page to database with appropriate status
10. If published, page becomes immediately available at the slug URL

### Alternative Flows

**AF-1: Edit Existing Page**
1. Admin clicks on existing page in the list
2. System loads content into editor
3. Admin makes edits
4. System saves new version (versioning — Phase 2)

**AF-2: Delete Page**
1. Admin clicks delete icon on a page
2. System shows confirmation: "سيتم حذف الصفحة نهائياً"
3. Admin confirms
4. System soft-deletes the page (sets deleted flag)

### Exceptions

| Exception | Handling |
|-----------|----------|
| Slug already exists | Suggest unique slug: "الرابط مستخدم مسبقاً. الرجاء استخدام رابط آخر" |
| Content too short | Warning: "محتوى الصفحة قصير جداً" (non-blocking) |
| HTML injection attempt | Purify content with DOMPurify before saving |

---

*For detailed business rules governing each use case, see [BUSINESS_RULES.md](BUSINESS_RULES.md). For Gherkin-style acceptance criteria, see [ACCEPTANCE_CRITERIA.md](ACCEPTANCE_CRITERIA.md).*
