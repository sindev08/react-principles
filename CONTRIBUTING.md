# Contributing to react-principles

## Proposing a New Recipe

1. Open a [Recipe Proposal](.github/ISSUE_TEMPLATE/recipe_proposal.md) issue first
2. Wait for maintainer approval before opening a PR
3. A recipe must include: **principle → rules → pattern → implementation**

## Submitting a PR

1. Fork the repo
2. Create a branch: `feat/recipe-name` or `fix/issue-description`
3. Make your changes
4. Open a PR against `main`

## Code Conventions

- **TypeScript strict** — no `any`, use `unknown` and narrow
- **Component anatomy**: imports → types → constants → component → export
- **No direct imports between features** — use `shared/` for cross-cutting code
- **Tailwind only** — no CSS modules, no inline styles
- **No `console.log`** in production code

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(scope): add new thing
fix(scope): fix broken thing
docs(scope): update documentation
refactor(scope): restructure without behavior change
test(scope): add or update tests
```

## Review Process

- All PRs require 1 approval from a maintainer
- CI must pass (lint + type-check + build)
- Recipe PRs are reviewed for completeness and accuracy

## What Gets Rejected

- Recipes that skip the principle/rules/pattern structure
- Code that uses `any` or breaks TypeScript strict mode
- Imports that violate the feature boundary rules
- Changes to `src/ui/` directly (extend via wrapper instead)
