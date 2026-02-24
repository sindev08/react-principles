# app/

Next.js App Router — routing and page layout only.

## What Goes Here

Route definitions, page entry points, layouts, loading states, and error boundaries. No business logic — that belongs in `/src/features`.

## Rules

- `page.tsx` must be thin — import from `features/`, no inline business logic
- Use `loading.tsx` for Suspense-based loading UI
- Use `error.tsx` for route-level error boundaries
- Use route groups `(group)` for layout organization without affecting the URL

## Structure

```
app/
├── layout.tsx              # Root layout
├── page.tsx                # Home → imports from features/home
├── globals.css
└── [feature]/
    ├── page.tsx            # Page entry → imports from features/[feature]
    ├── loading.tsx         # Loading state
    └── error.tsx           # Error boundary
```

## Example

```tsx
// app/users/page.tsx
import { UserTable } from '@/features/users'

export default function UsersPage() {
  return <UserTable />
}
```
