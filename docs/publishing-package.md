# Publishing Package

Guide for building and publishing the `react-principles` package to npm.

---

## Overview

This repo serves two purposes:

1. A Next.js reference app for examples and documentation
2. A publishable npm package built from shared/exportable modules

Publishing is **automated via Changesets + GitHub Actions** — no manual `npm publish` needed.

---

## What Gets Published

| Entry Point | Source |
|---|---|
| `react-principles` | `src/index.ts` |
| `react-principles/hooks` | `src/shared/hooks/index.ts` |
| `react-principles/utils` | `src/shared/utils/index.ts` |
| `react-principles/types` | `src/shared/types/index.ts` |
| `react-principles/stores` | `src/shared/stores/index.ts` |
| `react-principles/components` | `src/shared/components/index.ts` |
| `react-principles/lib` | `src/lib/exportable/index.ts` |

Only the built output inside `dist/` is included in the tarball. The Next.js app, `src/ui/`, and cookbook code are **not published**.

---

## Release Workflow

### How it works

Every push to `main` triggers the release workflow (`.github/workflows/release.yml`):

1. CI runs: lint + typecheck + test
2. Changesets bot checks for pending changesets
3. **If changesets exist** → bot opens a "Version PR" that bumps version + updates CHANGELOG
4. **Merge the Version PR** → bot automatically builds + publishes to npm

```
Make changes
    ↓
pnpm changeset   ← document what changed
    ↓
Open PR → merge to main
    ↓
GitHub Actions: Version PR opened automatically
    ↓
Merge Version PR
    ↓
GitHub Actions: build:pkg + npm publish (automatic)
```

**No manual `npm publish` needed.**

---

## Day-to-day: How to Release a Change

### Step 1 — Make your changes

Work on any branch as normal.

### Step 2 — Add a changeset

```bash
pnpm changeset
```

Follow the prompts:
- Select `react-principles`
- Choose bump type: `patch` (bug fix), `minor` (new feature), `major` (breaking change)
- Write a short description of what changed

This creates a file in `.changeset/`. Commit it with your changes.

### Step 3 — Open a PR and merge to main

CI will run lint + typecheck + test automatically.

### Step 4 — Merge the Version PR

After your PR merges, the Changesets bot opens a PR titled **"chore: release package"** that:
- Bumps the version in `package.json`
- Updates `CHANGELOG.md`

Merge that PR when ready to publish. The bot publishes to npm automatically.

---

## What Requires a Changeset?

| Change | Needs changeset? |
|--------|-----------------|
| `src/shared/` (hooks, utils, types, stores, components) | Yes |
| `src/lib/` (api client) | Yes |
| `src/index.ts` | Yes |
| `src/ui/` (UI components) | No — copy-paste only, not published via npm |
| `packages/cli/` (CLI component installer) | Yes — it's a separate published package |
| `src/app/` (Next.js pages, cookbook) | No |
| `src/features/` (feature modules) | No |
| `docs/` | No |
| CI/tooling changes | No |

**Rule of thumb:** if it changes what consumers get from `import ... from "react-principles"` or the `react-principles-cli` binary, it needs a changeset.

---

## CLI Package (`react-principles-cli`)

The CLI lives in `packages/cli/` and is published as a separate package: `react-principles-cli`.

### Adding a new UI component to the CLI

1. Add the component source to `src/ui/ComponentName.tsx`
2. Run `node scripts/sync-registry.mjs` to regenerate `packages/cli/src/registry/templates.ts`
3. Add an entry to `packages/cli/src/registry/index.ts`
4. Run `pnpm build:cli` to verify the build

### Releasing the CLI

Same Changesets workflow — just run `pnpm changeset` and select `react-principles-cli` when prompted.

```bash
pnpm changeset     # select react-principles-cli, choose bump, write description
```

Both packages can be released independently or together in the same changeset cycle.

---

## One-time Setup (GitHub Repository)

Before automated publishing works, set the `NPM_TOKEN` secret:

1. Generate a token at [npmjs.com](https://www.npmjs.com) → Access Tokens → Generate New Token → **Automation**
2. Go to GitHub repo → Settings → Secrets and variables → Actions
3. Add secret: `NPM_TOKEN` = the token from step 1

GitHub Actions uses `GITHUB_TOKEN` automatically — no setup needed for that.

---

## Build Locally (for verification)

```bash
pnpm build:pkg          # build the package
pnpm pack --dry-run     # preview what gets published
```

Verify `dist/` contains:
- `*.js` (CJS)
- `*.mjs` (ESM)
- `*.d.ts` (types)

---

## CHANGELOG

Changesets automatically maintains `CHANGELOG.md` at the repo root. Every release PR updates it with the changeset descriptions.

---

## Troubleshooting

### Version PR not appearing after merge

Check that a `.changeset/*.md` file (not the README) was included in the merged commit. If the changeset file is missing, no Version PR will be opened.

### npm publish fails in CI

Verify `NPM_TOKEN` is set in GitHub secrets and has **Automation** scope (bypasses 2FA).

### `pnpm build:pkg` fails locally

```bash
pnpm typecheck   # check for type errors first
pnpm build:pkg   # then build
```

### Wrong files in the tarball

```bash
pnpm pack --dry-run
```

Confirm `files` in `package.json` only targets `dist`.
