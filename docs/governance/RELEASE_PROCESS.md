# Release Process

This document describes the end-to-end release process for the Jobilo platform.

---

## Version Bump (SemVer)

Jobilo follows [Semantic Versioning 2.0.0](https://semver.org/).

| Bump   | When                                                              | Example |
|--------|-------------------------------------------------------------------|---------|
| MAJOR  | Breaking API changes, database schema changes, removed features   | 1.0.0 → 2.0.0 |
| MINOR  | New features, non-breaking additions                              | 1.0.0 → 1.1.0 |
| PATCH  | Bug fixes, performance improvements, security patches             | 1.0.0 → 1.0.1 |
| PRERELEASE | Release candidates                                            | 2.0.0-rc.1 |

Determine the next version based on the unreleased changelog entries.

```bash
# Current version
npm version --no-git-tag-version

# Bump version and create a git tag
npm version minor -m "chore(release): v%s"
```

---

## Release Branch Creation

For non-trivial releases, create a release branch for stabilization.

```bash
git checkout main
git pull
git checkout -b release/v1.2.0
git push origin release/v1.2.0
```

The release branch is used for:

- Final testing and QA
- Last-minute bug fixes (committed directly to the release branch)
- Documentation updates

---

## Changelog Finalization

Update `CHANGELOG.md` following the [Keep a Changelog](https://keepachangelog.com/) format.

### Structure

```markdown
# Changelog

## [1.2.0] — 2026-03-15

### Added
- Multi-skill candidate filtering (#142)
- Email notification preferences page (#138)

### Changed
- Upgraded Prisma to v6.0 (#145)
- Increased rate limit from 100 to 300 req/min (#143)

### Fixed
- Session expiry race condition on token refresh (#140)
- Date picker timezone offset in Safari (#137)

### Security
- Patched XSS vulnerability in candidate profile viewer (#141)

[1.2.0]: https://github.com/jobilo/jobilo/compare/v1.1.0...v1.2.0
```

### Automation

```bash
# Generate changelog from commit messages (requires conventional-changelog)
npx conventional-changelog -p angular -i CHANGELOG.md -s
```

Review and edit the auto-generated entries — group them logically and remove noise.

---

## Release Candidate Testing

Before tagging a final release, run a full test suite:

### Automated checks

| Check            | Tool / Pipeline                |
|------------------|--------------------------------|
| Unit tests       | `npm test`                     |
| Integration tests| `npm run test:integration`     |
| E2E tests        | `npm run test:e2e`             |
| Lint             | `npm run lint`                 |
| TypeScript       | `npm run typecheck`            |
| Build            | `npm run build`                |
| Security scan    | CI security-scan workflow      |
| Docker build     | `docker compose build`         |

### Manual QA checklist

- [ ] Smoke test all major user flows (signup, login, search, apply)
- [ ] Test on mobile viewport (375px, 414px)
- [ ] Test on tablet viewport (768px, 1024px)
- [ ] Verify error states (network timeout, 4xx, 5xx)
- [ ] Verify empty states (no results, no notifications)
- [ ] Test with screen reader (VoiceOver / NVDA)
- [ ] Performance: Lighthouse score ≥ 90 on all categories
- [ ] Database migrations run cleanly (up and down)

---

## Tagging

Once QA passes, tag the release.

```bash
# Merge release branch into main
git checkout main
git merge --no-ff release/v1.2.0 -m "chore(release): merge v1.2.0"

# Create an annotated tag
git tag -a v1.2.0 -m "Release v1.2.0 — Candidate skill matching"

# Push tag (triggers CI deploy)
git push origin v1.2.0
```

If applicable, merge `main` back into `develop` if using a separate development branch.

---

## Deployment

### Staging (auto-deploy)

- Every push to `main` triggers the CI deploy workflow (`deploy.yml`)
- Staging URL: `https://staging.jobilo.io`
- Health endpoint: `https://staging.jobilo.io/health`

### Production (tagged releases)

- Pushing a SemVer tag (`v*`) triggers the deploy workflow
- Production URL: `https://jobilo.io`
- Health endpoint: `https://jobilo.io/health`

### What the deploy pipeline does

1. Build Docker images (backend + frontend) and push to `ghcr.io`
2. Deploy to staging, run health check
3. Deploy to production, run health check
4. Send Slack notification with status

---

## Post-Release Monitoring

Monitor the following for **24 hours** after a release:

### Metrics

| Metric              | Tool            | Warning threshold       |
|---------------------|-----------------|-------------------------|
| Error rate          | Sentry          | > 1% of requests        |
| API latency (p95)   | Datadog / Grafana | > 500ms               |
| Uptime              | Pingdom         | < 99.9%                 |
| Active users        | Mixpanel / PostHog | > 20% drop compared to previous week |

### Rollback triggers

Auto-rollback (via deploy workflow) is initiated when:

- Health check returns non-200 status for 60+ seconds
- Error rate exceeds 5% for 5+ minutes

Manual rollback may be initiated by the on-call engineer for any severity-1 incident.

---

## Hotfix Process

Hotfixes bypass the normal release cycle for urgent production issues.

```bash
# From the production tag
git checkout -b hotfix/payment-timeout v1.2.0

# Fix the issue
# ...

# Commit using the hotfix convention
git commit -m "fix(payment): increase timeout from 5s to 15s"

# PR into main
git push origin hotfix/payment-timeout
# Open a PR targeting main — label it `hotfix`

# After merge, tag immediately
git checkout main
git pull
git tag -a v1.2.1 -m "Hotfix v1.2.1 — Payment timeout"
git push origin v1.2.1
```

### Hotfix criteria

A hotfix is appropriate when:

- Production is actively down or degraded
- A security vulnerability is being actively exploited
- Data integrity is at risk (data loss or corruption)

If the issue is not urgent, use the normal release process instead.

---

## Release Checklist Summary

| Step                        | Responsible         | Done |
|-----------------------------|---------------------|------|
| Determine next version      | Tech Lead           | ☐    |
| Create release branch       | Tech Lead           | ☐    |
| Finalize changelog          | Tech Lead           | ☐    |
| Run automated tests         | CI                  | ☐    |
| Manual QA                   | QA Engineer         | ☐    |
| Tag and push                | Tech Lead           | ☐    |
| Deploy to staging           | CI                  | ☐    |
| Deploy to production        | CI                  | ☐    |
| Monitor for 24 hours        | On-call Engineer    | ☐    |
| Close release milestone     | Tech Lead           | ☐    |
| Retrospective (if major)    | Entire Team         | ☐    |

---

## Related Documents

- [Git Workflow Guide](./GIT_WORKFLOW.md)
- [Pull Request Guide](./PULL_REQUEST_GUIDE.md)
- [CONTRIBUTING.md](../../CONTRIBUTING.md)
