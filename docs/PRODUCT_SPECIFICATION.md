# Jobilo — Product Specification

> **Version:** 1.0 | **Status:** Draft | **Cross-Ref:** [BRD](BUSINESS_REQUIREMENTS.md), [User Stories](USER_STORIES.md), [Use Cases](USE_CASES.md)

---

## 1. Product Overview

**Jobilo** is a bilingual (Arabic/English) freelancing marketplace connecting Arabic-speaking talent with project opportunities. The platform prioritizes an Arabic-first experience with full RTL support, AI-assisted features, and a commission-free MVP phase.

| Aspect | Detail |
|--------|--------|
| **Product Type** | Two-sided marketplace (freelancers + clients) |
| **Platform** | Web (Next.js 15, responsive, PWA-ready) |
| **MVP Focus** | Discovery, connecting, and communication — no payments |
| **Revenue Model** | Subscription plans (Basic/Pro/Enterprise) → Future: commission |
| **Languages** | Arabic (primary), English (secondary) |
| **Target Users** | Freelancers (20-40), SMEs, startups across MENA |

---

## 2. User Personas

### Persona 1: Ahmed — المستقل (The Freelancer)

| Attribute | Detail |
|-----------|--------|
| **Name** | Ahmed Hassan |
| **Age** | 28 |
| **Location** | Cairo, Egypt |
| **Occupation** | Full-stack web developer |
| **Tech Comfort** | High — uses digital tools daily |
| **Goals** | Find quality remote projects, build a reputation, earn in USD |
| **Pain Points** | High fees on Upwork/Fiverr, language barriers with non-Arabic clients, payment withdrawal issues |
| **Motivation** | Freedom to choose projects, work from home, higher income |
| **Device** | Laptop (primary), phone (secondary) |
| **Platform Usage** | Daily, 2-3 hours |

**User Journey:**
1. Registers and builds rich profile with portfolio
2. Browses projects filtered by "JavaScript", budget $500-2000
3. Finds a React dashboard project with AI bidding suggestion
4. Submits proposal, chats with client, gets accepted
5. Delivers work, receives 5-star review

### Persona 2: Sarah — العميلة (The Client)

| Attribute | Detail |
|-----------|--------|
| **Name** | Sarah Al-Saud |
| **Age** | 34 |
| **Location** | Riyadh, KSA |
| **Occupation** | Startup founder (e-commerce) |
| **Tech Comfort** | Medium — prefers simple interfaces |
| **Goals** | Find reliable freelancers quickly, manage projects efficiently |
| **Pain Points** | Hard to find Arabic-speaking developers, vetting takes too long, past bad experiences with no-shows |
| **Motivation** | Scale business without hiring full-time employees |
| **Device** | Laptop + iPad |
| **Platform Usage** | Weekly, when she has projects |

**User Journey:**
1. Registers as a Client, creates company profile
2. Posts a project "تطوير متجر إلكتروني" with detailed requirements
3. Receives 12 proposals in 3 days, shortlists 4
4. Reviews profiles, messages 2 candidates, accepts one
5. Receives delivery, leaves a review

### Persona 3: Khaled — المدير (The Admin)

| Attribute | Detail |
|-----------|--------|
| **Name** | Khaled Mahmoud |
| **Age** | 40 |
| **Location** | Amman, Jordan |
| **Occupation** | Platform Operations Manager |
| **Tech Comfort** | High |
| **Goals** | Ensure platform safety, grow user base, resolve issues |
| **Pain Points** | Manually reviewing reports, spam accounts, keeping content updated |
| **Motivation** | Build the #1 Arabic freelancing platform |
| **Device** | Laptop (24/7 dashboard) |

---

## 3. Feature List with Priorities

### Must-Have (P0) — MVP Launch

| # | Feature | Module | User Story |
|---|---------|--------|------------|
| M1 | Email/password registration + OAuth | Auth | US-FR-1.1 |
| M2 | Email verification (OTP) | Auth | UC-2 |
| M3 | Password reset | Auth | US-FR-1.4 |
| M4 | Freelancer profile CRUD | Profile | US-FR-2.1 |
| M5 | Client company profile | Profile | US-CL-1.2 |
| M6 | Profile strength indicator | Profile | US-FR-2.5 |
| M7 | Portfolio upload (images) | Profile | US-FR-2.2 |
| M8 | Project CRUD (create, edit, delete, publish) | Projects | US-CL-2.1 |
| M9 | Project search + filter + pagination | Projects | US-FR-3.1-3.3 |
| M10 | Project bookmarks | Projects | US-FR-3.4 |
| M11 | Proposal submission (cover letter + bid) | Proposals | US-FR-4.1 |
| M12 | Proposal accept/reject/shortlist | Proposals | US-CL-3.1-3.5 |
| M13 | Proposal withdraw | Proposals | US-FR-4.5 |
| M14 | Real-time messaging (WebSocket) | Messaging | US-FR-5.1 |
| M15 | In-app notifications | Notifications | US-FR-4.6 |
| M16 | Email notifications | Notifications | — |
| M17 | Post-project reviews (1-5 stars) | Reviews | US-CL-5.1 |
| M18 | Admin dashboard (stats, charts) | Admin | US-AD-1.1 |
| M19 | Admin user management (suspend, verify, ban) | Admin | US-AD-2.1-2.3 |
| M20 | RBAC (Admin, Super Admin, Moderator) | Admin | US-SA-1.1 |
| M21 | Content pages CRUD | CMS | US-AD-3.1 |
| M22 | Blog CRUD | CMS | US-AD-3.2 |
| M23 | FAQ management | CMS | US-AD-3.3 |
| M24 | Banner management | CMS | US-AD-3.4 |
| M25 | Subscription plans + user subscriptions | Subscriptions | US-AD-5.1-5.3 |

### Should-Have (P1) — Phase 1.1

| # | Feature | Module |
|---|---------|--------|
| S1 | LinkedIn OAuth registration | Auth |
| S2 | Phone verification (SMS OTP) | Auth |
| S3 | Two-factor authentication (TOTP) | Auth |
| S4 | AI profile improvement suggestions | Profile |
| S5 | Work experience + education on profile | Profile |
| S6 | Certifications on profile | Profile |
| S7 | AI-powered project recommendations | Projects |
| S8 | AI proposal draft generator | Proposals |
| S9 | Proposal editing (before client response) | Proposals |
| S10 | Emoji picker in chat | Messaging |
| S11 | Business verification for clients | Profile |
| S12 | Platform settings (commission, features) | Admin |
| S13 | Reply to reviews | Reviews |
| S14 | Export reports (CSV, PDF) | Admin |

### Nice-to-Have (P2) — Phase 2+

| # | Feature | Module |
|---|---------|--------|
| N1 | Suspicious login detection | Auth |
| N2 | Team member management (client) | Profile |
| N3 | Saved search results | Projects |
| N4 | Content versioning | CMS |
| N5 | Email broadcast to users | Admin |
| N6 | Offline detection | UX |
| N7 | Translation of chat messages | Messaging |
| N8 | Anti-money laundering checks | Compliance |

---

## 4. Pages & Routes

### Public Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Landing page with search, featured projects, stats |
| Browse Projects | `/projects` | Paginated project list with search and filters |
| Project Detail | `/projects/[id]` | Full project details + proposal button |
| Browse Freelancers | `/freelancers` | Freelancer directory (Phase 2) |
| Freelancer Profile | `/freelancers/[id]` | Public profile with portfolio and reviews |
| About | `/about` | Platform information |
| Contact | `/contact` | Contact form |
| Terms | `/terms` | Terms of service |
| Privacy | `/privacy` | Privacy policy |
| FAQ | `/faq` | Frequently asked questions |
| Blog | `/blog` | Blog post listing |
| Blog Post | `/blog/[slug]` | Individual blog post |

### Authenticated Pages (Freelancer)

| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/dashboard` | Freelancer home (stats, recent activity) |
| My Profile | `/dashboard/profile` | Edit personal profile |
| My Portfolio | `/dashboard/portfolio` | Manage portfolio items |
| My Proposals | `/dashboard/proposals` | View all submitted proposals |
| Saved Projects | `/dashboard/saved` | Bookmarked projects |
| Messages | `/dashboard/messages` | Chat inbox |
| Message Thread | `/dashboard/messages/[id]` | Individual conversation |
| Notifications | `/dashboard/notifications` | Notification center |
| Subscription | `/dashboard/subscription` | Current plan, upgrade/downgrade |
| Settings | `/dashboard/settings` | Account settings, password change |

### Authenticated Pages (Client)

| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/dashboard/client` | Client home |
| My Projects | `/dashboard/client/projects` | List of posted projects |
| Create Project | `/dashboard/client/projects/new` | Project creation form |
| Edit Project | `/dashboard/client/projects/[id]/edit` | Edit existing project |
| Project Proposals | `/dashboard/client/projects/[id]/proposals` | View proposals for project |
| Company Profile | `/dashboard/client/profile` | Edit company info |
| Messages | `/dashboard/messages` | Chat inbox |
| Reviews Given | `/dashboard/client/reviews` | Reviews left for freelancers |
| Settings | `/dashboard/settings` | Account settings |

### Admin Pages

| Page | Route | Description |
|------|-------|-------------|
| Admin Dashboard | `/admin` | Overview with stats charts |
| User Management | `/admin/users` | User list, search, actions |
| User Detail | `/admin/users/[id]` | Full user details + activity log |
| Project Moderation | `/admin/projects` | Project list with moderation |
| Reports | `/admin/reports` | Flagged content review |
| Content Pages | `/admin/content/pages` | Manage static pages |
| Blog Posts | `/admin/content/blog` | Manage blog posts |
| FAQ | `/admin/content/faq` | Manage FAQ |
| Banners | `/admin/content/banners` | Manage homepage banners |
| Subscriptions | `/admin/subscriptions` | Plans and user subscriptions |
| Admin Roles | `/admin/roles` | RBAC management |
| Settings | `/admin/settings` | Platform configuration |
| Audit Log | `/admin/audit` | Admin action history |

---

## 5. User Flows

### Flow 1: Registration & Onboarding

```
[Home] → [Sign Up] → [Select Role] → [Fill Form] → [Verify Email (OTP)]
    → [Account Active] → [Onboarding: Profile Setup]
        → [Freelancer: Skills, Portfolio, Rates]
        → [Client: Company Info, Industry]
    → [Dashboard]
```

### Flow 2: Project Lifecycle (Client)

```
[Create Project] → [Draft] → [Preview] → [Publish → OPEN]
    → [Receive Proposals] → [Review & Shortlist]
    → [Accept Proposal → IN_PROGRESS]
    → [Messaging Workspace Active]
    → [Project Completed] → [Leave Review]
```

### Flow 3: Proposal Lifecycle (Freelancer)

```
[Browse Projects] → [Find Project] → [Open Detail]
    → [Submit Proposal (Cover Letter + Bid)]
    → [Proposal PENDING]
    → [Client Reviews]
        → [Accepted] → [Start Work]
        → [Rejected] → [Seek Next Project]
        → [No Response] → [Withdraw or Wait]
```

---

## 6. Wireframe Descriptions

### Page 1: Homepage

| Section | Content |
|---------|---------|
| **Hero** | Search bar (center), tagline "سوق العمل الحر العربي", CTA buttons |
| **Stats Bar** | Number of freelancers, projects posted, successful connections |
| **Categories** | Grid of 8-12 categories (Programming, Design, Writing, Marketing, etc.) |
| **Featured Projects** | 6 featured projects with title, budget, skills tags |
| **How It Works** | 3-step carousel (Post → Find → Work) |
| **Testimonials** | User quotes and ratings |
| **Footer** | Links, social media, newsletter signup |

### Page 2: Project Detail

| Section | Content |
|---------|---------|
| **Header** | Title, status badge, posted date |
| **Body** | Full description (rich text), attachments |
| **Sidebar** | Budget, duration, experience level, category, required skills |
| **Client Info** | Name, company, rating, member since |
| **Proposals Section** | Number of proposals, "تقديم عرض" button (freelancer) |
| **Similar Projects** | 3 related project cards |

### Page 3: Freelancer Profile (Public)

| Section | Content |
|---------|---------|
| **Header** | Photo, name, title, rating, location, rate |
| **Bio** | About me section |
| **Skills** | Skill tags with proficiency levels |
| **Portfolio** | Grid of portfolio items with images |
| **Experience** | Work history timeline |
| **Education** | Degrees and certifications |
| **Reviews** | Star ratings and text reviews from clients |

### Page 4: Admin Dashboard

| Section | Content |
|---------|---------|
| **Top Bar** | Date range picker, notification bell, admin profile |
| **KPI Cards** | 4 cards: MAU, New Projects, Active Freelancers, Reports |
| **Line Chart** | Registrations over time (30 days) |
| **Bar Chart** | Projects by category |
| **Recent Activity** | Latest 10 platform events |
| **Quick Actions** | Buttons: New user, moderate project, send broadcast |

---

*For full functional details, see [FUNCTIONAL_REQUIREMENTS.md](FUNCTIONAL_REQUIREMENTS.md). For test scenarios covering these flows, see [TEST_PLAN.md](TEST_PLAN.md).*
