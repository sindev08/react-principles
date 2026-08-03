# Publishing Package

Guide for versioning and publishing the `react-principles` CLI to npm.

---

## What Gets Published

Only **one** package is published to npm: **`react-principles`** — the CLI component installer that lives in `packages/cli/`.

- npm: https://www.npmjs.com/package/react-principles
- Binary: `npx react-principles add <component>`, `npx react-principles init`, `npx react-principles create`

The repository root (`package.json`) is **`private: true`** — the Next.js app, cookbook, and `src/ui/` are **not** published as a library. There is no `import { Button } from "react-principles"`; UI components are copy-paste, delivered by the CLI.

---

## Release Mechanism: release-please

Versioning and releases are automated with **[release-please](https://github.com/googleapis/release-please)**, not Changesets.

Key files:

| File | Role |
|---|---|
| `.github/workflows/release.yml` | Runs `release-please-action` on every push to `main` |
| `release-please-config.json` | Declares the `packages/cli` package (`package-name: react-principles`, `tag-separator: @`) |
| `.release-please-manifest.json` | Tracks the current released version (`{ "packages/cli": "x.y.z" }`) |
| `packages/cli/CHANGELOG.md` | Auto-maintained changelog |
| `.github/workflows/publish.yml` | Publishes to npm when a GitHub Release is published |

### How a release flows

```
Conventional commit lands on main (feat(cli): / fix(cli): …)
    ↓
release.yml → release-please opens a "release PR"
    (bumps packages/cli/package.json + manifest + CHANGELOG)
    ↓
Merge the release PR
    ↓
release-please creates a GitHub Release + tag (react-principles@x.y.z)
    ↓
publish.yml (on release: published) → pnpm --filter ./packages/cli publish
```

Version bump is derived from Conventional Commit types touching `packages/cli/`:

- `feat(cli): …` → **minor**
- `fix(cli): …` → **patch**
- `feat(cli)!:` or `BREAKING CHANGE:` → **major**
- `chore` / `refactor` / `docs` / `test` → **no bump**

---

## ⚠️ Gotcha: `release:` squash titles block release-please

`development` → `main` promotions are squash-merged with a `release: …` title. **`release` is not a Conventional Commit type**, so release-please ignores those commits and never opens a release PR — even though `feat(cli):` work is present in the squashed content. This is why the CLI can sit at the same version while features accumulate.

To actually cut a release, make sure one of these reaches `main`:

1. A real Conventional Commit whose **type** is `feat(cli):` / `fix(cli):` (i.e. don't let the dev→main squash re-title it to `release:`), **or**
2. A commit with a `Release-As: x.y.z` footer (forces release-please to that version), **or**
3. A **manual bump** (see below) when the automated path is inconvenient.

---

## Manual Release (fallback)

Use this when the squash flow has hidden the `feat(cli):` commits from release-please.

1. Bump the version in two places so they stay in sync:
   - `packages/cli/package.json` → `"version": "x.y.z"`
   - `.release-please-manifest.json` → `"packages/cli": "x.y.z"`
2. Add an `x.y.z` section to `packages/cli/CHANGELOG.md`.
3. Merge to `main`.
4. **Tag the release commit** so release-please stays in sync: `git tag react-principles@x.y.z <release commit>` then `git push origin react-principles@x.y.z`. Release-please derives the released version from git tags — if the tag is missing it assumes the last release was an older version and will re-propose that older version (e.g. re-release 1.0.0 while the package is at 1.1.0). This bit us: the 1.1.0 manual release shipped without a tag, so release-please kept proposing a 1.0.0 downgrade PR until the missing tag was added.
5. Publish one of two ways:
   - Trigger **`publish.yml`** via **workflow_dispatch** (publishes the version currently in `packages/cli/package.json`), or
   - Create a GitHub Release tagged `react-principles@x.y.z` (fires `publish.yml` on `release: published`).

---

## Adding a UI Component to the CLI

The CLI's installable components are generated from the site's UI source.

1. Add the component source at `src/ui/ComponentName.tsx`.
2. Add its metadata entry to `src/lib/ui-registry.json` (name, dependencies, registry deps).
3. Regenerate the CLI + site artifacts:
   ```bash
   node scripts/sync-registry.mjs
   ```
   This writes `packages/cli/src/registry/templates.ts` (component source),
   `packages/cli/src/registry/registry-data.json` (metadata), and
   `src/lib/ui-templates.generated.ts` (site source for the MCP server).
4. Verify the build:
   ```bash
   pnpm build:cli   # runs sync-registry (prebuild) + tsup
   ```
5. Commit as `feat(cli): add <component> component` so release-please bumps a minor.

---

## One-time Setup (GitHub Repository)

Publishing needs two secrets configured in **Settings → Secrets and variables → Actions**:

- `NPM_TOKEN` — an npm **Automation** token (bypasses 2FA), used by `publish.yml`.
- `RELEASE_TOKEN` — a token for `release-please-action` to open release PRs and create releases.

---

## Build Locally (for verification)

```bash
pnpm build:cli          # sync registry + tsup build
cd packages/cli && npm pack --dry-run   # preview the tarball contents
```

Confirm `dist/` contains the built CLI (`*.js`, `*.d.ts`) and the `files` field in `packages/cli/package.json` targets only what should ship.

---

## Troubleshooting

### Release PR never appears after merging to main
The merged commits are `release:`-titled (or otherwise non-conventional), so release-please found nothing to release. Land a `feat(cli):` / `fix(cli):` commit or use a `Release-As:` footer — see the Gotcha above.

### npm publish fails in CI
Verify `NPM_TOKEN` is set with **Automation** scope. `publish.yml` runs `pnpm --filter ./packages/cli publish` with `NODE_AUTH_TOKEN`.

### Registry out of sync after editing a component
Re-run `node scripts/sync-registry.mjs` (or `pnpm build:cli`, which runs it via the `prebuild` hook). CI uses `--frozen-lockfile`, so keep `pnpm-lock.yaml` in sync too.
