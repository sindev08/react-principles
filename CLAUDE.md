# Project: react-principles

Standalone Next.js 15 app — React patterns & principles cookbook.
Single app, feature-based folder structure, TypeScript strict.

## Tech Stack
- App: Next.js 15 (App Router)
- Server State: TanStack Query v5
- Client State: Zustand v5
- Tables: TanStack Table v8
- Forms: React Hook Form v7 + Zod v3
- UI: Tailwind CSS + shadcn/ui
- Testing: Vitest + Testing Library
- Linting: ESLint + Prettier

## Project Structure
```
src/
├── app/          — Next.js App Router pages
├── features/     — Feature modules (components + hooks co-located)
├── hooks/        — Shared pure-UI hooks (no API calls)
├── lib/          — API client, query client, query keys, mock data
├── shared/       — Cross-cutting: components, stores, types, utils
└── ui/           — Design system primitives
```

- `docs/` — Pattern documentation

## Component Anatomy — every component file:
1. Imports (React → external → internal → relative)
2. Types/interfaces
3. Constants (component-scoped)
4. Component function
5. Export

## Naming
| What | Pattern | Example |
|------|---------|---------|
| Components | PascalCase | `UserTable.tsx` |
| Hooks | `use` prefix | `useDebounce.ts` |
| Query hooks | `use` + entity | `useUsers.ts` |
| Mutation hooks | `use` + action + entity | `useCreateUser.ts` |
| Stores | `use` + domain + `Store` | `useAppStore.ts` |
| Utils | camelCase | `formatters.ts` |
| Constants | UPPER_SNAKE | `QUERY_KEYS` |
| Event handlers | `handle` + verb | `handleSubmit` |
| Boolean | `is`/`has`/`should` | `isLoading` |

## React Query Conventions
- Query keys: array-based, hierarchical → `["users", "list", { page }]`
- Use query key factory in `lib/query-keys.ts`
- Query/mutation hooks live in `features/[name]/hooks/` (co-located with the feature)
- Always set staleTime (default 5 min for lists, 10 min for details)
- Mutations always invalidate related queries in onSuccess

## Zustand Conventions
- 1 store per domain/feature
- Use slices for large stores
- Never put server state in Zustand (that's React Query's job)
- Actions inside the store, not outside

## Form Conventions
- Schema-first: define Zod schema before form
- 1 schema = 1 form
- Reuse schemas via .pick() / .extend()
- Error messages in Zod schema, not in JSX

## TypeScript
- `strict: true` + `noUncheckedIndexedAccess: true`
- Never use `any` — use `unknown` and narrow
- `interface` for component props
- `type` for unions, utility types, function signatures
- Export types from where they're defined

## Styling
- Tailwind only, use `cn()` for conditional classes
- Dark mode: `dark:` prefix (class-based)
- No CSS modules, no styled-components

## File Limits
- Component > 200 lines → split
- Hook > 150 lines → extract helpers
- Props > 7 → refactor

## Do NOT
- Modify `ui/` directly — extend via wrapper
- Use `any` type
- Hardcode user-facing strings
- Use `console.log` in production code
- Put server state in Zustand
- Create files > 300 lines
