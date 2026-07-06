# Jobilo — Business Requirements Document (BRD)

> **Document Version:** 1.0  
> **Date:** July 2026  
> **Status:** Approved  
> **Cross-References:** [Functional Requirements](FUNCTIONAL_REQUIREMENTS.md), [Business Rules](BUSINESS_RULES.md), [Product Specification](PRODUCT_SPECIFICATION.md)

---

## 1. Project Overview

| Field | Value |
|-------|-------|
| **Project Name** | Jobilo — سوق العمل الحر بالعربية |
| **Project Goal** | Build a fully-featured freelancing marketplace for Arabic-speaking professionals |
| **Domain** | jobilo.com (platform domain) |
| **Tech Stack** | Next.js 15, NestJS, PostgreSQL 16, Prisma, Docker |
| **Target Market** | Freelancers & clients across the Arab world |

### 1.1 Vision & Mission

**Vision:** Become the #1 freelancing platform for the Arabic-speaking world, connecting 10M+ freelancers with opportunities by 2030.

**Mission:** Empower Arabic-speaking talent by providing a trusted, AI-powered marketplace that removes geographical and language barriers.

---

## 2. Target Market

### 2.1 Demographics

| Segment | Description | Size (Est.) |
|---------|------------|------------|
| **Freelancers (20-40 yrs)** | Developers, designers, writers, translators, marketers, video editors | 15M+ across MENA |
| **Clients (SMEs)** | Small-to-medium businesses seeking affordable talent | 5M+ businesses |
| **Clients (Startups)** | Early-stage startups needing project-based help | 500K+ |
| **Enterprise** | Large orgs needing vetted freelancer pools (future scope) | Future |

### 2.2 Key Markets (MVP Focus)

| Country | Freelancer Potential | Client Demand |
|---------|---------------------|---------------|
| مصر (Egypt) | Very High | High |
| المملكة العربية السعودية (KSA) | High | Very High |
| الإمارات (UAE) | High | Very High |
| الأردن (Jordan) | Medium | Medium |
| المغرب (Morocco) | High | Medium |
| السودان (Sudan) | High | Low (outbound focus) |
| العراق (Iraq) | Medium | Medium |
| تونس (Tunisia) | High | Low |
| باقي الدول العربية | Medium | Medium |

### 2.3 User Pain Points

| Pain Point | Jobilo Solution |
|------------|----------------|
| No Arabic-first freelancing platform | Full RTL Arabic UI + Arabic customer support |
| High commission fees (Upwork: 20%) | MVP: 0% commission, future: 5-10% |
| Payment barriers (no PayPal in many Arab countries) | Local payment gateways (MTN MoMo, Zain Cash, bank transfers) |
| Language barrier on existing platforms | Full Arabic experience, AI-powered translation |
| Trust & verification issues | Skill verification badges, client verification, escrow system |

---

## 3. Core Business Requirements

### BR-1: User Registration & Authentication

| ID | Requirement | Priority | Related Docs |
|----|------------|----------|-------------|
| BR-1.1 | Users must register with email + password or OAuth (Google, LinkedIn) | P0 | [FR-1.1](FUNCTIONAL_REQUIREMENTS.md#FR-1), [UC-1](USE_CASES.md#UC-1) |
| BR-1.2 | Email verification via OTP before platform access | P0 | [UC-2](USE_CASES.md#UC-2) |
| BR-1.3 | JWT-based authentication with refresh token rotation | P0 | See [Security Guide](SECURITY_TESTING.md) |
| BR-1.4 | Password reset via email link (valid 1 hour) | P0 | [FR-1.2.5](FUNCTIONAL_REQUIREMENTS.md#FR-12) |
| BR-1.5 | Two-factor authentication (future phase) | P1 | — |

### BR-2: Profile Management

| ID | Requirement | Priority |
|----|------------|----------|
| BR-2.1 | Freelancers create rich profiles (photo, bio, skills, portfolio, certifications) | P0 |
| BR-2.2 | Clients create company profiles (logo, description, industry, verification) | P0 |
| BR-2.3 | Profile strength indicator (% completion) | P0 |
| BR-2.4 | AI-powered profile improvement suggestions | P1 |

See detailed rules in [BUSINESS_RULES.md](BUSINESS_RULES.md#profile-rules).

### BR-3: Project Posting & Discovery

| ID | Requirement | Priority |
|----|------------|----------|
| BR-3.1 | Clients post projects with title, description, category, skills, budget, duration | P0 |
| BR-3.2 | Freelancers browse/search/filter projects | P0 |
| BR-3.3 | AI-powered project-to-freelancer matching | P1 |
| BR-3.4 | Bookmark/save projects for later | P0 |

See [Functional Requirements — Module 2](FUNCTIONAL_REQUIREMENTS.md#FR-2).

### BR-4: Proposal Submission & Acceptance

| ID | Requirement | Priority |
|----|------------|----------|
| BR-4.1 | Freelancers submit proposals with cover letter, bid amount, timeline | P0 |
| BR-4.2 | Clients review, shortlist, accept/reject proposals | P0 |
| BR-4.3 | One proposal per freelancer per project (no duplicates) | P0 |
| BR-4.4 | AI proposal quality scoring | P1 |

### BR-5: Messaging

| ID | Requirement | Priority |
|----|------------|----------|
| BR-5.1 | Real-time chat between freelancer and client | P0 |
| BR-5.2 | File sharing within messages | P0 |
| BR-5.3 | Pre-contract and post-contract messaging | P0 |

### BR-6: Admin Oversight

| ID | Requirement | Priority |
|----|------------|----------|
| BR-6.1 | Admin dashboard with platform-wide stats and charts | P0 |
| BR-6.2 | User management (suspend, verify, ban) | P0 |
| BR-6.3 | Project moderation (flag, remove, feature) | P0 |
| BR-6.4 | RBAC for admin roles (Admin, Super Admin, Moderator) | P0 |
| BR-6.5 | Audit log for all admin actions | P0 |

---

## 4. MVP Scope

### 4.1 In-Scope (MVP v1.0)

| Module | Description |
|--------|------------|
| User Registration & Auth | Email + OAuth, email verification, password reset |
| Profile Management | Freelancer & client profiles, portfolio upload |
| Project Management | CRUD, search, filter, pagination, bookmarks |
| Proposal Management | Submit, accept/reject, shortlist, withdraw |
| Messaging | Real-time WebSocket chat |
| Reviews & Ratings | Post-project rating (1-5 stars) + text review |
| Notifications | In-app + email notifications |
| Admin Dashboard | User management, project moderation, stats |
| RBAC | Admin roles (Admin, Super Admin, Moderator) |
| Content Management | Static pages, blog, FAQ, banners |
| Subscription Management | Freelancer subscription plans (Basic/Pro/Enterprise) |

### 4.2 Out-of-Scope (MVP v1.0)

| Feature | Reason |
|---------|--------|
| **Payments & Escrow** | Requires financial licensing, regulatory compliance, banking integration |
| **AI Smart Matching** | Depends on user data accumulation, training data |
| **Enterprise Features** | Requires custom workflows, dedicated support |
| **Mobile Apps** | PWA / responsive web only for MVP |
| **Dispute Resolution System** | Manual handling via admin for MVP |

> **MVP Decision:** The initial release focuses on **matching only** — freelancers and clients connect, communicate, and agree on terms. Financial transactions happen outside the platform initially.

---

## 5. Future Scope

### Phase 2 — Financial Module (v2.0)

| Feature | Description |
|---------|------------|
| Payment Gateway Integration | Stripe, PayPal, local gateways |
| Escrow System | Milestone-based fund holding |
| Wallet System | Platform wallet for users |
| Commission Model | 5-10% platform fee |
| Invoicing & Tax | Automated invoices, VAT handling |

### Phase 3 — AI & Intelligence (v2.5)

| Feature | Description |
|---------|------------|
| AI Project Matching | ML-based freelancer-to-project recommendations |
| Smart Proposal Builder | AI-generated proposal drafts |
| Fraud Detection | Anomaly detection on user behavior |
| Skill Assessment | Automated skill verification tests |

### Phase 4 — Enterprise & Scale (v3.0)

| Feature | Description |
|---------|------------|
| Enterprise Dashboard | Company accounts, team management |
| API for Partners | Public REST API for integrations |
| Marketplace Expansion | Service packages, fixed-price offerings |
| Mobile Native Apps | iOS + Android |

---

## 6. Success Criteria

| # | Criterion | Target (6-month) | Measurement |
|---|-----------|-----------------|-------------|
| SC-1 | Registered Users | 50,000+ | Database count |
| SC-2 | Active Freelancers (monthly) | 10,000+ | Users with active profiles |
| SC-3 | Active Clients (monthly) | 2,000+ | Clients who posted in 30 days |
| SC-4 | Projects Posted (total) | 15,000+ | Project count |
| SC-5 | Proposals Submitted | 75,000+ | Proposal count |
| SC-6 | Successful Connections | 5,000+ | Projects with accepted proposal |
| SC-7 | User Retention (D30) | 40%+ | Logged in within 30 days of registration |
| SC-8 | Platform Uptime | 99.9% | Monitoring tools |
| SC-9 | User Satisfaction (NPS) | 50+ | Survey |

---

## 7. Key Performance Indicators (KPIs)

### 7.1 Growth KPIs

| KPI | Definition | Target (Monthly) |
|-----|-----------|-----------------|
| New Registrations | New users created | 8,000+ |
| Freelancer → Client Ratio | Ratio of freelancers to clients | 5:1 |
| Project Post Rate | New projects per day | 80+ |
| Proposal Rate | Proposals per project (avg) | 5+ |

### 7.2 Engagement KPIs

| KPI | Definition | Target |
|-----|-----------|--------|
| DAU / MAU | Daily active / monthly active | 25%+ |
| Session Duration | Avg time on platform | 8+ minutes |
| Messages Sent | Per connected project | 20+ |
| Profile Completion Rate | % with 80%+ profile | 60%+ |

### 7.3 Quality KPIs

| KPI | Definition | Target |
|-----|-----------|--------|
| Project → Connection Rate | % of projects that get at least 1 proposal | 85%+ |
| Proposal → Acceptance Rate | % of proposals accepted | 20%+ |
| Average Rating | Platform-wide avg review score | 4.3+ ⭐ |
| Dispute Rate | % of projects disputed | < 3% |

### 7.4 Technical KPIs

| KPI | Target | Measurement |
|-----|--------|-------------|
| API Response Time (p95) | < 300ms | APM tools |
| Page Load Time | < 2s | Lighthouse |
| Error Rate | < 0.1% | Sentry |
| Uptime | 99.9% | Uptime monitoring |

---

## 8. Assumptions & Constraints

### Assumptions
- Target users have reliable internet access
- Freelancers possess basic digital literacy
- Clients are willing to communicate in Arabic
- Payment regulations in target countries can be navigated (Phase 2)

### Constraints
- **Regulatory:** No payment processing in MVP due to licensing requirements
- **Budget:** Bootstrapped development, lean team
- **Time:** MVP delivery within 6 months
- **Technical:** Mobile-first responsive web (no native apps for MVP)

---

## 9. Stakeholders

| Role | Name (Example) | Responsibility |
|------|---------------|----------------|
| Product Owner | Ahmed Hassan | BRD ownership, prioritization |
| Tech Lead | Mustafa Mohamed | Technical feasibility, architecture |
| UX Lead | Sarah Design | User research, wireframes |
| QA Lead | Omar Tester | Test strategy, acceptance |

---

*Refer to [FUNCTIONAL_REQUIREMENTS.md](FUNCTIONAL_REQUIREMENTS.md) for detailed functional specs, [BUSINESS_RULES.md](BUSINESS_RULES.md) for domain rules, and [PRODUCT_SPECIFICATION.md](PRODUCT_SPECIFICATION.md) for user flows and wireframes.*
