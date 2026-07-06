---
name: Feature request
about: Suggest an idea for Jobilo
title: "[FEAT] "
labels: enhancement
assignees: ""
---

## Problem Statement

A clear and concise description of the problem or pain point.
Example: "I'm always frustrated when I cannot filter candidates by multiple skills simultaneously."

## Proposed Solution

Describe the solution you'd like. Be specific about behaviour, API changes, UI mockups, or configuration options.

```[language]
// Optional: code snippet showing intended usage
```

## Alternatives Considered

List any alternative solutions or workarounds you've explored and why they fall short.

1. Alternative A — doesn't scale because...
2. Alternative B — too complex for the common case...

## Acceptance Criteria

Concrete, testable conditions that must be met for this feature to be considered complete.

- [ ] New API endpoint `GET /api/v1/candidates/filter` accepts `?skills=`
- [ ] Frontend filter dropdown supports multi-select
- [ ] Results are paginated and sorted by relevance
- [ ] Unit tests cover filter logic
- [ ] E2E tests cover the filter flow
- [ ] Documentation updated in `docs/api/`

## Priority

- [ ] 🔴 Critical — blocks other work or release
- [ ] 🟠 High — important for upcoming milestone
- [ ] 🟡 Medium — nice to have this quarter
- [ ] 🟢 Low — future consideration

## Impact Area

Select all that apply:

- [ ] Backend — API / services / business logic
- [ ] Frontend — UI / components / state management
- [ ] Database — schema / migrations / queries
- [ ] Documentation — guides / API reference / README
- [ ] DevOps — CI/CD / Docker / infrastructure
- [ ] Security — auth / permissions / data privacy

## Additional Context

Add links to related issues, external references, or mockups.
