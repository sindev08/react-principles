# react-principles

Monorepo reference project — a living cookbook of React patterns & principles.

## What This Is

- **Living cookbook** — patterns used in real projects, documented with WHY
- **Reference implementation** — real code you can copy to new projects
- **Content source** — basis for LinkedIn posts and blog articles

This is NOT a demo app or showcase. It's a collection of isolated patterns + real implementations in Next.js and Vite apps.

## Tech Stack

| Category | Tool |
|----------|------|
| Monorepo | pnpm workspaces |
| Apps | Next.js 15 (App Router), Vite (React 18) |
| Server State | TanStack Query v5 |
| Client State | Zustand v5 |
| Tables | TanStack Table v8 |
| Forms | React Hook Form v7 + Zod v3 |
| UI | Tailwind CSS + shadcn/ui |
| Testing | Vitest + Testing Library |
| Linting | ESLint + Prettier |

## Getting Started

```bash
# Install dependencies
pnpm install

# Run Next.js app
pnpm dev:nextjs

# Run Vite app
pnpm dev:vite

# Run tests
pnpm test

# Type check all packages
pnpm typecheck
```

## Project Structure

```
react-principles/
├── docs/                    # Pattern documentation
├── packages/shared/         # Shared hooks, utils, types, services
├── apps/nextjs/             # Next.js 15 implementation
├── apps/vite/               # Vite implementation
├── CLAUDE.md                # AI instruction file
└── README.md
```

## Pattern Documentation

All patterns are documented in [`docs/`](./docs/README.md):

- [Component Patterns](./docs/component-patterns.md) — anatomy, composition, splitting
- [Hooks](./docs/hooks.md) — custom hook conventions
- [TypeScript](./docs/typescript.md) — strict mode patterns
- [React Query](./docs/react-query.md) — query keys, mutations, caching
- [TanStack Table](./docs/tanstack-table.md) — columns, sorting, filtering
- [Zustand](./docs/zustand.md) — store patterns, slices
- [Forms](./docs/forms.md) — React Hook Form + Zod
- [Services](./docs/services.md) — API service layer
- [Styling](./docs/styling.md) — Tailwind conventions

## Example Pages

Both apps have the same example pages:

| Route | What It Shows |
|-------|--------------|
| `/` | Home with navigation |
| `/react-query` | React Query data fetching patterns |
| `/table` | TanStack Table with sorting, filtering, pagination |
| `/forms` | React Hook Form + Zod validation |
| `/state` | Zustand store patterns |
