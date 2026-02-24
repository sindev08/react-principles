# lib/

Third-party configurations and clients — setup only, no business logic.

## What Goes Here

Configuration and initialization for external libraries used across the entire app.

## Files

| File | Purpose |
|------|---------|
| `api-client.ts` | Axios instance with auth token injection and error interceptors |
| `query-client.ts` | TanStack Query global config (staleTime, gcTime, retry defaults) |
| `query-keys.ts` | Centralized query key factory for consistent cache management |

## Rules

- No business logic here — only configuration
- `api-client.ts` is the **single** axios instance — never create a new one elsewhere
- All query keys must go through the factory in `query-keys.ts` — no inline string keys

## query-keys.ts Pattern

```ts
// lib/query-keys.ts
export const queryKeys = {
  users: {
    all: ['users'] as const,
    list: (params: UserListParams) => ['users', 'list', params] as const,
    detail: (id: string) => ['users', 'detail', id] as const,
  },
}
```
