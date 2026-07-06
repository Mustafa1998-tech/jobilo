# Git Workflow Guide

This document describes the Git workflow used by the Jobilo platform team.

---

## Git Flow vs GitHub Flow

Jobilo uses **GitHub Flow** with lightweight conventions.

| Aspect           | GitHub Flow                                      | Git Flow                                       |
|------------------|--------------------------------------------------|------------------------------------------------|
| Branches         | `main` + feature branches                        | `main`, `develop`, `release/*`, `hotfix/*`     |
| Complexity       | Low — ideal for CI/CD                            | High — suited for scheduled releases           |
| Deployment       | Continuous — merge = deploy                      | Release branches gate deployment               |
| When to use      | Day-to-day development                           | Hotfixes requiring urgent production fix       |

### Our rule of thumb

- **Default:** GitHub Flow — branch from `main`, PR into `main`
- **Hotfix:** Create `hotfix/<description>` from the production tag, PR into `main`
- **Release:** Create `release/<version>` from `main` (see [RELEASE_PROCESS.md](./RELEASE_PROCESS.md))

---

## Branch Naming Conventions

| Prefix       | Purpose              | Example                                |
|--------------|----------------------|----------------------------------------|
| `feat/`      | New feature          | `feat/candidate-filter`                |
| `fix/`       | Bug fix              | `fix/login-redirect-loop`              |
| `refactor/`  | Code restructuring   | `refactor/auth-middleware`             |
| `docs/`      | Documentation        | `docs/api-usage-examples`              |
| `test/`      | Test additions       | `test/notification-service`            |
| `chore/`     | Build/config/tooling  | `chore/upgrade-eslint`                 |
| `hotfix/`    | Urgent production fix | `hotfix/payment-timeout`               |
| `release/`   | Release preparation   | `release/v1.2.0`                       |

Use **kebab-case** and keep names descriptive but concise (under 50 characters).

---

## Fetch and Rebase Workflow

Always rebase your branch on `main` before opening a PR.

```bash
# Ensure you have the latest main
git checkout main
git fetch origin
git pull --rebase origin main

# Rebase your feature branch
git checkout feat/my-feature
git rebase main

# If conflicts arise:
git status                  # See conflicted files
# Resolve conflicts manually, then:
git add <resolved-files>
git rebase --continue

# Force-push is OK on personal feature branches (not shared)
git push --force-with-lease
```

> **Never** rebase shared branches (`main`, `develop`, `release/*`).

---

## Resolving Merge Conflicts

### Conflict types

| Type            | How to handle                                                   |
|-----------------|----------------------------------------------------------------|
| Simple conflict | Edit the file, remove conflict markers, `git add`, continue     |
| Deleted file    | `git rm <file>` if you want the deletion, or restore with ours |
| Binary file     | Pick one version: `git checkout --ours <file>` or `--theirs`    |

### Tips

```bash
# See conflicted files
git diff --name-only --diff-filter=U

# Use a merge tool
git mergetool

# Abort a rebase gone wrong
git rebase --abort
```

---

## Git Hooks Setup

Jobilo uses [Husky](https://typicode.github.io/husky/), [lint-staged](https://github.com/lint-staged/lint-staged), and [commitlint](https://commitlint.js.org/) to enforce code quality and commit conventions.

### Installation

```bash
# From the repo root
npm install          # or pnpm install
npx husky init       # creates .husky/ directory
```

### What we enforce

| Hook          | Tool           | What it does                                      |
|---------------|----------------|---------------------------------------------------|
| `pre-commit`  | lint-staged    | Lints and formats staged files                    |
| `commit-msg`  | commitlint     | Validates commit message follows Conventional Commits |
| `pre-push`    | typecheck + test | Ensures TypeScript compiles and tests pass       |

### Commit message format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Examples:

```
feat(api): add multi-skill filter to candidate search
fix(auth): resolve session expiry race condition
docs(readme): update setup instructions for Docker
chore(deps): upgrade express to v4.20
```

**Types:** `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `perf`, `ci`, `build`, `style`

---

## Tagging Releases

Tags follow [SemVer](https://semver.org/) and are created during the release process.

```bash
# Create an annotated tag
git tag -a v1.2.0 -m "Release v1.2.0 — Candidate skill matching"

# Push the tag
git push origin v1.2.0
```

See [RELEASE_PROCESS.md](./RELEASE_PROCESS.md) for the full release workflow.

---

## Working with Submodules

Jobilo uses Git submodules for shared protocol buffers.

```bash
# Clone with submodules
git clone --recurse-submodules git@github.com:jobilo/jobilo.git

# Update submodules to latest commit on tracked branch
git submodule update --remote

# Pull main repo + submodules in one command
git pull --recurse-submodules
```

---

## Git Tips and Tricks

```bash
# Show the commit that introduced a bug (bisect)
git bisect start
git bisect bad              # current commit is broken
git bisect good v1.0.0      # v1.0.0 was working
# Git will check out commits; run `npm test` and mark `git bisect good/bad`

# Find when a specific string was introduced
git log -S "deprecatedFunction" --source --all

# Pretty log
git log --oneline --graph --all --decorate

# Interactive rebase to squash commits
git rebase -i HEAD~5

# Show changes in a specific commit
git show <commit-hash>

# Undo the last commit but keep changes staged
git reset --soft HEAD~1

# View the diff of only staged files
git diff --staged

# Auto-correct mistyped commands
git config --global help.autocorrect 10
```

---

## Related Documents

- [Pull Request Guide](./PULL_REQUEST_GUIDE.md)
- [Release Process](./RELEASE_PROCESS.md)
- [CONTRIBUTING.md](../../CONTRIBUTING.md)
