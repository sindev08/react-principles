# Publishing Package

Guide for building and publishing the reusable `react-principles` package to npm from this repository.

## Goal

This repo serves two purposes:

1. A Next.js app for examples and documentation
2. A publishable npm package built from the shared/exportable modules

The package output is generated into `dist/` using `tsup`, while the app continues to use the source files directly from `src/`.

## What Gets Published

The published package exposes these entry points:

| Entry Point | Source |
|---|---|
| `react-principles` | `src/index.ts` |
| `react-principles/hooks` | `src/shared/hooks/index.ts` |
| `react-principles/utils` | `src/shared/utils/index.ts` |
| `react-principles/types` | `src/shared/types/index.ts` |
| `react-principles/stores` | `src/shared/stores/index.ts` |
| `react-principles/components` | `src/shared/components/index.ts` |
| `react-principles/lib` | `src/lib/exportable/index.ts` |

Only the built output inside `dist/` is included in the npm tarball.

## Current Publish Setup

The package is configured through:

- `package.json`
- `tsup.config.ts`
- `tsconfig.build.json`

Important details:

- `pnpm build:pkg` builds the npm package
- `prepublishOnly` runs `pnpm build:pkg` automatically before publish
- ESM output uses `.mjs`
- CommonJS output uses `.js`
- Type declarations are emitted as `.d.ts`
- External peer dependencies are not bundled

## Publish Flow

### 1. Install dependencies

```bash
pnpm install
```

### 2. Make sure you are logged in to npm

```bash
npm whoami
```

If that fails, log in first:

```bash
npm login
```

### 3. Update the package version

Check the current version in `package.json`, then bump it as needed:

```bash
npm version patch
```

Other common options:

```bash
npm version minor
npm version major
```

### 4. Build the package

```bash
pnpm build:pkg
```

This generates the publishable files in `dist/`.

### 5. Verify the tarball contents

```bash
pnpm pack --dry-run
```

Confirm that the package includes:

- `dist/`
- `package.json`
- `README.md`
- `LICENSE`

### 6. Run quality checks

Recommended checks before publish:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Minimum safe path:

```bash
pnpm build:pkg
pnpm pack --dry-run
```

### 7. Publish to npm

For a public package:

```bash
npm publish --access public
```

For later releases, the same command is usually enough:

```bash
npm publish
```

## Release Checklist

Before publishing, confirm:

- package name is correct in `package.json`
- version has been bumped
- `pnpm build:pkg` succeeds
- `pnpm pack --dry-run` looks correct
- README reflects the package usage
- no accidental breaking changes are being released
- you are logged in to the correct npm account

## Troubleshooting

### `npm whoami` returns auth error

You are not logged in on this machine yet.

```bash
npm login
```

### `npm publish` fails because the version already exists

Every published npm version is immutable. Bump the version and publish again.

```bash
npm version patch
npm publish
```

### Build succeeds but imports fail for consumers

Check the `exports` field in `package.json` and verify the generated files in `dist/` match the configured paths.

Current convention in this repo:

- `import` points to `*.mjs`
- `require` points to `*.js`
- `types` points to `*.d.ts`

### Wrong files are included in the package

Run:

```bash
pnpm pack --dry-run
```

Then confirm the `files` field in `package.json` still only targets `dist`.

## Quick Command Reference

```bash
pnpm install
npm whoami
npm version patch
pnpm build:pkg
pnpm pack --dry-run
npm publish --access public
```
