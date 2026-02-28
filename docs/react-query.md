# React Query

## Principle

Why use React Query (TanStack Query) instead of fetch in useEffect? Because **server state !== client state**. Server state is shared, asynchronous, and can go stale at any time. Managing this with useState/useEffect means we have to handle caching, deduplication, background refetching, pagination, and optimistic updates — all from scratch. React Query has already solved all of that.

The query key factory pattern is chosen because cache invalidation is **the hardest problem** in data fetching. If keys are unstructured, invalidation becomes guesswork. With the factory pattern, we can invalidate at exactly the right level: all users, all user lists, or a specific user detail.

Separating query hooks and mutation hooks is not just about folder organization — it's a separation of concerns. Query = read (idempotent, cacheable), Mutation = write (side effects, invalidation). Mixing the two in one hook tangles the logic.

## Rules

- Query keys must be hierarchical, array-based, and created via factory in `lib/query-keys.ts`
- In this repository, query and mutation hooks are colocated in `src/features/examples/hooks/`
- Naming: `useEntity` (query), `useActionEntity` (mutation) — example: `useUsers`, `useCreateUser`
- Default `staleTime`: 5 minutes for lists, 10 minutes for details
- Default `gcTime` (garbage collection): 10 minutes
- Mutations **always** invalidate related queries in `onSuccess`
- Don't use `refetchOnWindowFocus: true` by default (enable per-query explicitly if needed)
- `enabled` option for dependent/conditional queries
- Don't put React Query data in Zustand — that's double caching

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

> **Version:** TanStack Query v5 | Tested on: 2026-02

### Query Key Factory

From `src/lib/query-keys.ts`:

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

From `src/lib/query-client.ts`:

```ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,        // 5 minutes — data considered fresh
      gcTime: 10 * 60 * 1000,           // 10 minutes — cache kept after unmount
      retry: 1,                          // 1 retry on failure
      refetchOnWindowFocus: false,       // explicit, not default
    },
  },
});
```

Why `staleTime: 5 min`? Because most data doesn't change within seconds. Without staleTime, every component mount triggers a refetch. With 5 min staleTime, navigating between pages is instant because data is still fresh from cache.

### Query Hook — List

From `src/features/examples/hooks/useUsers.ts`:

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

From `src/features/examples/hooks/useUser.ts`:

```ts
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { getUser } from "@/lib/mock-data";

export function useUser(id: string) {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => getUser(id),
    enabled: !!id,  // only fetch when id is present (dependent query)
  });
}
```

### Mutation Hook — Create

From `src/features/examples/hooks/useCreateUser.ts`:

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { createUser } from "@/lib/mock-data";
import type { CreateUserInput } from "@/shared/types/user";

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

From `src/features/examples/hooks/useUpdateUser.ts`:

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { updateUser } from "@/lib/mock-data";
import type { UpdateUserInput } from "@/shared/types/user";

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

For instant UI feedback before the server responds:

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

- Provider must be `"use client"` because it uses context
- Query hooks can only be called in Client Components
- For Server Component data fetching, use React Server Components directly (fetch in component) — not React Query

### Runtime Note

This repository currently ships Next.js App Router pages; React Query hooks are consumed from client components only.

## Common Mistakes

- **Query key as string instead of array** — `queryKey: "users"` isn't wrong but isn't hierarchical. Always use an array via the factory.
- **Forgetting to invalidate after mutation** — Create/update/delete without invalidation = stale UI. Always invalidate in `onSuccess`.
- **staleTime: 0 (default)** — Without a custom staleTime, every component mount triggers a refetch. Set a sensible default.
- **Putting query data in Zustand** — Double caching. React Query already caches. If you need derived state from query data, compute it in the component or create a selector hook.
- **`refetchOnWindowFocus: true` in development** — Tab switch = refetch = console noise. Disable by default, enable per-query in production if needed.
- **Mutate without error handling** — `mutate()` fails silently. Use `mutateAsync()` + try/catch, or handle `isError` in UI.
- **Parallel queries without `useQueries`** — When you need to fetch multiple entities at once, use `useQueries` array — not multiple `useQuery` calls (both work, but `useQueries` is more explicit).

## Related

- [Hooks](./hooks.md) — Custom hook conventions that apply to query/mutation hooks
- [Services](./services.md) — API client used in queryFn
- [Zustand](./zustand.md) — Why server state must NOT be in Zustand
- [TypeScript](./typescript.md) — Type-safe query keys and response types
