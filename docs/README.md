# React Principles — Pattern Documentation

Pattern and convention documentation used in this monorepo. Each doc explains **WHY** (principle), **WHAT** (rules & pattern), and **HOW** (implementation) — so that architectural decisions can be understood and reproduced by anyone on the team.

## Tech Stack

| Layer | Library | Version |
|-------|---------|---------|
| Monorepo | pnpm workspaces | - |
| Apps | Next.js 15 (App Router), Vite (React 18) | - |
| Server State | TanStack Query | v5 |
| Client State | Zustand | v5 |
| Tables | TanStack Table | v8 |
| Forms | React Hook Form + Zod | v7 + v3 |
| Styling | Tailwind CSS + shadcn/ui | v3 |
| TypeScript | strict + noUncheckedIndexedAccess | v5 |

## Pattern Docs

| # | Doc | Description |
|---|-----|-------------|
| 1 | [Component Patterns](./component-patterns.md) | Component anatomy, composition, compound components, when to split. |
| 2 | [Hooks](./hooks.md) | Custom hook conventions, naming, extraction rules, shared hooks. |
| 3 | [TypeScript](./typescript.md) | Strict mode patterns, interface vs type, discriminated unions, generics. |
| 4 | [React Query](./react-query.md) | Query key factory, cache config, mutations, optimistic updates, invalidation. |
| 5 | [TanStack Table](./tanstack-table.md) | Type-safe column defs, sorting, filtering, pagination, cell renderers. |
| 6 | [Zustand](./zustand.md) | Store per domain, actions inside store, slices, selectors, computed values. |
| 7 | [Forms](./forms.md) | Schema-first with Zod, React Hook Form integration, validation patterns. |
| 8 | [Services](./services.md) | API client, fetch wrapper, type-safe endpoints, error handling. |
| 9 | [Styling](./styling.md) | Tailwind-only, cn() utility, dark mode, component variants, responsive. |

## Project Structure

```
react-principles/
  docs/                   # <-- you are here
  packages/
    shared/src/
      hooks/              # useDebounce, useLocalStorage, useMediaQuery
      utils/              # cn, formatters, validators (Zod schemas)
      types/              # api.ts, common.ts
      services/           # api-client, endpoints
  apps/
    nextjs/               # Next.js 15 App Router implementation
      hooks/queries/      # useUsers, useUser
      hooks/mutations/    # useCreateUser, useUpdateUser
      stores/             # useAppStore, useFilterStore
      components/examples # UserList, UserTable, UserForm
    vite/                 # Vite + React 18 implementation
      src/hooks/          # Same hook structure
      src/stores/         # Same store structure
      src/components/     # Same component structure
```

## How to Read These Docs

Each doc follows the same format:

1. **Principle** — Why this pattern was chosen. This section is timeless.
2. **Rules** — Rules that must be followed. Actionable, reviewable in a PR.
3. **Pattern** — Abstract pattern without framework-specific detail.
4. **Implementation** — Actual code with version notes.
5. **Common Mistakes** — Anti-patterns that frequently occur.
6. **Related** — Cross-references to other docs.

> Version notes are in every Implementation section. If a library updates and the pattern changes, update that section — not the Principle or Rules.
