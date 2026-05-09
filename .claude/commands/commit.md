Run the following git commands in parallel to understand the current state:
- `git status` — see all untracked and modified files
- `git diff` — see unstaged changes
- `git diff --staged` — see staged changes
- `git log --oneline -5` — see the last 5 commits to reference the project's commit style

Then create a commit following these rules:

## Format: Conventional Commits

```
<type>(<scope>): <subject>

[optional body — wrap at 72 characters]
```

> Commit messages are enforced by commitlint via Husky `commit-msg` hook.
> Invalid format will be rejected locally.

### Types

| Type | When to use | Triggers CLI version bump? |
|---|---|---|
| `feat` | New feature or capability | **Yes — minor bump** |
| `fix` | Bug fix | **Yes — patch bump** |
| `docs` | Documentation only | No |
| `style` | CSS, classnames, formatting — no logic change | No |
| `refactor` | Code restructure without behavior change | No |
| `test` | Adding or updating tests | No |
| `chore` | Deps, config, tooling, scripts | No |
| `perf` | Performance improvement | No |
| `revert` | Reverts a previous commit | No |

### Scope (optional, use when relevant)

| Scope | When to use |
|---|---|
| `cli` | Changes in `packages/cli/` |
| `ui` | Changes in `src/ui/` |
| `landing` | Changes in `src/features/landing/` |
| `cookbook` | Changes in `src/features/cookbook/` |
| `docs` | Changes in `src/app/docs/` or `src/features/docs/` |
| `configurator` | Changes in `src/features/configurator/` |
| `shared` | Changes in `src/shared/` |
| `ci` | Changes in `.github/workflows/` |

### Subject rules

- All lowercase
- Imperative mood: `add`, `fix`, `update` — not `added`, `fixed`, `updated`
- No period at the end
- Max 72 characters

### Body (optional)

Add when you need to explain **why**, not what. Wrap at 72 characters per line.

### CLI versioning impact

`feat:` and `fix:` commits touching `packages/cli/` trigger an automatic
version bump via release-please when merged to `main`. Use deliberately:

- `feat(cli): add --verbose flag` → CLI minor bump ✅
- `fix(cli): resolve path alias on Windows` → CLI patch bump ✅
- `style(ui): update Button hover classnames` → no bump ✅
- `chore: upgrade dependencies` → no bump ✅

## Workflow

1. Analyze all changes from the git output above
2. Determine the most appropriate type and scope
3. Write a clear and concise subject
4. Add a body if the change needs extra context
5. Stage relevant files specifically (never use `git add -A`)
6. Create the commit using a HEREDOC
7. Run `git status` after the commit to confirm

Do not commit: `.env`, `*.local`, credential files, or large binaries.
