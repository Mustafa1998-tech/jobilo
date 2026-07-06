# Jobilo — Functional Requirements Specification

> **Version:** 1.0 | **Status:** Draft | **Cross-Ref:** [BRD](BUSINESS_REQUIREMENTS.md), [User Stories](USER_STORIES.md), [Use Cases](USE_CASES.md)

---

## Module 1: User Management

### FR-1.1: Registration

| ID | Description | Priority | Acceptance Criteria |
|----|------------|----------|-------------------|
| FR-1.1.1 | User registers with name, email, password | P0 | Form validation; success → OTP sent to email |
| FR-1.1.2 | User registers via Google OAuth | P0 | OAuth callback; auto-create user if new |
| FR-1.1.3 | User registers via LinkedIn OAuth | P1 | OAuth callback with profile data |
| FR-1.1.4 | User selects account type (Freelancer / Client / Both) | P0 | Radio button; sets user role |
| FR-1.1.5 | Email verification via 6-digit OTP | P0 | OTP sent; user enters; account activated |
| FR-1.1.6 | Phone number verification via SMS OTP | P1 | SMS sent; user verifies |
| FR-1.1.7 | User must accept Terms & Privacy Policy | P0 | Checkbox required before submission |
| FR-1.1.8 | CAPTCHA protection on registration form | P0 | Google reCAPTCHA v3 integrated |

### FR-1.2: Authentication

| ID | Description | Priority | Acceptance Criteria |
|----|------------|----------|-------------------|
| FR-1.2.1 | User logs in with email + password | P0 | Validates credentials; issues JWT |
| FR-1.2.2 | User logs in via Google/LinkedIn OAuth | P0 | OAuth flow; links to existing account |
| FR-1.2.3 | User logs out (current session) | P0 | Clears JWT; redirects to login |
| FR-1.2.4 | "Remember Me" checkbox extends session | P0 | 30-day refresh token vs 24h |
| FR-1.2.5 | Password reset via email link | P0 | Email sent with reset link (1h expiry) |
| FR-1.2.6 | User changes password (while logged in) | P0 | Old password required; new password rules apply |
| FR-1.2.7 | Two-factor authentication (TOTP) | P1 | QR code + authenticator app |
| FR-1.2.8 | JWT access + refresh token rotation | P0 | Access: 15min, Refresh: 7 days |
| FR-1.2.9 | Suspicious login detection (new device/location) | P2 | Email alert on unrecognized login |

### FR-1.3: Profile CRUD (Freelancer)

| ID | Description | Priority |
|----|------------|----------|
| FR-1.3.1 | Upload/update profile photo with crop | P0 |
| FR-1.3.2 | Edit name, headline, bio, location | P0 |
| FR-1.3.3 | Add skills from approved list or custom tags | P0 |
| FR-1.3.4 | Set skill proficiency (Beginner/Intermediate/Advanced/Expert) | P0 |
| FR-1.3.5 | Add work experience (company, role, dates, description) | P1 |
| FR-1.3.6 | Add education (university, degree, year) | P1 |
| FR-1.3.7 | Add certifications & awards | P1 |
| FR-1.3.8 | Portfolio upload (images, video, file attachments) | P0 |
| FR-1.3.9 | Set pricing (fixed rate, hourly rate) | P0 |
| FR-1.3.10 | Link social accounts (LinkedIn, GitHub, Twitter) | P1 |
| FR-1.3.11 | Toggle profile visibility (active/inactive) | P1 |
| FR-1.3.12 | Profile strength indicator (0-100%) | P0 |
| FR-1.3.13 | AI bio improvement suggestions | P1 |

### FR-1.4: Profile CRUD (Client)

| ID | Description | Priority |
|----|------------|----------|
| FR-1.4.1 | Upload company logo | P0 |
| FR-1.4.2 | Edit company name, website, description | P0 |
| FR-1.4.3 | Select industry/category | P0 |
| FR-1.4.4 | Business verification (upload commercial register) | P1 |
| FR-1.4.5 | Add team members | P2 |
| FR-1.4.6 | Set preferred work locations (countries) | P1 |
| FR-1.4.7 | View project history | P1 |

---

## Module 2: Project Management

### FR-2.1: Project CRUD

| ID | Description | Priority |
|----|------------|----------|
| FR-2.1.1 | Create project with unique title | P0 |
| FR-2.1.2 | Rich text editor for description | P0 |
| FR-2.1.3 | Select category from hierarchical list | P0 |
| FR-2.1.4 | Select required skills (multi-select) | P0 |
| FR-2.1.5 | Budget type: fixed / hourly / negotiable | P0 |
| FR-2.1.6 | Budget range (min-max) or fixed amount | P0 |
| FR-2.1.7 | Expected duration (1-365 days) | P0 |
| FR-2.1.8 | File attachments (up to 5, 20MB each) | P0 |
| FR-2.1.9 | Required experience level (Entry/Intermediate/Expert) | P0 |
| FR-2.1.10 | Save as Draft or Publish | P0 |
| FR-2.1.11 | Project preview before publishing | P0 |
| FR-2.1.12 | Edit project (while status ≠ In Progress) | P0 |
| FR-2.1.13 | Delete project (only Draft status) | P0 |
| FR-2.1.14 | AI-powered description improvement suggestions | P1 |

### FR-2.2: Search & Filter

| ID | Description | Priority |
|----|------------|----------|
| FR-2.2.1 | Paginated project list (20 per page) | P0 |
| FR-2.2.2 | Full-text keyword search | P0 |
| FR-2.2.3 | Filter by category | P0 |
| FR-2.2.4 | Filter by budget range | P0 |
| FR-2.2.5 | Filter by project type (fixed/hourly) | P0 |
| FR-2.2.6 | Filter by duration | P0 |
| FR-2.2.7 | Filter by experience level | P0 |
| FR-2.2.8 | Filter by status (open/in-progress/completed) | P0 |
| FR-2.2.9 | Sort by: latest, budget, bid count | P0 |
| FR-2.2.10 | AI-powered "Recommended for You" | P1 |
| FR-2.2.11 | Shareable URL with search params | P1 |

### FR-2.3: Bookmarks

| ID | Description | Priority |
|----|------------|----------|
| FR-2.3.1 | Save project as bookmark (heart icon) | P0 |
| FR-2.3.2 | View saved projects page | P0 |
| FR-2.3.3 | Remove bookmark | P0 |

### FR-2.4: Reports

| ID | Description | Priority |
|----|------------|----------|
| FR-2.4.1 | Report inappropriate project | P0 |
| FR-2.4.2 | Select report reason (spam, fake, offensive, other) | P0 |
| FR-2.4.3 | Admin receives notification on report | P0 |

---

## Module 3: Proposal Management

| ID | Description | Priority | Acceptance Criteria |
|----|------------|----------|-------------------|
| FR-3.1 | Freelancer submits proposal on open project | P0 | Cover letter (min 50 chars), bid amount, duration |
| FR-3.2 | Attach files with proposal (max 3, 10MB each) | P0 | File upload UI |
| FR-3.3 | AI generates proposal draft (optional) | P1 | Button "إنشاء باستخدام AI" |
| FR-3.4 | Freelancer views "My Proposals" list | P0 | Status: Pending/Accepted/Rejected/Withdrawn |
| FR-3.5 | Withdraw proposal (if status = pending) | P0 | Confirm dialog → status = Withdrawn |
| FR-3.6 | Client reviews proposals on project page | P0 | List sorted by AI score or date |
| FR-3.7 | Client shortlists proposals | P0 | Star icon → shortlisted list |
| FR-3.8 | Client accepts proposal | P0 | Opens contract creation flow |
| FR-3.9 | Client rejects proposal (with optional reason) | P0 | Notification sent to freelancer |
| FR-3.10 | Freelancer edits proposal (before client response) | P1 | Edit button on pending proposals |

---

## Module 4: Messaging

| ID | Description | Priority |
|----|------------|----------|
| FR-4.1 | Real-time one-to-one chat via WebSocket | P0 |
| FR-4.2 | Send text messages with typing indicator | P0 |
| FR-4.3 | Send file attachments (images, PDF, docs) | P0 |
| FR-4.4 | Context-based chat per project | P0 |
| FR-4.5 | Pre-contract messaging (before acceptance) | P0 |
| FR-4.6 | Post-contract messaging (project workspace) | P0 |
| FR-4.7 | Read receipts (✓ seen) | P0 |
| FR-4.8 | Online/offline status | P0 |
| FR-4.9 | Block user from messaging | P1 |
| FR-4.10 | Report conversation to admin | P0 |
| FR-4.11 | Archive conversations | P2 |
| FR-4.12 | Emoji picker | P1 |

---

## Module 5: Reviews & Ratings

| ID | Description | Priority | Acceptance Criteria |
|----|------------|----------|-------------------|
| FR-5.1 | Client rates freelancer after project completion | P0 | 1-5 stars + optional text |
| FR-5.2 | Freelancer rates client after project completion | P0 | 1-5 stars + optional text |
| FR-5.3 | Detailed rating categories (Quality, Communication, Timeliness, Professionalism) | P0 | Each rated 1-5 |
| FR-5.4 | Average rating displayed on profile | P0 | Calculated from all reviews |
| FR-5.5 | Reply to review | P1 | One reply per review |
| FR-5.6 | Report inappropriate review | P1 | Flagged for admin review |
| FR-5.7 | Job Success Score (JSS) | P1 | % of successful projects |
| FR-5.8 | Top Rated badge for high-performing freelancers | P1 | JSS ≥ 90% + minimum projects |

---

## Module 6: Notifications

| ID | Description | Priority |
|----|------------|----------|
| FR-6.1 | In-app notification center | P0 |
| FR-6.2 | Email notifications (configurable) | P0 |
| FR-6.3 | Browser push notifications | P1 |
| FR-6.4 | Notification on new proposal received | P0 |
| FR-6.5 | Notification on proposal accepted/rejected | P0 |
| FR-6.6 | Notification on new message | P0 |
| FR-6.7 | Notification on project status change | P0 |
| FR-6.8 | Notification on review received | P0 |
| FR-6.9 | Unread notification badge count | P0 |
| FR-6.10 | Mark all as read | P1 |
| FR-6.11 | Notification preferences page | P0 |

---

## Module 7: Admin Dashboard

| ID | Description | Priority |
|----|------------|----------|
| FR-7.1 | Overview dashboard (MAU, new users, projects, proposals) | P0 |
| FR-7.2 | User management (list, filter, search, suspend, ban, verify) | P0 |
| FR-7.3 | Project management (view, feature, moderate, delete) | P0 |
| FR-7.4 | Reports management (review flagged reports) | P0 |
| FR-7.5 | Subscription management (plans, user subscriptions, cancellations) | P0 |
| FR-7.6 | Email broadcast to users | P2 |
| FR-7.7 | Platform configuration (commission rate, terms, etc.) | P1 |
| FR-7.8 | Activity / audit log | P0 |
| FR-7.9 | Charts: registrations over time, project distribution, revenue | P0 |
| FR-7.10 | Export reports as CSV/PDF | P1 |

---

## Module 8: Admin Roles & Permissions (RBAC)

| ID | Description | Priority |
|----|------------|----------|
| FR-8.1 | Define roles: Super Admin, Admin, Moderator, Support | P0 |
| FR-8.2 | Permission CRUD for each role | P0 |
| FR-8.3 | Permission inheritance (child roles inherit from parent) | P0 |
| FR-8.4 | Assign role to admin user | P0 |
| FR-8.5 | Audit log of permission changes | P0 |
| FR-8.6 | Granular permissions per module (read/create/update/delete) | P0 |

### RBAC Matrix

| Module | Super Admin | Admin | Moderator | Support |
|--------|-------------|-------|-----------|---------|
| User Management | CRUD | R, U (suspend) | R | R |
| Project Management | CRUD | CRUD | R, U (moderate) | R |
| Reports | CRUD | CRUD | U (resolve) | R |
| Content Management | CRUD | CRUD | — | — |
| Admin Roles | CRUD | R | — | — |
| Platform Settings | CRUD | R | — | — |
| Audit Logs | CRUD | R | R | R |

---

## Module 9: Content Management

| ID | Description | Priority |
|----|------------|----------|
| FR-9.1 | CRUD for static pages (About, Contact, Terms, Privacy) | P0 |
| FR-9.2 | Blog post CRUD (title, content, tags, publish date) | P0 |
| FR-9.3 | FAQ categories and questions | P0 |
| FR-9.4 | Banner/slider management for homepage | P0 |
| FR-9.5 | Markdown editor for all content | P0 |
| FR-9.6 | Content publishing workflow (draft → review → publish) | P1 |
| FR-9.7 | Content versioning and history | P2 |

---

## Module 10: Subscription Management

| ID | Description | Priority | Acceptance Criteria |
|----|------------|----------|-------------------|
| FR-10.1 | Define subscription plans (Basic/Pro/Enterprise) | P0 | Name, price, features list |
| FR-10.2 | User subscribes to a plan | P0 | Redirect to payment (future) |
| FR-10.3 | View current subscription + status | P0 | Plan name, features, expiry |
| FR-10.4 | Upgrade/downgrade plan | P0 | Prorated billing (future) |
| FR-10.5 | Cancel subscription | P0 | Ends at current billing period |
| FR-10.6 | Subscription expiry notification | P0 | Email 7 days before expiry |

### Subscription Plan Tiers

| Feature | Free | Basic | Pro | Enterprise |
|---------|------|-------|-----|------------|
| Proposals/month | 5 | 20 | Unlimited | Unlimited |
| Profile visibility | Low | Medium | High | Featured |
| AI Proposal Builder | — | — | ✓ | ✓ |
| Priority Support | — | — | ✓ | ✓ |
| Skill Verification Badge | — | — | ✓ | ✓ |
| Analytics | — | Basic | Advanced | Custom |
| Price (monthly) | $0 | $9.99 | $29.99 | Custom |

---

*For detailed business rules governing all modules, see [BUSINESS_RULES.md](BUSINESS_RULES.md). For acceptance criteria in Gherkin format, see [ACCEPTANCE_CRITERIA.md](ACCEPTANCE_CRITERIA.md).*
