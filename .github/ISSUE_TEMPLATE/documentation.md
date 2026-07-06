---
name: Documentation
about: Report missing, incorrect, or unclear documentation
title: "[DOCS] "
labels: documentation
assignees: ""
---

## What's Missing or Incorrect

A clear description of the documentation gap or error.

## Location

Provide the exact file path(s) or URL(s) where the issue exists.

- File: `docs/api/README.md`
- Section: **Authentication**
- Lines: 42–56

## Suggested Change

Describe what should be added, corrected, or removed. Include before/after if helpful.

```diff
- The API uses Basic Auth.
+ The API uses Bearer JWT tokens passed in the `Authorization` header.
```

## Why This Is Important

Explain who this affects and what confusion or blockers it causes.

- [ ] Developers cannot integrate without this information
- [ ] The existing docs are misleading and cause bugs
- [ ] New contributors are blocked from onboarding
- [ ] Compliance / security docs must be accurate

## Additional Context

Link to related issues, PRs, or Slack conversations that informed this request.
