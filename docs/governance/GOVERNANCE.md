# Governance Model

> Last Updated: 2026-07-06

This document defines the governance model for the Jobilo project. All contributors are expected to follow these guidelines. See [DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md) for day-to-day development workflows.

---

## 1. Repository Overview

| Attribute | Value |
|-----------|-------|
| **Repository** | `jobilo/jobilo` |
| **Visibility** | Private (during MVP) |
| **License** | MIT |
| **Default Branch** | `main` |
| **Package Manager** | pnpm |
| **Monorepo Tool** | Turborepo |

---

## 2. Roles and Responsibilities

| Role | Badge | Responsibilities | Vote Weight |
|------|-------|------------------|-------------|
| **Maintainer** | `@core-maintainer` | Final decisions, release management, roadmap, conflict resolution | Veto power |
| **Committer** | `@committer` | Merge PRs, triage issues, mentor contributors | 1 vote |
| **Reviewer** | `@reviewer` | Review PRs, approve code changes | Advisory |
| **Contributor** | `@contributor` | Submit PRs, report issues, participate in discussions | Advisory |

### 2.1 Maintainer

- Owns the long-term vision and roadmap
- Has merge rights to `main` and `develop` branches
- Resolves disputes when consensus cannot be reached
- Approves releases and version bumps
- See [BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md) for branch management.

### 2.2 Committer

- Has write access to `develop` and feature branches
- Can approve and merge PRs into `develop`
- Triage and assign issues
- Mentors new contributors
- Must have 10+ accepted contributions to be nominated

### 2.3 Reviewer

- Must have 5+ accepted contributions to be nominated
- Reviews PRs for correctness, security, and style
- Can request changes or approve PRs (approval is advisory)
- Follows the [CODE_REVIEW_GUIDE.md](./CODE_REVIEW_GUIDE.md)

### 2.4 Contributor

- Anyone with an accepted PR or meaningful issue report
- Expected to follow [CODING_STANDARDS.md](./CODING_STANDARDS.md) and [COMMIT_CONVENTION.md](./COMMIT_CONVENTION.md)

---

## 3. Decision-Making Process

The project uses a **Consensus-Seeking** model:

1. **Proposal** — Anyone can submit a proposal via a GitHub Issue with the `proposal` label.
2. **Discussion** — Minimum 72-hour discussion period for non-trivial proposals.
3. **Vote** — Committers and Maintainers vote.
4. **Decision** — If consensus (approval > 50%, no veto), the decision is accepted.
5. **ADR** — All decisions are recorded following [ADR_TEMPLATE.md](./ADR_TEMPLATE.md) and logged in [DECISION_LOG.md](./DECISION_LOG.md).

### 3.1 Voting

| Scope | Voters | Threshold | Duration |
|-------|--------|-----------|----------|
| Code changes | Reviewers | 1 approval | — |
| Feature proposals | Committers | > 50% | 72h |
| Breaking changes | Maintainers + Committers | > 75% | 120h |
| New Maintainer | All Committers | Unanimous | 168h |
| Roadmap changes | Maintainers | Consensus | — |

### 3.2 Conflict Resolution

1. **Direct discussion** in the issue / PR comments.
2. **Mediation** by a Maintainer if discussion stalls.
3. **Maintainer decision** if mediation fails — documented in an ADR.

---

## 4. Communication Channels

| Channel | Purpose | Frequency |
|---------|---------|-----------|
| GitHub Issues | Bug reports, feature requests | Async |
| GitHub Discussions | RFCs, design proposals | Async |
| Slack (`#jobilo-dev`) | Day-to-day coordination | Real-time |
| Weekly Sync | Standup, blockers, planning | Weekly, 30 min |
| Monthly Demo | Showcase completed work | Monthly, 1 hour |

### Meeting Cadence

| Meeting | Day | Duration | Attendees |
|---------|-----|----------|-----------|
| Daily Standup | Mon-Fri | 15 min | All active |
| Sprint Planning | Monday | 1 hour | All |
| Backlog Grooming | Wednesday | 30 min | PO + Committers |
| Retrospective | Friday | 1 hour | All |

---

## 5. Code Ownership

A `CODEOWNERS` file at the repository root defines ownership:

```gitignore
# Default owners
* @jobilo/core-maintainer

# Backend (NestJS)
apps/api/ @jobilo/backend-committers

# Frontend (Next.js)
apps/web/ @jobilo/frontend-committers

# Database
prisma/ @jobilo/backend-committers

# Infrastructure
infra/ @jobilo/devops-committer

# Documentation
docs/ @jobilo/docs-maintainer

# CI/CD
.github/ @jobilo/devops-committer
```

Every PR requires approval from at least one owner of each affected area.

---

## 6. Related Documents

- [CODING_STANDARDS.md](./CODING_STANDARDS.md) — Code style and formatting rules
- [ARCHITECTURE_PRINCIPLES.md](./ARCHITECTURE_PRINCIPLES.md) — Architectural conventions
- [BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md) — Git branch workflow
- [COMMIT_CONVENTION.md](./COMMIT_CONVENTION.md) — Commit message format
- [CODE_REVIEW_GUIDE.md](./CODE_REVIEW_GUIDE.md) — Review expectations
- [DEFINITION_OF_DONE.md](./DEFINITION_OF_DONE.md) — Completion criteria
- [TECHNICAL_DECISIONS.md](./TECHNICAL_DECISIONS.md) — ADR index
