# React Native / Expo Expansion Plan

> Status: **Proposal / for discussion** — not yet approved for implementation.
> Scope decided so far: **Cookbook + UI Kit native** (Tier 2). Configurator (Tier 3) is out of scope for now.

## 1. Context

React Principles is a pnpm monorepo wrapping three products that share data sources:

- **Cookbook** — curated React principles → web pages, `llms.txt`, MCP tools, skills.
- **UI Kit** — copy-paste components shipped via `npx react-principles add`.
- **Configurator** — browser wizard that generates a web starter.

The entire codebase is **web/DOM-first**: Tailwind v4 + `className` + `cn()`, components extend
HTML element attributes, output targets Next.js / Vite. A repo-wide search for `react-native` /
`expo` returns **zero** matches. Supporting Expo/React Native is therefore an **additive new axis**,
not a refactor of existing behaviour.

## 2. Tiers of ambition

| Tier | Scope | Cost | Depends on |
|------|-------|------|------------|
| 1 | Cookbook only — Expo implementation tabs + platform-agnostic principle recipes | Low | — |
| **2** | **Tier 1 + UI Kit native (NativeWind rewrite, platform axis in registry/CLI)** | **High** | Tier 1 |
| 3 | Tier 2 + Configurator generates an Expo Router starter | Highest | Tier 2 |

This document covers **Tier 2**.

## 3. Key facts about the current pipeline

### 3.1 Cookbook data → many surfaces

Recipes live in `src/features/cookbook/data/recipes/*.ts` as `RecipeDetail` objects. The **same data**
is serialised to Markdown (`src/lib/recipe-md.ts`) and exposed through the MCP server
(`src/app/api/mcp/route.ts`) and `llms.txt`. The framework axis is explicit and web-only:

```ts
// src/features/cookbook/data/types.ts
implementation?: { nextjs?: ImplTab; vite?: ImplTab };
```

### 3.2 UI Kit: two sources of truth → three generated artifacts

- Component **source**: `src/ui/*.tsx` (+ `src/shared/utils/cn.ts`, `src/shared/hooks/useAnimatedMount.ts`)
- Component **metadata**: `src/lib/ui-registry.json`

`scripts/sync-registry.mjs` (wired as the CLI `prebuild`) merges them into:

1. `packages/cli/src/registry/templates.ts` — component source for the CLI
2. `packages/cli/src/registry/registry-data.json` — metadata copy for the CLI
3. `src/lib/ui-templates.generated.ts` — component source for the MCP server / web

The sync script's `transform()` rewrites internal imports (`@/shared/utils/cn` → `@/lib/utils`) so the
shipped file differs from the repo copy.

### 3.3 CLI `add` runtime

`packages/cli/src/commands/add.ts`:

1. `readConfig()` reads the user's `components.json` (`framework`, `rsc`, `componentsDir`, `hooksDir`,
   `libDir`, `aliases`).
2. `resolve(name)` does a DFS over `internalDeps` returning deps-first.
3. Per entry: `resolveOutputPath()` maps `target` → directory, `getTemplate()` fetches source,
   `writeFile()` never overwrites existing files.
4. Collect unique `npmDeps` → `installPackages()`.

`target: "components" | "hooks" | "lib"` is the **only** classification axis today, and it concerns
**file location, not platform**.

### 3.4 Why UI Kit is web-locked (reference: `src/ui/Button.tsx`)

Every `src/ui/` component follows the same DOM-bound pattern:

- `extends ButtonHTMLAttributes<HTMLButtonElement>` — DOM contract.
- Styling as Tailwind `className` strings via `cn()`; variants as `Record<Variant, string>`.
- Renders DOM elements (`<button>`, `<svg>`).
- `focus-visible:` / `hover:` / `disabled:` pseudo-states have no React Native equivalent.

**Conclusion:** UI Kit native is a **rewrite**, not a port. ~90 components are affected.

## 4. Tier 2 implementation plan — the `platform` axis

Adding native support touches **7 points** across the pipeline.

### 4.1 Metadata — `ui-registry.json` + `RegistryEntry`

Add a `platform` field:

```ts
platform: "web" | "native" | "universal";
```

- `utils` (`cn`) → `universal` (clsx + tailwind-merge works under NativeWind).
- Existing DOM components → `web`.
- New NativeWind components → `native`.

Files: `src/lib/ui-registry.json`, `packages/cli/src/registry/index.ts` (`RegistryEntry`).

### 4.2 Source layout convention — `src/ui/`

**Decision needed.** `sync-registry.mjs` currently does a flat `readdirSync(UI_DIR)` and uses
`basename(f, ".tsx")` as the template name. `Button.tsx` and a native `Button.native.tsx` would
collide on the same `templateKey`.

Options:
- **A** — co-located: `src/ui/Button.native.tsx`, namespaced key `button-native`.
- **B** — separate dir: `src/ui-native/Button.tsx`.

Recommended: **A** (co-located), with `templateKey` namespacing enforced in the sync script.

### 4.3 `transform()` — native alias rewrite

`sync-registry.mjs` `transform()` must branch per platform: NativeWind uses different aliases and
must preserve `nativewind` / `react-native` imports.

### 4.4 `components.json` — `fs.ts` Config

`framework` today is `next | vite | remix | other`. Add a `platform` (or an `expo` value) plus a
`nativeComponentsDir`. `rsc: true` is irrelevant for Expo.

Files: `packages/cli/src/utils/fs.ts`.

### 4.5 CLI `add` — platform-aware resolution & filtering

Every `filter((e) => e.target === "components")` must become platform-aware so `add --all` in an Expo
project never pulls `web` components. Native deps map differs entirely (`nativewind`, `react-native-*`).

Files: `packages/cli/src/commands/add.ts`, `packages/cli/src/index.ts` (the `list` command).

### 4.6 `css.ts` — native setup path

`setupGlobalsCss` injects `@import "tailwindcss"` into a globals file. Expo uses Metro/Babel +
`nativewind/preset`, not a globals CSS file. A separate native setup path is required.

Files: `packages/cli/src/utils/css.ts`, `packages/cli/src/commands/init.ts`.

### 4.7 MCP + `llms.txt` consumers

`src/app/api/mcp/route.ts` (`list_components` / `get_component`) and `llms.txt` must surface the
platform, otherwise AI tools will suggest `<button className>` for Expo projects.

## 5. Cookbook side (Tier 1, prerequisite)

- Extend `RecipeDetail.implementation` with an optional `expo?: ImplTab`
  (`src/features/cookbook/data/types.ts`).
- Tag platform-agnostic recipes (state taxonomy, custom hooks, server/client state, TypeScript,
  folder structure, useEffect) as reusable for React Native.
- `recipe-md.ts` and the MCP/`llms.txt` serialisers pick up the new tab automatically once the type
  and renderers are updated.

## 6. Recommended sequencing

1. **Cookbook Tier 1** — add `expo?` tab to `RecipeDetail`, render it, tag agnostic recipes. Low risk,
   validates demand.
2. **Metadata `platform` field** — the cheapest structural change; unblocks everything downstream.
3. **Namespace `templateKey`** in `sync-registry.mjs` (choke point feeding CLI + MCP).
4. **One pilot native component** (`Button.native.tsx` with NativeWind) driven end-to-end through the
   full pipeline into a real Expo project via `add`.
5. **Replicate** to remaining components only after the pilot locks every contract.

The riskiest, earliest decisions are **§4.2 (source layout convention)** and **§4.1 (`platform`
metadata)** — because the flat sync script + global `templateKey` is the choke point touching CLI and
MCP simultaneously. Get the convention right via one correct vertical slice before starting the volume
rewrite.

## 7. Open decisions

- Source layout: co-located `*.native.tsx` (A) vs separate `src/ui-native/` (B)?
- Styling engine for native: NativeWind (Tailwind-compatible, reuses `cn()`) vs `StyleSheet` /
  another system?
- `components.json`: extend `framework` with `expo`, or add an orthogonal `platform` field?
- Should the CLI auto-detect Expo (via `expo` in `package.json`) the way it detects Next/Vite/Remix?
- Configurator (Tier 3): defer entirely until Tier 2 ships, or design its schema hooks now to avoid
  rework?
