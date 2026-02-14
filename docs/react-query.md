# React Query

## Principle

Kenapa pakai React Query (TanStack Query) dan bukan fetch di useEffect? Karena **server state !== client state**. Server state itu shared, asynchronous, dan bisa stale kapan saja. Manage ini pakai useState/useEffect berarti kita harus handle caching, deduplication, background refetch, pagination, optimistic updates — semua dari scratch. React Query udah solve semua itu.

Query key factory pattern dipilih karena cache invalidation itu **the hardest problem** di data fetching. Kalau key ga terstruktur, invalidation jadi guesswork. Dengan factory pattern, kita bisa invalidate di level yang tepat: semua users, semua user lists, atau specific user detail.

Separation query hooks dan mutation hooks bukan cuma organisasi folder — ini separation of concern. Query = read (idempotent, cacheable), Mutation = write (side effects, invalidation). Mixing keduanya di satu hook bikin logic tangled.

## Rules

- Query keys harus hierarchical, array-based, dan dibuat via factory di `lib/query-keys.ts`
- Query hooks di `hooks/queries/`, mutations di `hooks/mutations/`
- Naming: `useEntity` (query), `useActionEntity` (mutation) — contoh: `useUsers`, `useCreateUser`
- Default `staleTime`: 5 menit untuk lists, 10 menit untuk details
- Default `gcTime` (garbage collection): 10 menit
- Mutations **selalu** invalidate related queries di `onSuccess`
- Jangan pakai `refetchOnWindowFocus: true` di default (explicit per-query kalau butuh)
- `enabled` option untuk dependent/conditional queries
- Jangan taruh React Query data di Zustand — itu double caching

## Pattern

```
// Query key factory — hierarchical
const queryKeys = {
  entity: {
    all:     ["entity"],
    lists:   () => [...all, "list"],
    list:    (params) => [...lists(), params],
    details: () => [...all, "detail"],
    detail:  (id) => [...details(), id],
  },
};

// Invalidation levels:
// queryKeys.entity.all        → invalidate EVERYTHING about entity
// queryKeys.entity.lists()    → invalidate all lists (but not details)
// queryKeys.entity.list(p)    → invalidate specific list
// queryKeys.entity.detail(id) → invalidate specific detail
```

## Implementation

> **Version:** TanStack Query v5 | Tested on: 2025-05

### Query Key Factory

Dari `apps/nextjs/lib/query-keys.ts`:

```ts
export const queryKeys = {
  users: {
    all: ["users"] as const,
    lists: () => [...queryKeys.users.all, "list"] as const,
    list: (params: Record<string, unknown>) =>
      [...queryKeys.users.lists(), params] as const,
    details: () => [...queryKeys.users.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },
};
```

Hierarchy visualization:
```
["users"]                              ← all (invalidates everything)
  ["users", "list"]                    ← lists (all list variants)
    ["users", "list", { page: 1 }]    ← specific list
  ["users", "detail"]                  ← details (all detail variants)
    ["users", "detail", "abc-123"]     ← specific detail
```

### QueryClient Config

Dari `apps/nextjs/lib/query-client.ts`:

```ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,        // 5 minutes — data dianggap fresh
      gcTime: 10 * 60 * 1000,           // 10 minutes — cache disimpan setelah unmount
      retry: 1,                          // 1 retry on failure
      refetchOnWindowFocus: false,       // explicit, bukan default
    },
  },
});
```

Kenapa `staleTime: 5 min`? Karena most data ga berubah dalam hitungan detik. Tanpa staleTime, setiap component mount = refetch. Dengan 5 min staleTime, navigasi antar page instant karena data masih fresh dari cache.

### Query Hook — List

Dari `apps/nextjs/hooks/queries/useUsers.ts`:

```ts
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { getUsers, type GetUsersParams } from "@/lib/mock-data";

export function useUsers(params: GetUsersParams = {}) {
  return useQuery({
    queryKey: queryKeys.users.list(params as Record<string, unknown>),
    queryFn: () => getUsers(params),
  });
}
```

### Query Hook — Detail (Dependent Query)

Dari `apps/nextjs/hooks/queries/useUser.ts`:

```ts
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { getUser } from "@/lib/mock-data";

export function useUser(id: string) {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => getUser(id),
    enabled: !!id,  // hanya fetch kalau id ada (dependent query)
  });
}
```

### Mutation Hook — Create

Dari `apps/nextjs/hooks/mutations/useCreateUser.ts`:

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { createUser } from "@/lib/mock-data";
import type { CreateUserInput } from "@/types/user";

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserInput) => createUser(data),
    onSuccess: () => {
      // Invalidate ALL user queries — lists will refetch with new data
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}
```

### Mutation Hook — Update with Cache Update

Dari `apps/nextjs/hooks/mutations/useUpdateUser.ts`:

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { updateUser } from "@/lib/mock-data";
import type { UpdateUserInput } from "@/types/user";

export function useUpdateUser(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserInput) => updateUser(id, data),
    onSuccess: (updatedUser) => {
      // Invalidate all (lists refetch)
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      // Optimistically set the detail cache (instant update for detail page)
      queryClient.setQueryData(queryKeys.users.detail(id), updatedUser);
    },
  });
}
```

### Optimistic Update Pattern

Untuk instant UI feedback sebelum server respond:

```ts
export function useUpdateUser(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserInput) => updateUser(id, data),
    onMutate: async (newData) => {
      // Cancel in-flight queries
      await queryClient.cancelQueries({ queryKey: queryKeys.users.detail(id) });

      // Snapshot previous value
      const previousUser = queryClient.getQueryData(queryKeys.users.detail(id));

      // Optimistically update
      queryClient.setQueryData(queryKeys.users.detail(id), (old: User) => ({
        ...old,
        ...newData,
      }));

      return { previousUser };
    },
    onError: (_err, _vars, context) => {
      // Rollback on error
      if (context?.previousUser) {
        queryClient.setQueryData(queryKeys.users.detail(id), context.previousUser);
      }
    },
    onSettled: () => {
      // Always refetch after mutation settles
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}
```

### Provider Setup

```tsx
// Wrap app root with QueryClientProvider
<QueryClientProvider client={queryClient}>
  {children}
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

### Next.js

- Provider harus `"use client"` karena pakai context
- Query hooks hanya bisa dipanggil di Client Components
- Untuk Server Component data fetching, pakai React Server Components langsung (fetch in component) — bukan React Query

### Vite

- Tidak ada pembatasan client/server — semua component bisa pakai query hooks
- Setup provider di `providers.tsx` atau `main.tsx`

## Common Mistakes

- **Query key string instead of array** — `queryKey: "users"` ga salah tapi ga hierarchical. Selalu pakai array via factory.
- **Lupa invalidate setelah mutation** — Create/update/delete tanpa invalidation = stale UI. Selalu invalidate di `onSuccess`.
- **staleTime: 0 (default)** — Tanpa custom staleTime, setiap component mount triggers refetch. Set sensible default.
- **Taruh query data di Zustand** — Double caching. React Query sudah cache. Kalau butuh derived state dari query data, compute di component atau buat selector hook.
- **`refetchOnWindowFocus: true` di development** — Tab switch = refetch = console noise. Disable by default, enable per-query di production kalau butuh.
- **Mutate tanpa error handling** — `mutate()` silently fails. Pakai `mutateAsync()` + try/catch, atau handle `isError` di UI.
- **Parallel queries tanpa `useQueries`** — Kalau butuh fetch multiple entities sekaligus, pakai `useQueries` array — bukan multiple `useQuery` calls (meski keduanya work, `useQueries` lebih explicit).

## Related

- [Hooks](./hooks.md) — Custom hook conventions yang apply ke query/mutation hooks
- [Services](./services.md) — API client yang dipakai di queryFn
- [Zustand](./zustand.md) — Kenapa server state TIDAK boleh di Zustand
- [TypeScript](./typescript.md) — Type-safe query keys dan response types
