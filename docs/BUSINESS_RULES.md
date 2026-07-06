# Jobilo — Business Rules

> **Version:** 1.0 | **Cross-Ref:** [BRD](BUSINESS_REQUIREMENTS.md), [Functional Requirements](FUNCTIONAL_REQUIREMENTS.md), [Use Cases](USE_CASES.md), [Acceptance Criteria](ACCEPTANCE_CRITERIA.md)

---

## BR-1: User Registration Rules

| Rule | Description | Error Message |
|------|-------------|---------------|
| BR-1.1 | Email must be unique across all users | "البريد الإلكتروني مسجل مسبقاً" |
| BR-1.2 | Password minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 digit | "يجب أن تتكون كلمة السر من 8 أحرف على الأقل، حرف كبير، حرف صغير، ورقم" |
| BR-1.3 | Full name required, 2-100 characters | "الاسم مطلوب (2-100 حرف)" |
| BR-1.4 | User must accept Terms & Privacy Policy | "يجب الموافقة على الشروط" |
| BR-1.5 | Minimum age: 18 years | "يجب أن يكون عمرك 18 سنة على الأقل" |
| BR-1.6 | CAPTCHA required for registration | "الرجاء إكمال التحقق الأمني" |
| BR-1.7 | OTP expires after 15 minutes | "انتهت صلاحية رمز التحقق" |
| BR-1.8 | Max 3 OTP resends within 15 minutes | "لقد تجاوزت الحد المسموح لإعادة الإرسال. حاول بعد 15 دقيقة" |
| BR-1.9 | Max 5 incorrect OTP attempts → 15 min lockout | "تم قفل الحساب مؤقتاً. حاول بعد 15 دقيقة" |
| BR-1.10 | Account type must be selected (Freelancer, Client, or Both) | "يرجى اختيار نوع الحساب" |

## BR-2: Project Posting Rules

| ID | Rule | Details |
|----|------|---------|
| BR-2.1 | Title length: 10-200 characters | Must be unique |
| BR-2.2 | Description length: 50-5,000 characters | Rich text allowed (stripped of dangerous HTML) |
| BR-2.3 | Budget must be a positive number | Min: $10, Max: $100,000 |
| BR-2.4 | Budget type must be one of: fixed, hourly, negotiable | Determines UI display |
| BR-2.5 | Category is required (from predefined list) | Selected from hierarchical taxonomy |
| BR-2.6 | At least 1 required skill must be specified | Selected from platform skill list |
| BR-2.7 | Duration: 1-365 days | Integer only |
| BR-2.8 | File attachments: max 5 files, 20MB each | Allowed: jpg, png, pdf, docx, zip, mp4 |
| BR-2.9 | Experience level required: Entry, Intermediate, or Expert | Determines suggested budget range |
| BR-2.10 | Client can post max 3 projects per day (Free plan) | Subscription plan increases limit |
| BR-2.11 | Project status transitions: | See status machine below |
| BR-2.12 | Project can only be edited if status is DRAFT or OPEN | Locked after first proposal acceptance |
| BR-2.13 | Project can only be deleted if status is DRAFT | Otherwise, admin must archive |

### Project Status Machine

```
                    ┌──────────┐
                    │  DRAFT   │
                    └────┬─────┘
                         │ Publish
                         ▼
                    ┌──────────┐
              ┌────>│   OPEN   │<────┐
              │     └────┬─────┘     │
              │          │           │
              │    Proposal Accepted │
              │          ▼           │
              │     ┌──────────┐     │
              │     │IN PROGRESS│     │
              │     └────┬─────┘     │
              │          │           │
              │     Work Delivered   │
              │          ▼           │
              │     ┌──────────┐     │
              │     │UNDER REVIEW    │
              │     └────┬─────┘     │
              │          │           │
              │    Client Approves   │
              │          ▼           │
              │     ┌──────────┐     │
              │     │COMPLETED │     │
              │     └──────────┘     │
              │                      │
              │  ┌───────────────────┼───┐
              │  │                   │   │
              │  ▼                   ▼   │
              │  ┌──────────┐  ┌──────────┐
              └──│CANCELLED │  │ DISPUTED │
                 └──────────┘  └──────────┘
```

## BR-3: Proposal Rules

| ID | Rule | Details |
|----|------|---------|
| BR-3.1 | Only verified freelancers can submit proposals | Client accounts blocked |
| BR-3.2 | One proposal per freelancer per project | Duplicate blocked with error |
| BR-3.3 | Cover letter minimum: 50 characters | Encourages meaningful proposals |
| BR-3.4 | Bid amount: any positive number (warning if outside budget range) | Non-blocking warning |
| BR-3.5 | Estimated duration: 1-365 days | Required field |
| BR-3.6 | File attachments: max 3 files, 10MB each | Allowed types: jpg, png, pdf, docx |
| BR-3.7 | Proposal statuses: PENDING → ACCEPTED / REJECTED / WITHDRAWN | Linear progression |
| BR-3.8 | Freelancer can withdraw proposal only if status = PENDING | Cannot withdraw after decision |
| BR-3.9 | Client can accept only 1 proposal per project | Other proposals auto-rejected |
| BR-3.10 | Proposal can be edited by freelancer if status = PENDING | Edit preserves version history |
| BR-3.11 | Proposals closed when project moves to IN_PROGRESS | No new submissions |
| BR-3.12 | Max 100 proposals per project | Prevents spam |

## BR-4: Contract Rules (MVP — Manual)

| ID | Rule | Details |
|----|------|---------|
| BR-4.1 | Only 1 active contract per project | Accepted proposal → all others rejected |
| BR-4.2 | Only 1 active contract per freelancer with same client | Prevents duplicate relationships |
| BR-4.3 | Contract statuses: ACTIVE → COMPLETED / CANCELLED / DISPUTED | Transitions tracked |
| BR-4.4 | Contract creation is manual in MVP (system-assisted) | Automated in Phase 2 |

## BR-5: Review Rules

| ID | Rule | Details |
|----|------|---------|
| BR-5.1 | Reviews only possible after project status = COMPLETED | Not before |
| BR-5.2 | Both parties can leave a review (client + freelancer) | Mutual review system |
| BR-5.3 | One review per user per project | Cannot review twice |
| BR-5.4 | Review must include: star rating (1-5) | Required |
| BR-5.5 | Review can include: text comment (optional, 10-2,000 chars) | Optional text |
| BR-5.6 | Detailed ratings: Quality, Communication, Timeliness, Professionalism | Each 1-5 stars |
| BR-5.7 | Review can be edited within 48 hours | After that, contact support |
| BR-5.8 | Reviews are public and visible on user profiles | Cannot be hidden |
| BR-5.9 | Flagged reviews reviewed by admin within 24 hours | Inappropriate content removed |
| BR-5.10 | Average rating = weighted average of all scores | Displayed on profile |

## BR-6: Admin Rules

| ID | Rule | Details |
|----|------|---------|
| BR-6.1 | Admin hierarchy: Super Admin > Admin > Moderator > Support | Permission inheritance |
| BR-6.2 | Super Admin creates and manages admin roles | Full access to RBAC |
| BR-6.3 | Admin can suspend, verify, and manage users | Cannot delete users |
| BR-6.4 | Only Super Admin can delete users | Irreversible action, requires reason |
| BR-6.5 | All admin actions logged in audit trail | Immutable log |
| BR-6.6 | Admin cannot modify own role | Prevents privilege escalation |
| BR-6.7 | At least 1 Super Admin must exist at all times | Cannot demote last Super Admin |
| BR-6.8 | Admin account suspension requires Super Admin approval | Self-suspension blocked |

## BR-7: Subscription Rules

| ID | Rule | Details |
|----|------|---------|
| BR-7.1 | Plans: Free (default), Basic ($9.99/mo), Pro ($29.99/mo), Enterprise (custom) | Tiered features |
| BR-7.2 | New users start on Free plan automatically | No credit card required for MVP |
| BR-7.3 | Upgrade takes effect immediately | Prorated billing (Phase 2) |
| BR-7.4 | Downgrade takes effect at end of current billing period | No refunds for partial periods |
| BR-7.5 | Cancellation takes effect at end of current billing period | Access continues until period end |
| BR-7.6 | Subscription restrictions (by plan): | See table below |
| BR-7.7 | Expired subscription → downgraded to Free | 7-day grace period with reminders |
| BR-7.8 | Payment failure → 3 retries over 7 days → account suspended | Suspension reversible on payment |

### Subscription Plan Restrictions

| Feature | Free | Basic ($9.99) | Pro ($29.99) | Enterprise |
|---------|------|---------------|--------------|------------|
| Monthly Proposals | 5 | 20 | Unlimited | Unlimited |
| Portfolio Items | 3 | 10 | 50 | Unlimited |
| Active Projects (client) | 1 | 5 | 20 | Unlimited |
| Profile Visibility | Low | Medium | High | Featured |
| AI Proposal Builder | ✗ | ✗ | ✓ | ✓ |
| Skill Verification Badge | ✗ | ✗ | ✓ | ✓ |
| Priority Support | ✗ | ✗ | ✓ | ✓ |
| Analytics | ✗ | Basic | Advanced | Custom |
| API Access | ✗ | ✗ | ✗ | ✓ |

---

## BR-8: Messaging Rules

| ID | Rule | Details |
|----|------|---------|
| BR-8.1 | Messaging only between freelancer and client | No group chats |
| BR-8.2 | Pre-contract messaging allowed (after proposal submission) | Encourages communication |
| BR-8.3 | Messages cannot be edited after sending | Consider "unsend" in Phase 2 |
| BR-8.4 | File sharing: max 5 files per message, 10MB each | Virus scan (Phase 2) |
| BR-8.5 | Message retention: 2 years | After that, auto-deleted |
| BR-8.6 | Blocked user cannot send messages | Blocking is one-way |
| BR-8.7 | Reported conversations reviewed by admin within 24 hours | Priority flag for harassment |

---

## BR-9: Notification Rules

| ID | Rule | Details |
|----|------|---------|
| BR-9.1 | Users can configure notification preferences per type | In-app + email toggles |
| BR-9.2 | Email notifications: max 1 digest per hour | Prevents spam |
| BR-9.3 | Marketing emails require explicit opt-in | Compliance |
| BR-9.4 | Transactional emails always sent (cannot opt out) | Password reset, payment, etc. |
| BR-9.5 | In-app notifications stored for 90 days | Auto-cleaned |

---

## BR-10: Content Management Rules

| ID | Rule | Details |
|----|------|---------|
| BR-10.1 | Pages must have unique slug | Auto-generated from title, editable |
| BR-10.2 | Blog posts require status: DRAFT → PUBLISHED | Can schedule publish date |
| BR-10.3 | FAQ items organized by category | Each category has title + description |
| BR-10.4 | Banners have start date, end date, and link URL | Auto-expire after end date |
| BR-10.5 | Content supports both Arabic and English versions | Language toggle on each item |

---

*For detailed acceptance criteria with Gherkin scenarios for each rule, see [ACCEPTANCE_CRITERIA.md](ACCEPTANCE_CRITERIA.md). Functional implementation is documented in [FUNCTIONAL_REQUIREMENTS.md](FUNCTIONAL_REQUIREMENTS.md).*
