# Jobilo — Acceptance Criteria (Gherkin Scenarios)

> **Version:** 1.0 | **Cross-Ref:** [User Stories](USER_STORIES.md), [Functional Requirements](FUNCTIONAL_REQUIREMENTS.md), [Business Rules](BUSINESS_RULES.md), [Use Cases](USE_CASES.md)

---

## Feature: User Registration

### Scenario: Successful email registration
```
Given I am a new visitor on the Jobilo homepage
When I click "اشترك" (Sign Up)
And I select account type "مستقل" (Freelancer)
And I fill in:
  | Field         | Value          |
  | الاسم الكامل  | أحمد محمد      |
  | البريد الإلكتروني | ahmed@example.com |
  | كلمة السر     | Test@1234      |
  | تأكيد كلمة السر | Test@1234      |
And I accept the Terms & Privacy Policy
And I complete the CAPTCHA
And I click "إنشاء حساب" (Create Account)
Then I should see the OTP verification screen
And an email with a 6-digit OTP should be sent to ahmed@example.com
```

### Scenario: Duplicate email registration
```
Given a user with email "ahmed@example.com" already exists
When I attempt to register with email "ahmed@example.com"
Then I should see the error message "البريد الإلكتروني مسجل مسبقاً"
And I should not be redirected to the OTP screen
```

### Scenario: Weak password rejected
```
Given I am on the registration page
When I enter password "123"
Then I should see the validation error "يجب أن تتكون كلمة السر من 8 أحرف على الأقل"
And the submit button should remain disabled
```

### Scenario: Google OAuth registration
```
Given I am on the registration page
When I click "تسجيل بـ Google"
And I authorize Jobilo on Google's consent screen
Then I should be redirected to the account type selection page
And my email should be pre-filled from Google
And my account should be auto-verified (no OTP needed)
```

---

## Feature: Email Verification

### Scenario: Successful OTP verification
```
Given I have just registered with email "ahmed@example.com"
And I am on the OTP verification screen
When I enter the 6-digit code from my email
Then my account should be activated
And I should be redirected to the onboarding dashboard
And I should see a welcome message: "مرحباً بك في Jobilo!"
```

### Scenario: Invalid OTP attempt
```
Given I am on the OTP verification screen
When I enter an incorrect 6-digit code
Then I should see the error "رمز التحقق غير صحيح"
And I should have 4 remaining attempts remaining
```

### Scenario: OTP expired
```
Given I am on the OTP verification screen
And 15 minutes have passed since OTP was sent
When I enter the correct OTP
Then I should see the error "انتهت صلاحية رمز التحقق"
And I should be able to click "إعادة إرسال" to get a new code
```

---

## Feature: Freelancer Profile Management

### Scenario: Complete profile setup
```
Given I am a logged-in freelancer with an unverified profile
When I navigate to "/dashboard/profile"
And I upload a profile photo
And I fill in:
  | Field     | Value                    |
  | المسمى    | مطور Full Stack          |
  | نبذة      | خبرة 5 سنوات في تطوير الويب |
  | الموقع    | القاهرة، مصر              |
And I add skills: "JavaScript", "React", "Node.js"
And I set my hourly rate to "$25"
And I click "حفظ" (Save)
Then I should see the success message "تم حفظ الملف الشخصي"
And my profile strength indicator should update to 80%
And my public profile should display all entered information
```

### Scenario: Portfolio item upload
```
Given I am on my profile edit page
When I click "إضافة عمل جديد" (Add Portfolio Item)
And I upload an image (valid PNG, <5MB)
And I enter title "متجر إلكتروني" and description "تطوير متجر شامل"
And I click "حفظ"
Then the portfolio item should appear in my portfolio grid
And the total portfolio count should increment
```

### Scenario: Invalid portfolio file type
```
Given I am adding a new portfolio item
When I try to upload a file with extension ".exe"
Then I should see the error "نوع الملف غير مدعوم. الأنواع المسموحة: jpg, png, mp4, pdf"
And the file should not be uploaded
```

---

## Feature: Project Management

### Scenario: Client creates and publishes a project
```
Given I am a logged-in client
When I navigate to "/dashboard/client/projects/new"
And I fill in:
  | Field        | Value                          |
  | عنوان المشروع | تصميم واجهة تطبيق جوال          |
  | وصف المشروع  | أبحث عن مصمم UI/UX لتصميم تطبيق... (50+ chars) |
  | التصنيف      | تصميم UI/UX                    |
  | المهارات المطلوبة | Figma, Adobe XD, Prototyping |
  | نوع الميزانية | ثابت                           |
  | الميزانية    | $1,500                         |
  | المدة المتوقعة | 30 يوم                        |
  | مستوى الخبرة  | متوسط                         |
And I click "معاينة" (Preview)
Then I should see a preview of my project with all details
When I click "نشر" (Publish)
Then the project should be in "Open" status
And it should appear in project listings
And freelancers with matching skills should get notified
```

### Scenario: Freelancer searches and filters projects
```
Given I am a logged-in freelancer
When I navigate to "/projects"
And I search for "React"
And I filter by category "تطوير مواقع" (Web Development)
And I set budget range "$500 - $2,000"
And I click "بحث" (Search)
Then I should see only projects matching all criteria
And results should be paginated (20 per page)
And each result should show title, budget, skills, and client info
```

### Scenario: Save project as bookmark
```
Given I am viewing a project detail page
When I click the bookmark icon (♡)
Then the icon should change to filled (♥)
And the project should appear in my saved projects list
```

---

## Feature: Proposal Submission

### Scenario: Freelancer submits a proposal
```
Given I am a logged-in freelancer
And I am viewing an open project
When I click "تقديم عرض" (Submit Proposal)
And I write a cover letter of at least 50 characters
And I enter bid amount "$1,200"
And I set estimated duration "20 days"
And I click "إرسال العرض" (Submit Proposal)
Then the proposal should be in "Pending" status
And I should be redirected to "My Proposals" page
And the client should receive a notification
```

### Scenario: Duplicate proposal rejected
```
Given I have already submitted a proposal for project #123
When I try to submit another proposal for project #123
Then I should see the error "لقد قدمت عرضاً على هذا المشروع بالفعل"
And the submission should be blocked
```

### Scenario: Freelancer withdraws a proposal
```
Given I have a pending proposal on project #123
When I navigate to my proposals page
And I click "سحب" (Withdraw) on that proposal
And I confirm the withdrawal
Then the proposal status should change to "Withdrawn"
And the client should receive a notification
```

---

## Feature: Proposal Review & Acceptance

### Scenario: Client accepts a proposal
```
Given I am a client who owns project #123 in "Open" status
And the project has 5 proposals
When I navigate to the proposals page
And I click "قبول" (Accept) on proposal #3
And I confirm the acceptance
Then proposal #3 status should change to "Accepted"
And all other 4 proposals should change to "Rejected"
And the project status should change to "In Progress"
And the accepted freelancer should receive a notification
```

### Scenario: Client shortlists a proposal
```
Given I am reviewing proposals for my project
When I click the star icon on proposal #2
Then proposal #2 should appear in the shortlisted section
And it should be visually highlighted
```

---

## Feature: Messaging

### Scenario: Real-time messaging between freelancer and client
```
Given I am a freelancer with an accepted proposal on project #123
When I navigate to the project chat
And I type "مرحباً، سأبدأ العمل غداً" and press Enter
Then the message should appear instantly in the chat
And the client should receive the message in real-time
And the client should see a notification badge
```

### Scenario: File sharing in messages
```
Given I am in a project chat conversation
When I click the attachment icon
And I select a PDF file (valid, <10MB)
Then the file should upload and appear as a downloadable link in the chat
```

---

## Feature: Reviews & Ratings

### Scenario: Client leaves a review
```
Given project #123 is in "Completed" status
When I navigate to the project page
And I click "تقييم" (Rate)
And I select 5 stars
And I fill in detailed ratings:
  | Category         | Rating |
  | الجودة           | 5      |
  | الالتزام         | 4      |
  | التواصل          | 5      |
  | الوقت            | 4      |
And I write a comment "عمل ممتاز، سأعمل معه مرة أخرى"
And I click "إرسال التقييم" (Submit Review)
Then the review should appear on the freelancer's profile
And the freelancer's average rating should recalculate
```

### Scenario: Review before project completion
```
Given project #123 is in "In Progress" status
When I navigate to the review section
Then I should not see a "Submit Review" button
And I should see the message "التقييم متاح بعد اكتمال المشروع"
```

---

## Feature: Admin Dashboard

### Scenario: Admin views dashboard overview
```
Given I am logged in as an admin
When I navigate to "/admin"
Then I should see KPI cards: MAU, New Projects, Active Freelancers, Reports
And I should see a line chart showing registrations over the last 30 days
And I should see a bar chart showing projects by category
And I should see a "Recent Activity" feed with the latest 10 events
```

### Scenario: Admin suspends a user
```
Given I am logged in as an admin
And I am viewing the user management page
When I search for user "ahmed@example.com"
And I click "تعليق" (Suspend)
And I enter the reason "انتهاك شروط الاستخدام: نشر مشاريع وهمية"
And I confirm
Then the user status should change to "Suspended"
And the user should receive an email notification with the reason
And the audit log should record the action with my admin ID and timestamp
```

---

## Feature: RBAC Authorization

### Scenario: Moderator cannot manage admin roles
```
Given I am logged in as a moderator
When I navigate to "/admin/roles"
Then I should see a 403 Forbidden page
And I should not see role management UI elements
```

### Scenario: Super Admin creates a new admin role
```
Given I am logged in as a Super Admin
When I navigate to "/admin/roles"
And I click "إضافة دور جديد" (Add New Role)
And I enter role name "مشرف محتوى" (Content Manager)
And I assign permissions:
  | Module          | Permission |
  | Pages           | CRUD       |
  | Blog            | CRUD       |
  | FAQ             | CRUD       |
  | User Management | Read       |
And I click "حفظ" (Save)
Then the new role "Content Manager" should appear in the roles list
And I should be able to assign this role to admin users
```

---

## Feature: Content Management

### Scenario: Admin creates a new static page
```
Given I am logged in as an admin with content management permission
When I navigate to "/admin/content/pages"
And I click "إضافة صفحة" (Add Page)
And I fill in:
  | Field            | Value              |
  | العنوان (عربي)   | عن المنصة           |
  | Slug             | about              |
  | المحتوى (عربي)   | مرحباً بكم في Jobilo... |
  | Meta Description | صفحة عن منصة Jobilo |
And I toggle status to "Published"
And I click "نشر" (Publish)
Then the page should be accessible at "/about"
And the page should display the content correctly in RTL
```

### Scenario: Admin manages FAQ
```
Given I am on the FAQ management page
When I click "إضافة سؤال" (Add Question)
And I fill in:
  | Field    | Value                                   |
  | السؤال   | كيف يمكنني البدء كمستقل؟                 |
  | الإجابة  | قم بالتسجيل وإنشاء ملف شخصي وابدأ بتصفح المشاريع |
  | التصنيف  | للمستقلين                               |
And I click "حفظ" (Save)
Then the FAQ item should appear in the FAQ listing page under category "للمستقلين"
```

---

## Feature: Subscription Management

### Scenario: Free user hits proposal limit
```
Given I am a freelancer on the Free plan (5 proposals/month)
And I have already submitted 5 proposals this month
When I try to submit a 6th proposal
Then I should see the message "لقد استنفدت الحد المسموح من العروض لهذا الشهر. قم بترقية خطتك."
And I should be prompted to view subscription plans
```

### Scenario: User upgrades subscription
```
Given I am a freelancer on the Free plan
When I navigate to "الاشتراك" (Subscription) page
And I click "ترقية" (Upgrade) on the Pro plan
And I confirm the upgrade
Then my plan should change to Pro immediately
And I should see Pro features unlocked (AI Proposal Builder, etc.)
```

---

## Feature: Email Notifications

### Scenario: Email notification on proposal received
```
Given I am a client with an active project
When a freelancer submits a proposal on my project
Then I should receive an email with:
  - Subject: "عرض جديد على مشروعك [project title]"
  - Freelancer name and bid amount
  - Link to view the proposal
And the email should be in Arabic (RTL)
```

### Scenario: Password reset email
```
Given I am on the login page
When I click "نسيت كلمة السر" (Forgot Password)
And I enter my email "ahmed@example.com"
And I click "إرسال" (Send)
Then I should receive an email with a password reset link
And the link should be valid for 1 hour
And clicking the link should take me to a password reset form
When I enter a new password "NewPass@789"
And I confirm
Then I should be able to log in with the new password
```

---

*These acceptance criteria validate the business rules defined in [BUSINESS_RULES.md](BUSINESS_RULES.md). For detailed step-by-step use case flows, see [USE_CASES.md](USE_CASES.md). For user story context, see [USER_STORIES.md](USER_STORIES.md).*
