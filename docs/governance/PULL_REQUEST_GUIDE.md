# Pull Request Guide

This guide explains how to create, review, and merge pull requests for the Jobilo platform.

---

## Creating a Good PR

A good PR is **small**, **focused**, and **well-described**. Before opening a PR:

- [ ] Read the contributing guide (`CONTRIBUTING.md`)
- [ ] Ensure your branch is up to date with `main`
- [ ] Run lint, typecheck, and tests locally
- [ ] Write or update tests for your changes
- [ ] Update documentation if behaviour changed

---

## PR Description Format

Every PR must include a description using the template at `.github/PULL_REQUEST_TEMPLATE.md`. Key sections:

| Section         | Purpose                                                 |
|-----------------|---------------------------------------------------------|
| **Description** | What changed and why. Link to the issue.                |
| **Type**        | feat / fix / docs / refactor / test / chore             |
| **Checklist**   | Verify all boxes before marking the PR ready            |
| **Screenshots** | Required for any UI change (before/after)               |
| **Deployment**  | Flag migrations, env vars, breaking changes, feature flags |

### Example

```markdown
## Description

Adds multi-skill filtering to the candidate search endpoint.
Users can now pass `?skills=react,typescript` to filter by skill.

Closes #142

## Type of Change

- [x] feat — new feature (non-breaking)
```

---

## PR Size Guidelines

Keep PRs **under 400 lines** (excluding lockfiles, generated files, and test fixtures).

| Size        | Lines     | Action                                           |
|-------------|-----------|--------------------------------------------------|
| 🟢 Small    | < 100     | Review quickly, merge freely                     |
| 🟡 Medium   | 100–300   | Normal review cadence                            |
| 🟠 Large    | 300–400   | Request a paired review; consider splitting      |
| 🔴 Too large| > 400     | **Must** be split into smaller PRs               |

> **Why?** Studies show that review effectiveness drops sharply beyond 400 lines.
> See: [SmartBear — Best Practices for Code Review](https://smartbear.com/learn/code-review/best-practices-for-code-review/)

---

## Draft PRs for WIP

Use **Draft PRs** for work-in-progress. This signals to reviewers that the PR is not yet ready.

```markdown
Status: WIP / Do Not Merge

Remaining work:
- [ ] Add error handling
- [ ] Write integration tests
- [ ] Update API docs
```

When ready, click **"Ready for review"** on GitHub.

---

## Requesting Reviewers

1. Add reviewers from the relevant team (see `CODEOWNERS`)
2. Use the **"Request review"** button on GitHub
3. For cross-team changes, tag the secondary team in a comment

**Best practice:** Request reviews from **2 people** minimum for production code.

---

## Addressing Feedback

| Situation                    | Action                                       |
|------------------------------|----------------------------------------------|
| Simple suggestion           | Apply the change and resolve conversation    |
| Disagreement                | Explain your reasoning, then defer to reviewer |
| Clarifying question         | Answer inline and resolve                    |
| Multiple rounds of changes  | Re-request review after pushing updates      |
| Outdated review comments    | Mark as resolved and explain the resolution  |

> **Never force-push after a review** unless explicitly requested. Rewriting history makes it
> impossible for reviewers to see what changed between rounds. Use additional commits instead.

---

## Merging Process

Jobilo uses **Squash merge** for feature branches and **Merge commit** for release branches.

| Scenario              | Strategy        | Why                                  |
|-----------------------|-----------------|--------------------------------------|
| Feature branch → main | Squash merge    | Keeps history linear and clean       |
| Develop → main        | Merge commit    | Preserves release context            |
| Hotfix → main         | Squash merge    | Fast integration                     |

### Merge checklist

- [ ] All CI checks pass
- [ ] At least 2 approving reviews
- [ ] No unresolved conversations
- [ ] Branch is up to date with `main`
- [ ] `CHANGELOG.md` entry added (if user-facing change)

---

## Post-Merge Cleanup

After your PR is merged:

1. **Delete the branch** on GitHub (button appears after merge)
2. **Close the related issue** with a comment referencing the merge commit
3. **Rebase dependent branches** against the updated `main`
4. **Deploy** if applicable (staging auto-deploys; production requires a release)

---

## Related Documents

- [Git Workflow Guide](./GIT_WORKFLOW.md)
- [Release Process](./RELEASE_PROCESS.md)
- [CONTRIBUTING.md](../../CONTRIBUTING.md)
- [CODEOWNERS](../../.github/CODEOWNERS)
