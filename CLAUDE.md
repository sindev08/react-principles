# React Principles

## Project Overview
A living cookbook and UI kit for modern React development. Provides production-grade pattern examples (forms, data fetching, state management) alongside a reusable component library distributed via a CLI (`npx react-principles add`). Published at reactprinciples.dev.

## Stack
- **Runtime:** Node.js >=18
- **Language:** TypeScript ^5.6.0
- **Framework:** Next.js ^16.1.6 (App Router)
- **Package manager:** pnpm (workspace — root + `packages/cli`)
- **Styling:** Tailwind CSS v4 via `@tailwindcss/postcss`
- **State management:** Zustand ^5.0.0
- **Data fetching:** TanStack Query ^5.59.0
- **Forms:** React Hook Form ^7.53.0 + Zod ^4.3.6 (`@hookform/resolvers`)
- **Tables:** TanStack Table ^8.20.0
- **HTTP client:** Custom fetch-based `createApiClient` (src/lib/api-client.ts). Axios is listed but prefer the custom client.
- **Testing:** Vitest ^2.1.8 + Testing Library (jsdom)
- **Linting:** ESLint 9 flat config (next/core-web-vitals + typescript)
- **Build (CLI):** tsup ^8.5.1
- **Icons:** Material Symbols (@material-symbols/font-400)
- **3D:** Three.js ^0.183.2 (landing page)
- **Git hooks:** Husky ^9.1.7
- **CI:** GitHub Actions — lint, typecheck, test, build on PRs to main/development

## Project Structure
```
src/
  app/                    # Next.js App Router pages
    (examples)/           # Route group for example pages
    cookbook/              # Cookbook section pages
    docs/                 # Documentation pages
    nextjs/               # Next.js-specific examples
    vitejs/               # Vite-specific examples
  features/               # Feature modules (vertical slices)
    cookbook/              # Cookbook feature (components, data, stores)
    docs/                 # Docs feature (components)
    examples/             # Examples feature (components, hooks)
    landing/              # Landing page feature (components)
  shared/                 # Cross-feature shared code
    components/           # ErrorBoundary, EmptyState, LoadingState, etc.
    hooks/                # useDebounce, useLocalStorage, useMediaQuery, etc.
    stores/               # useAppStore (theme, sidebar), useFilterStore, useSearchStore
    types/                # api.ts, common.ts, user.ts
    utils/                # cn(), formatters, validators
  ui/                     # Reusable UI primitives (Button, Dialog, Card, etc.)
  lib/                    # API client, endpoints, query client, query keys, mock data
    exportable/           # Components exported by the CLI
  test/                   # Test setup (vitest)
packages/
  cli/                    # npx react-principles CLI (commander + prompts)
```

## Architecture Decisions
- **Feature-sliced architecture:** Each feature owns its own components, hooks, stores, and data. Shared code goes in `src/shared/`, UI primitives in `src/ui/`.
- **App Router only:** All routing uses Next.js App Router with route groups `(examples)`.
- **Barrel exports:** Features use `index.ts` barrel files. Shared modules use per-directory `index.ts`.
- **"use client" directive:** Applied at the store/component level, not at barrel level. Zustand stores require it.
- **cn() utility:** All dynamic class merging uses `cn()` from `@/shared/utils/cn` (clsx + tailwind-merge). Do not use `clsx` or template literals directly for Tailwind classes.
- **Path alias:** `@/` maps to `src/`. Used everywhere — do not use relative paths outside the same directory.
- **UI components are self-contained:** Each file in `src/ui/` is a single component with variants defined via Record types (not cva/class-variance-authority).
- **Variant pattern:** UI components define variant/size as `Record<VariantType, string>` constants (ref: src/ui/Button.tsx `VARIANT_CLASSES`, `SIZE_CLASSES`).
- **Type-only imports enforced:** ESLint rule `@typescript-eslint/consistent-type-imports` requires `import type` for type-only imports with `inline-type-imports` fix style.
- **No `any`:** `@typescript-eslint/no-explicit-any` is set to `error`.
- **No `!` assertions:** `@typescript-eslint/no-non-null-assertion` is `error`.
- **Promise safety:** `no-floating-promises` and `no-misused-promises` are enforced on TS files.
- **Dev port:** Next.js dev server runs on port 3001.

## Coding Patterns
- **Component props:** Extend native HTML element attributes, add custom props (ref: src/ui/Button.tsx `ButtonProps extends ButtonHTMLAttributes`)
- **Store pattern:** Zustand `create<State>()` with actions colocated in the same store (ref: src/shared/stores/useAppStore.ts)
- **API layer:** `createApiClient` factory → typed `get/post/put/patch/delete` methods. Endpoints defined in `src/lib/endpoints.ts`. Query keys in `src/lib/query-keys.ts` (ref: src/lib/api-client.ts)
- **Test colocation:** Tests live next to source files as `*.test.ts` (ref: src/shared/hooks/useDebounce.test.ts)
- **CSS pattern:** Tailwind v4 utility classes, dark mode via `dark:` variant, CSS custom properties via `--` syntax in Tailwind (ref: src/app/layout.tsx `bg-(--background)`)

## Performance Rules
- **React Strict Mode:** Enabled in next.config.mjs.
- **No console.log:** ESLint warns on `console.log`; only `console.warn` and `console.error` allowed.
- **Optional chaining enforced:** `@typescript-eslint/prefer-optional-chain` is `error`.

## Build & Environment
- **Scripts:** `pnpm dev` (port 3001), `pnpm build`, `pnpm lint`, `pnpm typecheck`, `pnpm test`
- **CLI build:** `pnpm build:cli` or `pnpm --filter react-principles build` (runs `sync-registry.mjs` prebuild)
- **CI pipeline (GitHub Actions):** checkout → pnpm install --frozen-lockfile → lint → typecheck → test → build
- **CI triggers:** PRs to `main` and `development` branches
- **Environment variables:** `NEXT_PUBLIC_SITE_URL` (defaults to localhost:3000)
- **Gotcha:** Root `package.json` has all deps as `devDependencies` (not `dependencies`). This is intentional — the site is not a library. The CLI package has its own separate deps.
- **Gotcha:** `pnpm-lock.yaml` must stay in sync. CI uses `--frozen-lockfile`.

## Known Tech Debt
- No TODO/FIXME comments found in codebase.
- Axios is listed as a dependency but the codebase uses a custom fetch-based client. [NAVIGATOR: clarify if axios should be removed]
- All root dependencies are `devDependencies` including runtime ones (react, next, zustand, etc.). Works for deployment but may confuse contributors.

## Working Agreement

### For Planning Agent (Sonnet high)
- Receive short intent from navigator
- Elaborate into full task spec before any code is written
- Task spec must include: objective, acceptance criteria, files to touch, files to NOT touch, DO NOTs
- If intent is ambiguous, ask navigator for clarification first
- Do not proceed to execution phase

### For Executor Agent (Sonnet low)
- Read CLAUDE.md + full task spec before writing any code
- Follow coding patterns strictly
- Do not refactor outside task scope
- Do not touch files not listed in task spec
- Do not install new dependencies without navigator approval
- Do not add co-author attribution in any commit or file
- If blocked, stop and report — do not assume or improvise

## DO NOT
- Do not use `className={`...`}` template literals for Tailwind — use `cn()` for dynamic classes
- Do not use relative imports across feature boundaries — always use `@/` alias
- Do not create new top-level directories in `src/` without navigator approval
- Do not add `any` types — the linter will reject them
- Do not use `@ts-ignore` — use `@ts-expect-error` with a description if absolutely necessary
- Do not use `require()` — ESM imports only
- Do not put `"use client"` on barrel files — put it on the actual component/store
- Do not install new dependencies without explicit approval
- Do not skip Husky hooks with `--no-verify`
- Do not commit `.env` or `.env.local` files
