# features/

Feature modules — each folder is a self-contained unit of functionality.

## What Goes Here

Business logic scoped to a single feature: components, local UI hooks, raw API call services, and TypeScript types.

## Rules

- One folder per feature, named after the domain (`users/`, `stocks/`, `dashboard/`)
- No direct imports between feature folders — use `shared/` as the bridge
- Each feature must have an `index.ts` that defines its public API
- `hooks/` inside a feature = pure UI logic only — no API calls (those go in `/hooks/queries` or `/hooks/mutations`)

## Structure

```
[feature-name]/
├── components/    # UI components used only within this feature
├── hooks/         # Pure UI logic — no API calls
├── services/      # Raw API call functions (axios/fetch) for this feature
├── types/         # TypeScript interfaces and types
└── index.ts       # Public exports
```

## Example

```
features/
└── users/
    ├── components/
    │   ├── UserTable.tsx
    │   └── UserForm.tsx
    ├── hooks/
    │   └── useUserTableFilter.ts   ← local filter state, no API
    ├── services/
    │   └── users.service.ts        ← getUsers(), createUser()
    ├── types/
    │   └── user.types.ts
    └── index.ts                    ← export { UserTable, UserForm }
```

## What Does NOT Go Here

- Hooks that call an API → `/hooks/queries/` or `/hooks/mutations/`
- Components used by multiple features → `shared/components/`
- Shared utility functions → `shared/utils/`
