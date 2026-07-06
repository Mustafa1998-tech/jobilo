# Team Guide

> **Version:** 1.0 | **Last Updated:** 2026-07-06 | **Applies to:** All Team Members

## Table of Contents

1. [Team Structure and Roles](#team-structure-and-roles)
2. [Communication Guidelines](#communication-guidelines)
3. [Meeting Schedule](#meeting-schedule)
4. [Decision-Making Process](#decision-making-process)
5. [Code of Conduct](#code-of-conduct)
6. [Career Development](#career-development)
7. [Performance Expectations](#performance-expectations)

---

## Team Structure and Roles

### Organizational Structure

```
CTO / Engineering Director
├── Backend Team (3-4 engineers)
│   ├── Senior Backend Engineer (NestJS, PostgreSQL, Redis)
│   ├── Backend Engineer
│   └── Junior Backend Engineer
├── Frontend Team (3-4 engineers)
│   ├── Senior Frontend Engineer (Next.js, React, TypeScript)
│   ├── Frontend Engineer
│   └── Junior Frontend Engineer
├── DevOps / Platform (1-2 engineers)
│   └── DevOps Engineer (Docker, Kubernetes, CI/CD, Cloud)
├── QA (1 engineer)
│   └── QA Engineer (manual + automated testing)
└── Product (1-2)
    ├── Product Manager
    └── Product Designer (UI/UX)
```

### Role Definitions

| Role | Responsibility | Key Skills |
|------|---------------|------------|
| **Backend Engineer** | API development, database design, business logic | NestJS, TypeORM, PostgreSQL, Redis |
| **Frontend Engineer** | UI development, state management, design system | Next.js, React, TypeScript, Tailwind |
| **DevOps Engineer** | Infrastructure, CI/CD, monitoring, deployment | Docker, K8s, AWS, Terraform, Prometheus |
| **QA Engineer** | Test strategy, automation, regression | Playwright, Jest, manual testing |
| **Product Manager** | Roadmap, requirements, stakeholder management | Product strategy, agile |
| **Product Designer** | UX research, UI design, design system | Figma, prototyping, accessibility |
| **Tech Lead** | Architecture decisions, code quality, mentoring | System design, leadership |
| **Engineering Manager** | Team management, career development, processes | Leadership, coaching |

### Rotation Policy

- **On-call rotation**: Weekly rotation among backend engineers
- **Code review rotation**: All engineers participate in PR reviews
- **Tech talks**: Monthly rotation for presenting to the team

---

## Communication Guidelines

### General Principles

| Principle | Practice |
|-----------|---------|
| **Be transparent** | Share progress, blockers, and mistakes early |
| **Default to public** | Use public channels, not DMs for work discussions |
| **Async first** | Write things down before scheduling a meeting |
| **Respect time zones** | Be mindful of colleagues' working hours |
| **Constructive feedback** | Focus on the work, not the person |
| **Document decisions** | Record why a decision was made, not just the outcome |

### Communication Tools

| Tool | Purpose | Best For |
|------|---------|----------|
| Slack | Day-to-day communication | Quick questions, updates, alerts |
| GitHub | Code discussions | PR reviews, code comments, issues |
| Notion | Documentation | Project docs, specs, meeting notes |
| Linear | Task tracking | Tickets, sprints, roadmap |
| Google Meet | Video calls | Standups, planning, 1:1s |
| Email | External communication | Clients, partners, formal communication |

### Slack Etiquette

| Do | Don't |
|----|-------|
| Use threads to keep channels organized | @everyone unless urgent |
| Prefix messages with [Question], [Urgent], [FYI] | Send long messages without context |
| Set status when OOO, in meetings, or focused | Expect immediate responses |
| Share updates in the relevant channel | DM for things that belong in a public channel |
| Use reactions to acknowledge messages | Leave messages unanswered |

### Response Time Expectations

| Message Type | Expected Response Time |
|-------------|----------------------|
| @mention / DM | Within 2 hours during work hours |
| Slack channel question | Within 4 hours |
| PR review request | Within 24 hours |
| Slack message (no @) | Within 24 hours |
| Email | Within 48 hours |

---

## Meeting Schedule

### Recurring Meetings

| Meeting | Frequency | Duration | Attendees | Purpose |
|---------|-----------|----------|-----------|---------|
| Daily Standup | Daily | 15 min | Engineering team | What I did, what I'll do, blockers |
| Sprint Planning | Biweekly | 1 hour | Full team | Plan next sprint, estimate tickets |
| Sprint Review | Biweekly | 30 min | Full team | Demo completed work |
| Retrospective | Biweekly | 45 min | Engineering team | What went well, what to improve |
| Backend Sync | Weekly | 30 min | Backend team | Technical discussions, alignment |
| Frontend Sync | Weekly | 30 min | Frontend team | Technical discussions, alignment |
| 1:1 with Manager | Weekly | 30 min | Individual | Career, feedback, concerns |
| Design Review | As needed | 30 min | Design + devs | Review UI/UX changes |
| Tech Talk | Monthly | 1 hour | Full team | Knowledge sharing |

### Standup Format

```
1. What did I accomplish yesterday?
2. What will I work on today?
3. What blockers do I have?
4. (Optional) Any updates I want to share?

Format: Written in Slack #standup channel by 10:00 AM
```

### Meeting Rules

- Always have an agenda (shared in advance)
- Start on time, end on time
- No meeting zones: 12:00–1:00 PM (lunch), Fridays after 3:00 PM
- If there's no agenda, cancel the meeting
- Meetings > 30 min should have a note-taker

---

## Decision-Making Process

### Decision Types

| Type | Who Decides | Process |
|------|-------------|---------|
| **Architecture** | Tech Lead + team consensus | RFC document, team review, 48h feedback |
| **Feature priority** | Product Manager | Based on roadmap and stakeholder input |
| **Sprint scope** | Team + PM | Sprint planning session |
| **Code standards** | Tech Lead | Style guide, linter config, PR review |
| **Design decisions** | Product Designer + dev input | Design review meeting |
| **Hiring** | Engineering Manager + team | Structured interview process |
| **Tool selection** | Team consensus | RFC + trial period + vote |

### RFC Process

For significant technical decisions, follow the RFC (Request for Comments) process:

```
1. Write RFC document (template in Notion)
2. Share in #dev channel with RFC: prefix
3. 48-hour comment period
4. Review feedback, update RFC
5. Final decision by Tech Lead or team vote
6. Archive RFC in Notion with outcome
```

### Disagreement Resolution

```
1. Discuss directly (Slack or in-person)
2. Escalate to Tech Lead if no resolution
3. Final escalation to CTO
4. Decision is final — commit and move forward
```

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming, inclusive, and harassment-free experience for everyone, regardless of gender, age, sexual orientation, disability, ethnicity, religion, or experience level.

### Expected Behavior

- Be respectful and considerate in all interactions
- Use welcoming and inclusive language
- Accept constructive criticism gracefully
- Focus on the best outcome for the team and the product
- Show empathy towards other team members

### Unacceptable Behavior

- Harassment, intimidation, or discrimination of any kind
- Offensive comments, trolling, or personal attacks
- Publishing others' private information without consent
- Sexual content or unwelcome advances
- Any conduct that creates an unsafe environment

### Reporting

If you experience or witness unacceptable behavior:

1. Report to your Engineering Manager
2. If involving your manager, report to CTO or HR
3. Reports are confidential and taken seriously

### Enforcement

- First violation: Verbal warning
- Second violation: Written warning
- Severe violation: Immediate suspension or termination

---

## Career Development

### Growth Framework

| Level | Title | Expected Time | Key Behaviors |
|-------|-------|---------------|---------------|
| L1 | Junior Engineer | 0–1 year | Learns quickly, asks questions, completes tasks with guidance |
| L2 | Engineer | 1–3 years | Works independently, contributes to planning, mentors juniors |
| L3 | Senior Engineer | 3–5 years | Leads projects, architects solutions, mentors others |
| L4 | Staff Engineer | 5+ years | Cross-team impact, sets technical direction, drives standards |
| L5 | Principal Engineer | 7+ years | Company-wide impact, industry recognition, thought leadership |

### Career Paths

| Track | Focus | Example Progression |
|-------|-------|-------------------|
| **Individual Contributor** | Technical depth, expertise | Engineer → Senior → Staff → Principal |
| **Engineering Management** | People leadership, processes | Engineer → Tech Lead → EM → Director |
| **Architecture** | System design, cross-team | Senior → Staff → Principal Architect |

### Development Opportunities

| Opportunity | Frequency | Description |
|-------------|-----------|-------------|
| Tech talks | Monthly | Present on a topic of your choice |
| Conferences | Quarterly | Attend relevant conferences (budget available) |
| Training budget | Annual | $2,000 for courses, books, certifications |
| Side projects | Quarterly | 1 day per quarter for hackathon / personal projects |
| Cross-team rotation | Bi-annual | 2 weeks working on another team |
| Open source contribution | Encouraged | Contribute to libraries we use |

### Feedback Process

| Type | Frequency | Format |
|------|-----------|--------|
| Peer feedback | Per project | Retro format |
| Manager 1:1 | Weekly | Informal conversation |
| Performance review | Quarterly | Written + discussion |
| 360 review | Annual | Anonymous peer survey |

---

## Performance Expectations

### Core Values

| Value | Definition | Example Behaviors |
|-------|-----------|------------------|
| **Ownership** | Take responsibility for outcomes | See a bug, fix it; own your features end-to-end |
| **Excellence** | High quality in everything | Write tests, review PRs thoroughly, document decisions |
| **Collaboration** | Better together | Help teammates, share knowledge, unblock others |
| **Growth** | Continuous improvement | Learn new skills, give and receive feedback |
| **Impact** | Focus on what matters | Prioritize high-value work, measure results |

### Code Quality Expectations

| Area | Minimum Standard |
|------|-----------------|
| Test coverage | 80%+ for new code |
| Linting | Zero warnings |
| TypeScript | strict mode, no `any` unless justified |
| Performance | Lighthouse score > 90 |
| Accessibility | axe-core: zero violations |
| Security | No secrets in code, input validation |
| Documentation | Public APIs documented, complex logic explained |

### Delivery Expectations

| Metric | Target |
|--------|--------|
| PR cycle time | < 2 days from open to merge |
| Bug fix time (P0) | < 4 hours |
| Bug fix time (P1) | < 24 hours |
| Sprint completion | > 80% of committed points |
| Code review turnaround | < 24 hours |
| Uptime (production) | > 99.9% |

---

## Cross-References

| Document | Link |
|----------|------|
| Onboarding Guide | [ONBOARDING.md](./ONBOARDING.md) |
| FAQ | [FAQ.md](./FAQ.md) |
| Code of Conduct | [CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md) |
| Contributing | [CONTRIBUTING.md](../CONTRIBUTING.md) |
| Architecture | [ARCHITECTURE.md](../ARCHITECTURE.md) |
