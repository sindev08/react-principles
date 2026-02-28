# Zustand

## Principle

Why Zustand and not Redux or Context API? Because Zustand has **simplicity without sacrifice**. Redux is too verbose for most use cases (actions, reducers, dispatch, selectors — all separate). Context API re-renders all consumers every time a value changes. Zustand gives us a store that is simple, performant (granular subscriptions), and zero-boilerplate.

The "1 store per domain" rule is important because a monolithic store (one store for everything) creates high coupling — a change in one domain can unintentionally affect another. But too many stores are also a problem (coordination nightmare). The sweet spot: 1 store per feature/domain boundary.

"Never put server state in Zustand" is **non-negotiable**. Server state (data from an API) must be managed by React Query — it handles caching, staleness, background refetching, and deduplication. If you copy server data into Zustand, you have two sources of truth that can go out of sync. Zustand is only for **client state**: theme, sidebar open/close, filter selections, UI preferences.

## Rules

- 1 store per domain/feature: `useAppStore` (app-wide UI), `useFilterStore` (filter state)
- Actions (setters/togglers) must be **inside** the store, not external functions
- Naming: `use` + Domain + `Store` — example: `useAppStore`, `useFilterStore`
- Never put server state in Zustand (that's React Query's job)
- Use selectors for granular subscriptions: `useAppStore((s) => s.theme)`
- Initial state as a separate object for easy reset
- Slices pattern for large stores (> 10 state fields)
- Stores in `stores/` folder, 1 file per store

## Pattern

```
// Store creation pattern
const useXStore = create<State>((set, get) => ({
  // state
  value: initialValue,

  // actions — always inside
  setValue: (value) => set({ value }),
  toggleValue: () => set((state) => ({ value: !state.value })),
  reset: () => set(initialState),

  // computed — via get()
  computed: () => derive(get().value),
}));

// Selector pattern — granular subscription
const value = useXStore((state) => state.value);
const action = useXStore((state) => state.setValue);

// Derived selector — exported separately
const useDerived = () => useXStore((state) => compute(state));
```

## Implementation

> **Version:** Zustand v5 | Tested on: 2026-02

### App Store — Global UI State

From `src/shared/stores/useAppStore.ts`:

```ts
import { create } from "zustand";

type Theme = "light" | "dark";

interface AppState {
  // State
  theme: Theme;
  sidebarOpen: boolean;

  // Actions — inside the store
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  theme: "dark",
  sidebarOpen: true,

  setTheme: (theme) => set({ theme }),
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
```

Usage in component:
```tsx
function Header() {
  // Granular subscription — only re-renders when theme changes
  const theme = useAppStore((state) => state.theme);
  const toggleTheme = useAppStore((state) => state.toggleTheme);

  return (
    <button onClick={toggleTheme}>
      Current: {theme}
    </button>
  );
}
```

### Filter Store — Domain-specific State with Reset

From `src/shared/stores/useFilterStore.ts`:

```ts
import { create } from "zustand";
import type { UserRole, UserStatus } from "@/shared/types/common";

interface FilterState {
  search: string;
  role: UserRole | null;
  status: UserStatus | null;
  setSearch: (search: string) => void;
  setRole: (role: UserRole | null) => void;
  setStatus: (status: UserStatus | null) => void;
  reset: () => void;
}

// Separate initial state for easy reset
const initialState = {
  search: "",
  role: null as UserRole | null,
  status: null as UserStatus | null,
};

export const useFilterStore = create<FilterState>((set) => ({
  ...initialState,
  setSearch: (search) => set({ search }),
  setRole: (role) => set({ role }),
  setStatus: (status) => set({ status }),
  reset: () => set(initialState),
}));
```

Key pattern: `initialState` as a separate object so `reset()` can return to the initial state without re-defining every field.

### Derived Selectors

From `src/shared/stores/useFilterStore.ts`:

```ts
/** Selector: returns true when any filter is active. */
export const useHasActiveFilters = () =>
  useFilterStore(
    (state) => state.search !== "" || state.role !== null || state.status !== null,
  );
```

Usage:
```tsx
function FilterBar() {
  const hasActiveFilters = useHasActiveFilters();
  const reset = useFilterStore((state) => state.reset);

  return hasActiveFilters ? (
    <button onClick={reset}>Clear all filters</button>
  ) : null;
}
```

### Slices Pattern (Large Stores)

For stores that grow > 10 fields, split into slices:

```ts
// slices/uiSlice.ts
interface UiSlice {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const createUiSlice = (set: SetState): UiSlice => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
});

// slices/themeSlice.ts
interface ThemeSlice {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const createThemeSlice = (set: SetState): ThemeSlice => ({
  theme: "light",
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
});

// store.ts — combine slices
type AppState = UiSlice & ThemeSlice;

export const useAppStore = create<AppState>((...args) => ({
  ...createUiSlice(...args),
  ...createThemeSlice(...args),
}));
```

### Zustand with Middleware (Persist)

If you need to persist state to localStorage:

```ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: "light",
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "app-store", // localStorage key
      partialize: (state) => ({ theme: state.theme }), // only persist theme
    },
  ),
);
```

### Next.js

- Store files don't need `"use client"` — they are imported by client components
- SSR caveat: Zustand stores are singletons. In Next.js with SSR, be careful of hydration mismatch. Use `persist` middleware with `skipHydration` if needed

### Runtime Note

This repository currently uses Next.js App Router. Keep store usage in client components and avoid SSR hydration mismatches for persisted state.

## Common Mistakes

- **Putting server state in the store** — `useAppStore.setState({ users: fetchedUsers })` — this is double caching. Users should be in React Query, not Zustand.
- **Actions outside the store** — `const setTheme = (theme) => useAppStore.setState({ theme })` — actions must be inside `create()`. External actions scatter logic.
- **Subscribing to the entire store** — `const state = useAppStore()` without a selector = re-render on ANY state change. Always use a selector: `useAppStore((s) => s.theme)`.
- **Forgetting the initial state object** — Without a separate `initialState`, the reset function must hardcode every value. Error-prone as state grows.
- **Store that is too large** — A store with 20+ fields without slices. Split into slices per concern.
- **Derived state in the store** — `isFilterActive: search !== ""` as a state field — this can be a computed selector. Don't store derived values, compute them.
- **Mutating state directly** — `set((state) => { state.theme = "dark"; return state; })` — Zustand uses shallow merge, but mutating the parameter is bad practice. Always return a new object.

## Related

- [React Query](./react-query.md) — Server state management (complement to Zustand)
- [Hooks](./hooks.md) — Store hooks follow same naming conventions
- [TypeScript](./typescript.md) — Store interface typing
- [Component Patterns](./component-patterns.md) — How components consume store state
