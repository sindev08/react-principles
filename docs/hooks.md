# Hooks

## Principle

Custom hooks exist karena satu alasan: **separation of concerns**. Component seharusnya cuma urusan rendering — logic yang reusable (debounce, localStorage, media queries, data fetching) harus di-extract ke hooks. Ini bukan premature abstraction — ini boundary yang jelas antara "apa yang di-render" dan "bagaimana data disiapkan".

Kenapa `use` prefix wajib? Bukan cuma convention — React **depends on it** untuk enforce Rules of Hooks. Kalau function tanpa `use` prefix dipanggil di conditional, React tidak bisa warn. Naming yang konsisten juga bikin grep/search gampang: `useX` = hook, titik.

Shared hooks di `packages/shared/` ada supaya logic yang truly universal (debounce, localStorage, media query) ga perlu di-copy paste antar apps. Kalau hook cuma relevan untuk satu app, taruh di app-level `hooks/`.

## Rules

- Semua custom hooks harus prefix `use` — `useDebounce`, bukan `debounce`
- Hook > 150 lines -> extract helper functions (bukan hooks) ke file terpisah
- Rules of Hooks: jangan panggil hooks di conditional, loop, atau nested function
- Shared/universal hooks -> `packages/shared/src/hooks/`
- App-specific hooks -> `apps/{app}/hooks/`
- Query hooks -> `hooks/queries/useEntity.ts` (contoh: `useUsers.ts`)
- Mutation hooks -> `hooks/mutations/useActionEntity.ts` (contoh: `useCreateUser.ts`)
- Hook return: single value, tuple `[value, setter]`, atau object `{ data, isLoading }`
- Selalu type generic parameters: `useDebounce<T>(value: T, delay: number): T`

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

> **Version:** React v18 | Tested on: 2025-05

### useDebounce — Generic Debounce Hook

Dari `packages/shared/src/hooks/useDebounce.ts`:

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

// debouncedSearch hanya update 300ms setelah user berhenti ngetik
const { data } = useUsers({ search: debouncedSearch });
```

### useLocalStorage — Type-safe Persistent State

Dari `packages/shared/src/hooks/useLocalStorage.ts`:

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
- Tuple return: `[value, setValue, removeValue]` — mirip useState tapi persistent
- Cross-tab sync via StorageEvent listener
- Generic `<T>` supaya type-safe: `useLocalStorage<Theme>("theme", "light")`

### useMediaQuery — Responsive Hook

Dari `packages/shared/src/hooks/useMediaQuery.ts`:

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

Lihat detail di [React Query docs](./react-query.md). Contoh singkat:

```ts
// hooks/queries/useUsers.ts
export function useUsers(params: GetUsersParams = {}) {
  return useQuery({
    queryKey: queryKeys.users.list(params as Record<string, unknown>),
    queryFn: () => getUsers(params),
  });
}

// hooks/mutations/useCreateUser.ts
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

Hook files sendiri ga perlu `"use client"` — mereka akan di-bundle sebagai client code karena component yang memanggilnya sudah `"use client"`. Tapi kalau hook dipakai langsung di page component, pastikan page itu `"use client"`.

### Vite

Tidak ada perbedaan — hooks langsung usable tanpa directive khusus.

## Common Mistakes

- **Hook di dalam conditional** — `if (isReady) { const data = useQuery(...) }` — ini melanggar Rules of Hooks. Pakai `enabled` option di React Query atau conditional logic di dalam hook.
- **Lupa cleanup** — `useEffect` yang subscribe ke event tapi tidak return cleanup function. Memory leak.
- **Over-extraction** — Extract hook yang cuma dipakai 1x di 1 component. Rule of thumb: extract kalau dipakai di 2+ tempat, atau kalau component jadi > 200 lines.
- **Dependency array salah** — Lupa masukkan dependency ke useEffect/useCallback/useMemo. ESLint rule `react-hooks/exhaustive-deps` harus on.
- **Return object tanpa useMemo** — `return { data, isLoading }` creates new object setiap render. Untuk hooks yang sering dipanggil, pertimbangkan useMemo atau return tuple.
- **Naming tanpa `use`** — `getDebounced` bukan hook name yang valid. React ga bisa enforce rules tanpa prefix.

## Related

- [React Query](./react-query.md) — Query dan mutation hook patterns
- [Component Patterns](./component-patterns.md) — Kapan extract dari component ke hook
- [TypeScript](./typescript.md) — Generic patterns untuk hooks
