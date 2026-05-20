import type { RecipeDetail } from "../types";

export const clientState: RecipeDetail = {
  slug: "client-state",
  title: "Client State with Zustand",
  breadcrumbCategory: "Patterns",
  description:
    "Manage global UI state across multiple Zustand stores. Covers selectors, actions, computed selectors, reset, and the 'use client' boundary in Next.js.",
  principle: {
    text: "Client state — UI toggles, filter state, user preferences — belongs in Zustand, not React Query. Each store owns one domain. Components read a slice of state via selectors and call actions. No prop drilling, no context boilerplate.",
    tip: "One store per feature domain. Never put server state (API data) in Zustand — if it comes from an endpoint, it belongs in React Query.",
  },
  rules: [
    { title: "One store per domain", description: "useAppStore for app-wide settings, useFilterStore for filters, useSearchStore for search UI. Never mix concerns in a single store." },
    { title: "Actions inside the store", description: "Mutations happen in store actions, not in component event handlers. Keeps logic close to state." },
    { title: "Selectors over full-state", description: "Pass selector functions: useAppStore(s => s.theme) not useAppStore(). For multiple values, use useShallow from zustand/shallow." },
    { title: "Reset is first-class", description: "Always define a reset() action for stores that can be cleared. Useful for logout, navigation, and testing." },
    { title: "'use client' on the store file", description: "Zustand hooks call React internals (useState, useSyncExternalStore). Put 'use client' on the store file itself — never on barrel exports — so Server Components can still import types." },
  ],
  pattern: {
    filename: "stores/useFilterStore.ts · useAppStore.ts · useSearchStore.ts",
    code: `'use client';

import { create } from 'zustand';
import type { UserRole, UserStatus } from '@/shared/types/common';

// ─── useFilterStore (feature-scoped filters) ─────────────────────────────────

interface FilterState {
  search: string;
  role: UserRole | null;
  status: UserStatus | null;
  setSearch: (search: string) => void;
  setRole: (role: UserRole | null) => void;
  setStatus: (status: UserStatus | null) => void;
  reset: () => void;
}

const initialFilterState = {
  search: '',
  role: null as UserRole | null,
  status: null as UserStatus | null,
};

export const useFilterStore = create<FilterState>((set) => ({
  ...initialFilterState,
  setSearch: (search) => set({ search }),
  setRole: (role) => set({ role }),
  setStatus: (status) => set({ status }),
  reset: () => set(initialFilterState),
}));

export const useHasActiveFilters = () =>
  useFilterStore(
    (s) => s.search !== '' || s.role !== null || s.status !== null,
  );

// ─── useAppStore (app-wide settings) ─────────────────────────────────────────

type Theme = 'light' | 'dark';

interface AppState {
  theme: Theme;
  sidebarOpen: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'dark',
  sidebarOpen: true,
  setTheme: (theme) => set({ theme }),
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));

// ─── useSearchStore (search dialog UI) ───────────────────────────────────────

interface SearchState {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
}

export const useSearchStore = create<SearchState>()((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  toggle: () => set((s) => ({ open: !s.open })),
}));`,
  },
  implementation: {
    nextjs: {
      description:
        "Zustand stores are client-side only. In Next.js, use them inside Client Components marked with 'use client'. No HydrationBoundary needed — client state is not serialized. Use useShallow when reading multiple values to avoid unnecessary re-renders.",
      filename: "components/UserFilters.tsx",
      code: `'use client';

import { useShallow } from 'zustand/shallow';
import { useFilterStore, useHasActiveFilters } from '@/shared/stores/useFilterStore';
import { Input } from '@/ui/Input';
import { NativeSelect } from '@/ui/NativeSelect';
import type { UserRole } from '@/shared/types/common';

export function UserFilters() {
  const { search, role, setSearch, setRole, reset } = useFilterStore(
    useShallow((s) => ({
      search: s.search,
      role: s.role,
      setSearch: s.setSearch,
      setRole: s.setRole,
      reset: s.reset,
    })),
  );
  const hasFilters = useHasActiveFilters();

  return (
    <div className="flex items-end gap-3">
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search users..."
      />
      <NativeSelect
        value={role ?? ''}
        onChange={(e) =>
          setRole((e.target.value || null) as UserRole | null)
        }
      >
        <option value="">All roles</option>
        <option value="admin">Admin</option>
        <option value="editor">Editor</option>
        <option value="viewer">Viewer</option>
      </NativeSelect>
      {hasFilters && (
        <button onClick={reset}>Reset</button>
      )}
    </div>
  );
}`,
    },
    vite: {
      description:
        "In Vite, Zustand works identically — no special setup required. Import the store hook directly in any component. useShallow is still recommended for multi-value subscriptions.",
      filename: "components/UserFilters.tsx",
      code: `import { useShallow } from 'zustand/shallow';
import { useFilterStore, useHasActiveFilters } from '@/shared/stores/useFilterStore';
import { Input } from '@/ui/Input';
import { NativeSelect } from '@/ui/NativeSelect';
import type { UserRole } from '@/shared/types/common';

export function UserFilters() {
  const { search, role, setSearch, setRole, reset } = useFilterStore(
    useShallow((s) => ({
      search: s.search,
      role: s.role,
      setSearch: s.setSearch,
      setRole: s.setRole,
      reset: s.reset,
    })),
  );
  const hasFilters = useHasActiveFilters();

  return (
    <div className="flex items-end gap-3">
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search users..."
      />
      <NativeSelect
        value={role ?? ''}
        onChange={(e) =>
          setRole((e.target.value || null) as UserRole | null)
        }
      >
        <option value="">All roles</option>
        <option value="admin">Admin</option>
        <option value="editor">Editor</option>
        <option value="viewer">Viewer</option>
      </NativeSelect>
      {hasFilters && (
        <button onClick={reset}>Reset</button>
      )}
    </div>
  );
}`,
    },
  },
  lastUpdated: "May 11, 2026",
  contributor: { name: "Singgih Budi Purnadi", role: "Frontend & Mobile Developer" },
  demoKey: "zustand",
};
