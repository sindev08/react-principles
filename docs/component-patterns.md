# Component Patterns

## Principle

Why do we need strict anatomy conventions? Because **consistency reduces cognitive load**. When every component file has the same structure, a new developer can navigate immediately without thinking "where are the types?" or "is the export at the top or the bottom?". This isn't about aesthetics — it's about **scanability** and **reviewability**. PR reviews go faster when all files are predictable.

Composition over inheritance isn't just a React mantra — it's fundamental because UI is inherently **tree-shaped**, not a class hierarchy. Small, composable components are easier to test, reuse, and reason about in terms of side effects.

## Rules

- Every component file must follow the anatomy: **Imports -> Types -> Constants -> Component -> Export**
- One file = one exported component (internal helpers are allowed in the same file)
- Component > 200 lines -> split into sub-components
- Props > 7 -> refactor (use composition or object props)
- Don't modify `components/ui/` directly — extend via wrapper component
- All components have an explicit return type or `JSX.Element` via inference
- Use `interface` for props, not `type` (except for unions)
- File name = component name: `UserTable.tsx` exports `UserTable`

## Pattern

```
// 1. Imports — ordered: React → external libs → internal packages → relative
import { ... } from "react";
import { ... } from "external-lib";
import { ... } from "@shared/...";
import { ... } from "./local";

// 2. Types — interfaces for props, types for internal
interface ComponentProps { ... }

// 3. Constants — component-scoped, UPPER_SNAKE
const MAX_ITEMS = 10;

// 4. Component — named function, not arrow
function Component({ prop1, prop2 }: ComponentProps) {
  // hooks first
  // derived state
  // handlers
  // early returns (loading, error, empty)
  // main render
}

// 5. Export — always at the bottom
export { Component };
```

## Implementation

> **Version:** React v18 | Next.js v15 | Tested on: 2025-05

### Component Anatomy — Real Example

From `apps/nextjs/components/examples/UserList.tsx`:

```tsx
// 1. Imports — React, external, internal, relative
"use client";

import { useState } from "react";
import { useUsers } from "@/hooks/queries/useUsers";
import { LoadingState } from "@/components/common/LoadingState";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

// 2. Types (inline here since there are no custom props)

// 3. Constants — none for this component

// 4. Component
function UserListInner() {
  // hooks first
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useUsers({ search, page, limit: 5 });

  // early returns — loading state
  if (isLoading) {
    return <LoadingState rows={5} message="Loading users..." />;
  }

  // early returns — error state
  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm text-red-600">{error.message}</p>
      </div>
    );
  }

  // derived state
  const users = data?.data ?? [];
  const meta = data?.meta;

  // main render
  return (
    <div className="space-y-4">
      {/* search input */}
      {/* user list or empty state */}
      {/* pagination */}
    </div>
  );
}

// 5. Export — wrapped with ErrorBoundary (composition pattern)
export function UserList() {
  return (
    <ErrorBoundary>
      <UserListInner />
    </ErrorBoundary>
  );
}
```

### Composition Pattern — ErrorBoundary Wrapper

Instead of each component handling errors on its own, we compose with `ErrorBoundary`:

```tsx
// ErrorBoundary accepts children and optional fallback
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

// Usage — wrap any component that might throw
<ErrorBoundary>
  <UserListInner />
</ErrorBoundary>

// With custom fallback
<ErrorBoundary fallback={<CustomErrorUI />}>
  <UserListInner />
</ErrorBoundary>
```

### Common UI Components

Components in `components/common/` are reusable building blocks:

```tsx
// LoadingState — skeleton placeholder
<LoadingState rows={5} message="Loading users..." />

// EmptyState — zero-data state
<EmptyState title="No users found" description="Try adjusting your search query." />
```

### Next.js

- Add the `"use client"` directive to components that use hooks, state, or browser APIs
- Server Components are the default in App Router — only add `"use client"` when actually needed
- Provider components (`Providers`) must be `"use client"` because they use context

```tsx
// apps/nextjs/app/providers.tsx
"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/lib/query-client";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### Vite

- No need for `"use client"` — all components are already client-side by default
- Provider structure is the same, but mounted in `main.tsx` or `providers.tsx`

```tsx
// apps/vite/src/providers.tsx
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/lib/query-client";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

## Common Mistakes

- **Mixing concerns** — A single component that fetches data, handles a form, and renders a table all at once. Split: container (data) vs presentational (UI).
- **Arrow function exports** — `export const UserList = () => { ... }`. Use named function declarations so stack traces are clear and hoisting works.
- **Props drilling > 2 levels** — If a prop has to pass through 2+ components, consider composition (children), context, or Zustand.
- **Forgetting `"use client"`** — In Next.js App Router, a component without the directive = Server Component. Using useState/useEffect will cause an error.
- **Giant component files** — Files > 200 lines mean there's logic that can be extracted into a hook or sub-component.
- **Modifying `components/ui/`** — Don't modify shadcn/ui files directly. Create a wrapper: `components/common/Button.tsx` that extends the UI button.

## Related

- [Hooks](./hooks.md) — When to extract logic from a component into a custom hook
- [Styling](./styling.md) — Tailwind patterns for component styling
- [TypeScript](./typescript.md) — Interface patterns for component props
