# react-principles

Reference project for React patterns and principles with real examples in a Next.js App Router app.

## What This Is

- **Living cookbook** for production React patterns, with WHY and HOW
- **Reference implementation** for data fetching, state management, forms, and UI composition
- **Content source** for docs and social/technical writeups

This project is not a marketing showcase. It is a practical pattern library with runnable pages and detailed docs.

## Tech Stack

| Category | Tool |
|----------|------|
| Framework | Next.js 16 (App Router) |
| Runtime UI | React 19 |
| Server State | TanStack Query v5 |
| Client State | Zustand v5 |
| Tables | TanStack Table v8 |
| Forms | React Hook Form v7 + Zod v4 |
| UI | Tailwind CSS + custom `src/ui` primitives (shadcn-style) |
| Linting | ESLint + Prettier |
| Type Safety | TypeScript strict mode |

## Getting Started

```bash
# Install dependencies
pnpm install

# Run app (http://localhost:3001)
pnpm dev

# Lint
pnpm lint

# Type check
pnpm typecheck

# Production build
pnpm build
```

## Project Structure

```text
react-principles/
├── docs/                    # Pattern documentation
├── public/                  # Static assets
├── src/
│   ├── app/                 # Next.js App Router routes
│   ├── features/            # Feature modules (landing, docs, cookbook, examples)
│   ├── shared/              # Shared hooks, stores, types, utils, components
│   ├── ui/                  # Design system primitives
│   └── lib/                 # Data/client utilities and mock API layer
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

## Example Routes

| Route | What It Shows |
|-------|---------------|
| `/` | Landing page and project entry |
| `/react-query` | React Query data fetching patterns |
| `/table` | TanStack Table patterns |
| `/forms` | React Hook Form + Zod validation |
| `/state` | Zustand store patterns |
| `/docs/*` | Component and pattern documentation |
| `/nextjs/cookbook/*` | Cookbook examples for Next.js context |
| `/vitejs/cookbook/*` | Cookbook examples for Vite context |
