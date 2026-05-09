Run the following git commands in parallel to understand the current state:
- `git status` — check for uncommitted changes (commit first if needed)
- `git log --oneline development..HEAD` — see all commits on this branch vs development
- `git diff development...HEAD --stat` — see which files changed vs development
- `git branch --show-current` — confirm current branch name

Then create a pull request following these rules:

## Target branch

Always PR to `development` — never directly to `main`.

```
feature branch → development → main
```

`main` only receives releases via the release-please workflow.

## PR title

Follow the same Conventional Commits format as commit messages:

```
<type>(<scope>): <subject>
```

- Max 70 characters
- Lowercase subject
- Same type/scope rules as `/commit`

## PR body format

```markdown
## Summary

- <bullet point summary of what changed and why>
- <keep it concise — 1 to 3 bullets>

## Related

<Link issues using "Closes #N" or "Relates to #N">
- Closes #N — if this PR fully resolves the issue
- Relates to #N — if this PR is part of a larger issue
```

## Workflow

1. Check for uncommitted changes — if any exist, stop and ask user to commit first
2. Confirm the branch is NOT `development` or `main`
3. Check if branch is already pushed — if not, push with `git push -u origin <branch>`
4. Analyze all commits on this branch vs `development`
5. Draft the PR title and body based on the changes
6. Create the PR using `gh pr create --base development`
7. Return the PR URL

## Rules

- Never PR to `main` directly
- Never include co-author attribution or AI attribution in the PR body
- Do not push if there are uncommitted changes — resolve first
- Stage and scope should match the actual changes, not be generic
- If the branch touches `packages/cli/` with `feat:` or `fix:` commits, note in the PR body that a CLI version bump will be triggered via release-please
