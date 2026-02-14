# Component Patterns

## Principle

Kenapa kita butuh konvensi anatomy yang ketat? Karena **consistency reduces cognitive load**. Ketika setiap component file punya struktur yang sama, developer baru bisa langsung navigasi tanpa mikir "di mana ya types-nya?" atau "export-nya di atas atau di bawah?". Ini bukan tentang estetika — ini tentang **scanability** dan **reviewability**. PR review jadi cepat kalau semua file predictable.

Composition over inheritance bukan cuma mantra React — ini fundamental karena UI itu inherently **tree-shaped**, bukan class hierarchy. Component yang kecil dan composable lebih gampang di-test, di-reuse, dan di-reason tentang side effect-nya.

## Rules

- Setiap component file harus mengikuti anatomy: **Imports -> Types -> Constants -> Component -> Export**
- Satu file = satu exported component (internal helpers boleh di file yang sama)
- Component > 200 lines -> split ke sub-components
- Props > 7 -> refactor (gunakan composition atau object props)
- Jangan modify `components/ui/` langsung — extend via wrapper component
- Semua component punya explicit return type atau `JSX.Element` via inference
- Gunakan `interface` untuk props, bukan `type` (kecuali union)
- Nama file = nama component: `UserTable.tsx` exports `UserTable`

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

Dari `apps/nextjs/components/examples/UserList.tsx`:

```tsx
// 1. Imports — React, external, internal, relative
"use client";

import { useState } from "react";
import { useUsers } from "@/hooks/queries/useUsers";
import { LoadingState } from "@/components/common/LoadingState";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

// 2. Types (inline di sini karena tidak ada custom props)

// 3. Constants — tidak ada untuk component ini

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

Daripada setiap component handle error sendiri, kita compose dengan `ErrorBoundary`:

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

Components di `components/common/` adalah reusable building blocks:

```tsx
// LoadingState — skeleton placeholder
<LoadingState rows={5} message="Loading users..." />

// EmptyState — zero-data state
<EmptyState title="No users found" description="Try adjusting your search query." />
```

### Next.js

- Tambahkan `"use client"` directive di component yang pakai hooks, state, atau browser APIs
- Server Components adalah default di App Router — hanya tambah `"use client"` kalau memang butuh
- Provider components (`Providers`) harus `"use client"` karena pakai context

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

- Tidak perlu `"use client"` — semua component sudah client-side by default
- Provider structure sama, tapi di-mount di `main.tsx` atau `providers.tsx`

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

- **Mixing concerns** — Satu component yang fetch data, handle form, dan render table sekaligus. Split: container (data) vs presentational (UI).
- **Arrow function exports** — `export const UserList = () => { ... }`. Pakai named function declaration supaya stack trace jelas dan hoisting works.
- **Props drilling > 2 levels** — Kalau prop harus pass through 2+ component, pertimbangkan composition (children), context, atau Zustand.
- **Lupa `"use client"`** — Di Next.js App Router, component tanpa directive = Server Component. Kalau pakai useState/useEffect, akan error.
- **Giant component files** — File > 200 lines berarti ada logic yang bisa di-extract ke hook atau sub-component.
- **Modifying `components/ui/`** — File dari shadcn/ui jangan diubah langsung. Buat wrapper: `components/common/Button.tsx` yang extends UI button.

## Related

- [Hooks](./hooks.md) — Kapan extract logic dari component ke custom hook
- [Styling](./styling.md) — Tailwind patterns untuk component styling
- [TypeScript](./typescript.md) — Interface patterns untuk component props
