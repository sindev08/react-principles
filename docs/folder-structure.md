# Folder Structure

## Principle

Folder structure is an architectural boundary, not just naming style. A predictable structure makes onboarding faster, reduces cross-module coupling, and keeps refactors local.

This repository uses a **feature-oriented structure** inside a single Next.js App Router codebase:
- `app/` for routing and page entrypoints
- `features/` for feature modules
- `shared/` for cross-feature reusable code
- `lib/` for infra-level config/clients
- `ui/` for design-system primitives

## Rules

- New feature -> `src/features/<feature-name>/`
- No direct cross-feature deep imports; use explicit exports and shared modules
- Shared hooks/utils/types/components belong in `src/shared/`
- Third-party client/config belongs in `src/lib/`
- Design-system primitives belong in `src/ui/`
- Route files in `src/app/` should stay thin and delegate logic to `features/`

## Current Structure

```text
src/
├── app/                             # Next.js App Router entrypoints
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── providers.tsx
│   ├── (examples)/                  # example routes
│   ├── docs/                        # docs routes
│   ├── nextjs/cookbook/             # cookbook routes
│   └── vitejs/cookbook/             # cookbook routes (content context)
│
├── features/                        # feature modules
│   ├── landing/
│   ├── docs/
│   ├── cookbook/
│   └── examples/
│       ├── components/
│       └── hooks/
│
├── shared/                          # cross-feature reusable modules
│   ├── components/
│   ├── hooks/
│   ├── stores/
│   ├── types/
│   └── utils/
│
├── lib/                             # app infrastructure and data layer
│   ├── api-client.ts
│   ├── endpoints.ts
│   ├── mock-data.ts
│   ├── query-client.ts
│   └── query-keys.ts
│
└── ui/                              # design-system primitives
    ├── Button.tsx
    ├── Input.tsx
    ├── Dialog.tsx
    └── ...
```

## What Goes Where

| Code | Place |
|------|-------|
| Feature-specific component | `src/features/<feature>/components/` |
| Feature-specific hook | `src/features/<feature>/hooks/` |
| Shared hook/component/type/utils | `src/shared/...` |
| Zustand stores | `src/shared/stores/` |
| API/query client/endpoints | `src/lib/` |
| Design-system primitives | `src/ui/` |
| Route files (page/layout/loading/error) | `src/app/` |

## Anti-Patterns

- Single giant `components/` folder with mixed feature concerns
- Business logic directly in route files under `src/app/`
- Duplicating design-system primitives outside `src/ui/`
- Putting server-state cache into Zustand (keep server state in React Query)
- Creating ad-hoc API clients inside components/hooks instead of using `src/lib/api-client.ts`

## Quick Decision Guide

```text
Is this route wiring?                 -> src/app/
Is this feature-only logic/UI?        -> src/features/<feature>/
Is this reused by multiple features?  -> src/shared/
Is this infra/config/client layer?    -> src/lib/
Is this a primitive UI building block?-> src/ui/
```
