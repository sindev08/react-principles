Run the following git commands in parallel to understand the current state:
- `git status` — see all untracked and modified files
- `git diff` — see unstaged changes
- `git diff --staged` — see staged changes
- `git log --oneline -5` — see the last 5 commits to reference the project's commit style

Then create a commit following these rules:

## Format: Conventional Commits

```
<type>(<scope>): <subject>

[optional body]
```

### Types
| Type | When to use |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Code change with no behavior change |
| `style` | Styling/CSS/code formatting changes |
| `chore` | Deps, config, tooling updates |
| `docs` | Documentation changes |
| `test` | Adding or updating tests |
| `perf` | Performance improvement |

### Scope (optional, use when relevant)
Use the app or package name: `nextjs`, `vite`, `shared`, `cookbook`, `docs`

### Subject rules
- All lowercase
- Imperative mood: "add", "remove", "update" — not "added", "removed", "updated"
- No period at the end
- Max 72 characters

### Body (optional)
Add when you need to explain **why**, not what. Wrap at 72 characters per line.

## Workflow
1. Analyze all changes from the git output above
2. Determine the most appropriate type and scope
3. Write a clear and concise subject
4. Add a body if the change needs extra context
5. Stage relevant files specifically (never use `git add -A`)
6. Create the commit using a HEREDOC
7. Run `git status` after the commit to confirm

Do not commit: `.env`, `*.local`, credential files, or large binaries.
