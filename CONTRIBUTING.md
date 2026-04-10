# Contributing to React Principles

## Reporting Issues

- Write all issues, PRs, and commit messages in **English**
- Create one issue per bug or feature — do not bundle unrelated changes
- Use the appropriate label: `bug`, `documentation`, `enhancement`

## Proposing a New Recipe

1. Open a [Recipe Proposal](.github/ISSUE_TEMPLATE/recipe_proposal.md) issue first
2. Wait for maintainer approval before opening a PR
3. A recipe must include: **principle → rules → pattern → implementation**

## Submitting a PR

1. Fork the repo
2. Create a branch: `feat/recipe-name` or `fix/issue-description`
3. Make your changes
4. Open a PR against `main`

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

---

## Docs Page Standard

Every UI component docs page lives at `src/app/docs/{component}/page.tsx`.
All pages must follow the same shell structure, with conditional sections based on what the component actually supports.

### Required Shell (every component)

1. **Breadcrumb** — `Components → {Category} → {ComponentName}`
2. **Header** — `h1` + description paragraph + feature tags
3. **CLI Install Block** — `<CliInstallBlock name="{component}" />`
4. **Numbered sections** — see ordering below
5. **TOC items** — kept in sync with sections present on the page

### Section Ordering

| # | Section | When to include |
|---|---|---|
| 01 | Theme Preview | Only if the component has `variant` or `size` props that render differently in light vs dark |
| 01 / 02 | Live Demo | Always |
| 02 / 03 | Code Snippet | Always |
| 03 / 04 | Copy-Paste (Single File) | Always |
| 04 / 05 | Props | Always |

> If Theme Preview is absent, Live Demo becomes section 01, and the rest shift accordingly.

### Heading Style

All section headings must use the numbered badge format — never a plain `<h2>`:

```tsx
<div className="flex items-center gap-3 mb-6">
  <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
    <span className="text-sm font-bold">01</span>
  </div>
  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Section Title</h2>
</div>
```

### Feature Tags

Add tags below the header description. Include only what applies:

| Tag | When to include |
|---|---|
| `Accessible` | Always — every component must have proper ARIA roles |
| `Dark Mode` | Always |
| `{N} Variants` | Only if the component has a `variant` prop |
| `{N} Sizes` | Only if the component has a `size` prop |
| `Animated` | If the component uses transitions or animations |
| `Portal` | If the component renders via `createPortal` |
| `Keyboard Nav` | If the component supports keyboard interaction |

### Live Demo Rules

| Condition | Treatment |
|---|---|
| Component has `variant` prop | Add a variant selector or render all variants inline |
| Component has `size` prop | Add a size selector (button group) |
| Interactive (needs a trigger) | One trigger button per variant/state |
| Static (renders directly) | Stack or grid all variants inline |

### Theme Preview

Show all variants side by side in forced light and dark panels — independent of the current app theme. Reference: `src/app/docs/badge/page.tsx` (`ThemedBadgeGrid`).

Only include this section if the component has meaningful visual differences across variants or themes.

### Props Table

Always present. Columns: `Prop` | `Type` | `Default` | `Description`

Cover all public props. For compound components (e.g. `Toast.Title`, `Toast.Footer`), document the root component props only unless sub-component props are non-trivial.

### Component Categories (for Breadcrumb)

| Category | Components |
|---|---|
| General | Avatar, Badge, Button, Card, Separator |
| Form | Checkbox, Combobox, Date Picker, Input, Radio Group, Select, Slider, Switch, Textarea |
| Overlay | Alert Dialog, Dialog, Drawer, Dropdown Menu, Popover, Toast, Tooltip |
| Navigation | Breadcrumb, Command, Pagination, Tabs |
| Feedback | Accordion, Alert, Progress, Skeleton |

### Reference Implementations

Use these pages as the canonical reference when building or upgrading a docs page:

- **Badge** — `src/app/docs/badge/page.tsx` — full structure with Theme Preview, size + variant selector, Props table
- **Button** — `src/app/docs/button/page.tsx` — full structure with variant + size selectors
- **Alert** — `src/app/docs/alert/page.tsx` — static multi-variant demo (no selector needed)

---

## Code Conventions

Follow all rules in `CLAUDE.md`. Key points:

- Use `cn()` for all dynamic class merging — no template literals for Tailwind
- Use `@/` path alias — no relative imports across feature boundaries
- No `any` types, no `!` non-null assertions
- `"use client"` goes on the component/store file, not on barrel files
- Do not install new dependencies without navigator approval

## What Gets Rejected

- Recipes that skip the principle/rules/pattern structure
- Code that uses `any` or breaks TypeScript strict mode
- Imports that violate the feature boundary rules
- Docs pages that use plain `<h2>` headings instead of the numbered badge format
- Docs pages missing breadcrumb, feature tags, or Props table
