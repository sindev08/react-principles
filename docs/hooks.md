# Hooks

## Principle

Custom hooks exist for one reason: **separation of concerns**. Components should only be concerned with rendering — reusable logic (debounce, localStorage, media queries, data fetching) must be extracted into hooks. This is not premature abstraction — it's a clear boundary between "what is rendered" and "how data is prepared".

Why is the `use` prefix mandatory? It's not just convention — React **depends on it** to enforce the Rules of Hooks. If a function without the `use` prefix is called conditionally, React cannot warn. Consistent naming also makes grep/search easy: `useX` = hook, period.

Shared hooks in `src/shared/` exist so universal logic (debounce, localStorage, media query, animation utilities) does not get duplicated across features. Feature-specific hooks live close to their feature modules.

## Rules

- All custom hooks must have a `use` prefix — `useDebounce`, not `debounce`
- Hook > 150 lines -> extract helper functions (not hooks) into a separate file
- Rules of Hooks: don't call hooks in conditionals, loops, or nested functions
- Shared/universal hooks -> `src/shared/hooks/`
- Feature-specific hooks -> `src/features/<feature>/hooks/`
- Query and mutation hooks in this repo are colocated under `src/features/examples/hooks/`
- Hook return: single value, tuple `[value, setter]`, or object `{ data, isLoading }`
- Always type generic parameters: `useDebounce<T>(value: T, delay: number): T`

## Pattern

```
// Universal hook pattern
function useX<T>(input: T, config?: Config): Output {
  // 1. State declarations
  // 2. Effects / subscriptions
  // 3. Callbacks (memoized with useCallback)
  // 4. Cleanup in useEffect return
  // 5. Return value(s)
}

// Query hook pattern
function useEntity(params) {
  return useQuery({
    queryKey: queryKeys.entity.list(params),
    queryFn: () => fetchEntity(params),
  });
}

// Mutation hook pattern
function useActionEntity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => actionEntity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.entity.all });
    },
  });
}
```

## Implementation

> **Version:** React v19 | Tested on: 2026-02

### useDebounce — Generic Debounce Hook

From `src/shared/hooks/useDebounce.ts`:

```ts
import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

Usage:
```tsx
const [search, setSearch] = useState("");
const debouncedSearch = useDebounce(search, 300);

// debouncedSearch only updates 300ms after the user stops typing
const { data } = useUsers({ search: debouncedSearch });
```

### useLocalStorage — Type-safe Persistent State

From `src/shared/hooks/useLocalStorage.ts`:

```ts
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const readValue = useCallback((): T => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    },
    [key, storedValue],
  );

  const removeValue = useCallback(() => {
    setStoredValue(initialValue);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(key);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}
```

Key points:
- SSR-safe: `typeof window === "undefined"` check
- Tuple return: `[value, setValue, removeValue]` — similar to useState but persistent
- Cross-tab sync via StorageEvent listener
- Generic `<T>` for type safety: `useLocalStorage<Theme>("theme", "light")`

### useMediaQuery — Responsive Hook

From `src/shared/hooks/useMediaQuery.ts`:

```ts
export function useMediaQuery(query: string): boolean {
  const getMatches = useCallback((q: string): boolean => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(q).matches;
  }, []);

  const [matches, setMatches] = useState<boolean>(() => getMatches(query));

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQueryList = window.matchMedia(query);
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    setMatches(mediaQueryList.matches);
    mediaQueryList.addEventListener("change", handleChange);
    return () => mediaQueryList.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
}
```

Usage:
```tsx
const isMobile = useMediaQuery("(max-width: 768px)");
const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
```

### Query & Mutation Hooks

See details in [React Query docs](./react-query.md). Brief example:

```ts
// src/features/examples/hooks/useUsers.ts
export function useUsers(params: GetUsersParams = {}) {
  return useQuery({
    queryKey: queryKeys.users.list(params as Record<string, unknown>),
    queryFn: () => getUsers(params),
  });
}

// src/features/examples/hooks/useCreateUser.ts
export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUserInput) => createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}
```

### Next.js

Hook files themselves don't need `"use client"` — they will be bundled as client code because the component that calls them is already `"use client"`. But if a hook is used directly in a page component, make sure that page is `"use client"`.

### Runtime Note

This repository currently uses Next.js App Router; hook usage should follow `src/app` + `src/features` conventions.

## Common Mistakes

- **Hook inside a conditional** — `if (isReady) { const data = useQuery(...) }` — this violates the Rules of Hooks. Use the `enabled` option in React Query or put conditional logic inside the hook.
- **Forgetting cleanup** — A `useEffect` that subscribes to an event but doesn't return a cleanup function. Memory leak.
- **Over-extraction** — Extracting a hook that is only used once in one component. Rule of thumb: extract if used in 2+ places, or if the component exceeds 200 lines.
- **Wrong dependency array** — Forgetting to include a dependency in useEffect/useCallback/useMemo. The ESLint rule `react-hooks/exhaustive-deps` must be on.
- **Return object without useMemo** — `return { data, isLoading }` creates a new object on every render. For hooks called frequently, consider useMemo or returning a tuple.
- **Naming without `use`** — `getDebounced` is not a valid hook name. React can't enforce the rules without the prefix.

## Related

- [React Query](./react-query.md) — Query and mutation hook patterns
- [Component Patterns](./component-patterns.md) — When to extract from a component into a hook
- [TypeScript](./typescript.md) — Generic patterns for hooks
