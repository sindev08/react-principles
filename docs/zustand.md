# Zustand

## Principle

Kenapa Zustand dan bukan Redux atau Context API? Karena Zustand punya **simplicity tanpa sacrifice**. Redux terlalu verbose untuk kebanyakan use case (actions, reducers, dispatch, selectors — semua terpisah). Context API re-renders semua consumers setiap value berubah. Zustand kasih kita store yang simple, performant (granular subscriptions), dan zero-boilerplate.

Rule "1 store per domain" itu penting karena monolithic store (satu store untuk semua) bikin coupling tinggi — perubahan di satu domain bisa unintentionally affect domain lain. Tapi terlalu banyak store juga masalah (coordination nightmare). Sweet spot: 1 store per feature/domain boundary.

"Never put server state in Zustand" itu **non-negotiable**. Server state (data dari API) harus di-manage oleh React Query — dia yang handle caching, staleness, background refetch, deduplication. Kalau copy server data ke Zustand, kita punya dua sources of truth yang bisa out of sync. Zustand cuma untuk **client state**: theme, sidebar open/close, filter selections, UI preferences.

## Rules

- 1 store per domain/feature: `useAppStore` (app-wide UI), `useFilterStore` (filter state)
- Actions (setters/togglers) harus **inside** the store, bukan external functions
- Naming: `use` + Domain + `Store` — contoh: `useAppStore`, `useFilterStore`
- Never put server state di Zustand (that's React Query's job)
- Gunakan selectors untuk granular subscriptions: `useAppStore((s) => s.theme)`
- Initial state sebagai separate object untuk easy reset
- Slices pattern untuk large stores (> 10 state fields)
- Stores di `stores/` folder, 1 file per store

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

> **Version:** Zustand v5 | Tested on: 2025-05

### App Store — Global UI State

Dari `apps/nextjs/stores/useAppStore.ts`:

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
  theme: "light",
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

Dari `apps/nextjs/stores/useFilterStore.ts`:

```ts
import { create } from "zustand";
import type { UserRole, UserStatus } from "@react-principles/shared/types";

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

Key pattern: `initialState` sebagai separate object supaya `reset()` bisa return ke state awal tanpa re-define setiap field.

### Derived Selectors

Dari `apps/nextjs/stores/useFilterStore.ts`:

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

Untuk store yang grow > 10 fields, split ke slices:

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

Kalau butuh persist state ke localStorage:

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

- Store files ga perlu `"use client"` — mereka di-import oleh client components
- SSR caveat: Zustand store adalah singleton. Di Next.js dengan SSR, hati-hati hydration mismatch. Pakai `persist` middleware dengan `skipHydration` kalau perlu

### Vite

- Tidak ada SSR concern — store langsung usable
- Sama persis dengan Next.js dalam usage

## Common Mistakes

- **Taruh server state di store** — `useAppStore.setState({ users: fetchedUsers })` — ini double caching. Users harus di React Query, bukan Zustand.
- **Actions di luar store** — `const setTheme = (theme) => useAppStore.setState({ theme })` — actions harus di dalam create(). External actions bikin logic scattered.
- **Subscribe ke seluruh store** — `const state = useAppStore()` tanpa selector = re-render setiap ANY state change. Selalu pakai selector: `useAppStore((s) => s.theme)`.
- **Lupa initial state object** — Tanpa separate `initialState`, reset function harus hardcode setiap value. Error-prone kalau state grow.
- **Store yang terlalu besar** — Store dengan 20+ fields tanpa slices. Split ke slices per concern.
- **Derived state di store** — `isFilterActive: search !== ""` sebagai state field — ini bisa jadi computed selector. Jangan store derived values, compute them.
- **Mutating state directly** — `set((state) => { state.theme = "dark"; return state; })` — Zustand pakai shallow merge, tapi mutating parameter itu bad practice. Always return new object.

## Related

- [React Query](./react-query.md) — Server state management (complement to Zustand)
- [Hooks](./hooks.md) — Store hooks follow same naming conventions
- [TypeScript](./typescript.md) — Store interface typing
- [Component Patterns](./component-patterns.md) — How components consume store state
