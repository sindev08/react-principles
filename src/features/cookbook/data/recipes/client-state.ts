import type { RecipeDetail } from "../types";

export const clientState: RecipeDetail = {
  slug: "client-state",
  title: "Client State with Zustand",
  breadcrumbCategory: "Patterns",
  description:
    "Manage global UI state across multiple Zustand stores. Covers store slices, selectors, actions, and a computed filter store with reset.",
  principle: {
    text: "Client state — UI toggles, filter state, user preferences — belongs in Zustand, not React Query. Each store owns one domain. Components read a slice of state via selectors and call actions. No prop drilling, no context boilerplate.",
    tip: "One store per feature domain. Never put server state (API data) in Zustand — if it comes from an endpoint, it belongs in React Query.",
  },
  rules: [
    { title: "One store per domain", description: "useAppStore for app-wide settings, useFilterStore for filters. Never mix concerns in a single store." },
    { title: "Actions inside the store", description: "Mutations happen in store actions, not in component event handlers. Keeps logic close to state." },
    { title: "Selectors over full-state", description: "Pass selector functions: useAppStore(s => s.theme) not useAppStore(). Prevents unnecessary re-renders." },
    { title: "Reset is first-class", description: "Always define a reset() action for stores that can be cleared. Useful for logout, navigation, and testing." },
  ],
  pattern: {
    filename: "stores/useFilterStore.ts",
    code: `import { create } from 'zustand';
import type { UserRole, UserStatus } from '@/types';

interface FilterState {
  search: string;
  role: UserRole | null;
  status: UserStatus | null;
  setSearch: (search: string) => void;
  setRole: (role: UserRole | null) => void;
  setStatus: (status: UserStatus | null) => void;
  reset: () => void;
}

const initialState = { search: '', role: null, status: null };

export const useFilterStore = create<FilterState>((set) => ({
  ...initialState,
  setSearch: (search) => set({ search }),
  setRole: (role) => set({ role }),
  setStatus: (status) => set({ status }),
  reset: () => set(initialState),
}));

// Computed selector — avoids inline logic in components
export const useHasActiveFilters = () =>
  useFilterStore((s) => s.search !== '' || s.role !== null || s.status !== null);`,
  },
  implementation: {
    nextjs: {
      description:
        "Zustand stores are client-side only. In Next.js, use them inside Client Components marked with 'use client'. No HydrationBoundary needed — client state is not serialized.",
      filename: "components/UserFilters.tsx",
      code: `'use client';

import { useFilterStore, useHasActiveFilters } from '@/stores/useFilterStore';

export function UserFilters() {
  const { search, role, setSearch, setRole, reset } = useFilterStore();
  const hasFilters = useHasActiveFilters();

  return (
    <div className="flex gap-3">
      <input value={search} onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..." />
      <select value={role ?? ''} onChange={(e) => setRole(e.target.value || null)}>
        <option value="">All roles</option>
        <option value="admin">Admin</option>
      </select>
      {hasFilters && <button onClick={reset}>Reset</button>}
    </div>
  );
}`,
    },
    vite: {
      description:
        "In Vite, Zustand works identically — no special setup required. Import the store hook directly in any component.",
      filename: "components/UserFilters.tsx",
      code: `import { useFilterStore, useHasActiveFilters } from '@/stores/useFilterStore';

export function UserFilters() {
  const { search, role, setSearch, setRole, reset } = useFilterStore();
  const hasFilters = useHasActiveFilters();

  return (
    <div className="flex gap-3">
      <input value={search} onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..." />
      <select value={role ?? ''} onChange={(e) => setRole(e.target.value || null)}>
        <option value="">All roles</option>
        <option value="admin">Admin</option>
      </select>
      {hasFilters && <button onClick={reset}>Reset</button>}
    </div>
  );
}`,
    },
  },
  lastUpdated: "Feb 26, 2026",
  contributor: { name: "Singgih Budi Purnadi", role: "Frontend & Mobile Developer" },
  demoKey: "zustand",
};
