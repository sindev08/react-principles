# React Principles — Pattern Documentation

Dokumentasi pattern dan konvensi yang dipakai di monorepo ini. Setiap doc menjelaskan **WHY** (principle), **WHAT** (rules & pattern), dan **HOW** (implementation) — supaya keputusan arsitektur bisa dipahami dan direproduksi oleh siapa saja di tim.

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
| 1 | [Component Patterns](./component-patterns.md) | Anatomi component, composition, compound components, kapan split. |
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

Setiap doc mengikuti format yang sama:

1. **Principle** — Kenapa pattern ini dipilih. Bagian ini timeless.
2. **Rules** — Aturan yang harus diikuti. Actionable, bisa di-review di PR.
3. **Pattern** — Abstract pattern tanpa framework-specific detail.
4. **Implementation** — Actual code dengan version notes.
5. **Common Mistakes** — Anti-patterns yang sering kejadian.
6. **Related** — Cross-reference ke doc lain.

> Version notes ada di setiap Implementation section. Kalau library update dan pattern berubah, update section itu — bukan Principle atau Rules.
