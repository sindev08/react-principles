# Plan: Publish Packages — Export Reusable Hooks/Utils as npm Package

## Context

Issue #8 requests exporting reusable hooks, utils, types, stores, components, and the API client factory from the `react-principles` project as a publishable npm package. Currently all code lives inside a `"private": true` Next.js app with no build pipeline for library output. The goal is to add a `tsup`-based build that produces ESM + CJS + `.d.ts` output with multiple entry points, without breaking the existing Next.js app.

**Package name:** `react-principles`
**Build tool:** `tsup`
**Structure:** 1 monolithic package, multiple entry points

---

## What Gets Exported

| Entry Point | Source | Exports |
|---|---|---|
| `hooks` | `src/shared/hooks/` | `useDebounce`, `useProgressBar`, `useMediaQuery`, `useAnimatedMount`, `useLocalStorage` |
| `utils` | `src/shared/utils/` | `cn`, `formatCurrency`, `formatDate`, `formatNumber`, Zod schemas + types |
| `types` | `src/shared/types/` | `ApiResponse<T>`, `ApiError`, `PaginatedResponse<T>`, `User`, `UserRole`, etc. |
| `stores` | `src/shared/stores/` | `useAppStore`, `useFilterStore`, `useHasActiveFilters`, `useSearchStore` |
| `components` | `src/shared/components/` | `EmptyState`, `ErrorBoundary`, `LoadingState` |
| `lib` | `src/lib/api-client.ts` | `createApiClient`, `ApiClient`, `ApiClientConfig`, `RequestOptions` |
| `.` (root) | `src/index.ts` | Re-exports everything from all entry points above |

**Excluded:** `NavigationProgress` (depends on `next/navigation` + `@/ui/ProgressBar` -- app-specific).

---

## Implementation Steps

### Step 1: Install tsup

```
pnpm add -D tsup
```

### Step 2: Fix 2 path-alias imports

tsup/esbuild doesn't resolve `@/*` aliases. Only 2 exportable files use them:

| File | Change |
|---|---|
| `src/shared/stores/useFilterStore.ts` | `@/shared/types/common` -> `../types/common` |
| `src/lib/api-client.ts` | `@/shared/types/api` -> `../shared/types/api` |

Both resolve to the same modules -- Next.js app is unaffected.

### Step 3: Create 7 barrel files

All use **relative imports only** (no `@/`):

- `src/shared/hooks/index.ts`
- `src/shared/utils/index.ts`
- `src/shared/types/index.ts`
- `src/shared/stores/index.ts`
- `src/shared/components/index.ts`
- `src/lib/exportable/index.ts` -- re-exports from `../api-client`
- `src/index.ts` -- umbrella re-export from all sub-barrels

### Step 4: Create `tsconfig.build.json`

Extends `tsconfig.json` but overrides:
- Removes `"noEmit": true`
- Removes `next` plugin
- Sets `"declaration": true`, `"declarationMap": true`
- `include` scoped to: `src/shared/**/*`, `src/lib/api-client.ts`, `src/lib/exportable/**/*`, `src/index.ts`

### Step 5: Create `tsup.config.ts`

```ts
entry: {
  index:      "src/index.ts",
  hooks:      "src/shared/hooks/index.ts",
  utils:      "src/shared/utils/index.ts",
  types:      "src/shared/types/index.ts",
  stores:     "src/shared/stores/index.ts",
  components: "src/shared/components/index.ts",
  lib:        "src/lib/exportable/index.ts",
}
format: ["esm", "cjs"]
dts: true
splitting: true
clean: true
external: ["react", "react-dom", "zod", "zustand", "clsx", "tailwind-merge"]
target: "es2017"
tsconfig: "tsconfig.build.json"
```

### Step 6: Update `package.json`

**Remove:** `"private": true`

**Add fields:**
```json
{
  "main": "dist/index.cjs",
  "module": "dist/index.js",
  "types": "dist/index.d.ts",
  "sideEffects": false,
  "files": ["dist"],
  "exports": {
    ".":            { "types": "./dist/index.d.ts",      "import": "./dist/index.js",      "require": "./dist/index.cjs" },
    "./hooks":      { "types": "./dist/hooks.d.ts",      "import": "./dist/hooks.js",      "require": "./dist/hooks.cjs" },
    "./utils":      { "types": "./dist/utils.d.ts",      "import": "./dist/utils.js",      "require": "./dist/utils.cjs" },
    "./types":      { "types": "./dist/types.d.ts",      "import": "./dist/types.js",      "require": "./dist/types.cjs" },
    "./stores":     { "types": "./dist/stores.d.ts",     "import": "./dist/stores.js",     "require": "./dist/stores.cjs" },
    "./components": { "types": "./dist/components.d.ts",  "import": "./dist/components.js",  "require": "./dist/components.cjs" },
    "./lib":        { "types": "./dist/lib.d.ts",        "import": "./dist/lib.js",        "require": "./dist/lib.cjs" }
  }
}
```

**Add scripts:**
```json
{
  "build:pkg": "tsup",
  "prepublishOnly": "pnpm build:pkg"
}
```

**Add peerDependencies:**
```json
{
  "react": ">=18",
  "react-dom": ">=18",
  "zod": ">=4",
  "zustand": ">=4",
  "clsx": ">=2",
  "tailwind-merge": ">=2"
}
```

**Add peerDependenciesMeta** (mark zod, zustand, clsx, tailwind-merge as optional).

**Move** `react`, `react-dom`, `zod`, `zustand`, `clsx`, `tailwind-merge` from `dependencies` to `devDependencies` (they become peer deps for the published package, dev deps for local development).

### Step 7: Add `dist/` to `.gitignore`

Verify it's already there (it should be from `build/**` or `dist/**` glob).

---

## Critical Files

| File | Action |
|---|---|
| `package.json` | Modify -- exports, peers, scripts, remove private |
| `tsup.config.ts` | Create |
| `tsconfig.build.json` | Create |
| `src/index.ts` | Create (barrel) |
| `src/shared/hooks/index.ts` | Create (barrel) |
| `src/shared/utils/index.ts` | Create (barrel) |
| `src/shared/types/index.ts` | Create (barrel) |
| `src/shared/stores/index.ts` | Create (barrel) |
| `src/shared/components/index.ts` | Create (barrel) |
| `src/lib/exportable/index.ts` | Create (barrel) |
| `src/shared/stores/useFilterStore.ts` | Modify -- fix `@/` import |
| `src/lib/api-client.ts` | Modify -- fix `@/` import |

---

## Verification

1. `pnpm build:pkg` -- tsup builds clean, produces `dist/` with 7 entry points x 3 files (.js, .cjs, .d.ts)
2. Grep `dist/` for `@/` -- no leaked path aliases
3. `pnpm build` -- Next.js app still builds
4. `pnpm test` -- existing tests pass
5. `pnpm lint && pnpm typecheck` -- no regressions
6. `pnpm pack` -- inspect tarball, confirm only `dist/` is included
