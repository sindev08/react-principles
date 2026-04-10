import type { RecipeDetail } from "../types";

export const stateTaxonomy: RecipeDetail = {
  slug: "state-taxonomy",
  title: "State Taxonomy",
  breadcrumbCategory: "Foundations",
  description: "Three categories of state — local, shared, and server — and exactly which tool handles each one.",
  lastUpdated: "Apr 8, 2026",
  principle: {
    text: "Not all state is the same. Before reaching for any state management library, ask one question: where does this data come from? Local state lives inside one component. Shared state is UI state needed by multiple components. Server state comes from an API and has its own lifecycle — loading, error, stale, and needs refreshing. Each category has a different tool, and mixing them up causes bugs that are hard to trace.",
    tip: "When you find yourself putting API data into Zustand, stop. Server state belongs in React Query. When you find yourself using React Query for a toggle or a modal, stop. UI state belongs in useState or Zustand.",
  },
  rules: [
    {
      title: "Local state: useState",
      description: "If only one component needs it, keep it local. A form input value, a toggle, a hover state — these are all local state.",
    },
    {
      title: "Shared state: Zustand",
      description: "If multiple components need the same UI state — sidebar open/closed, active theme, search dialog open — use Zustand. This is not server data.",
    },
    {
      title: "Server state: React Query",
      description: "If it comes from an API, it is server state. React Query handles caching, background refetching, loading states, and error states automatically.",
    },
    {
      title: "Never put server state in Zustand",
      description: "Storing API data in Zustand means you manage caching, staleness, and loading manually. React Query already does this — use the right tool.",
    },
  ],
  pattern: {
    filename: "The three categories — decision guide",
    code: `// ─── LOCAL STATE ──────────────────────────────────────────────
// One component needs it. No sharing needed.
const [isOpen, setIsOpen] = useState(false);
const [inputValue, setInputValue] = useState('');
const [hovering, setHovering] = useState(false);

// ─── SHARED STATE (Zustand) ───────────────────────────────────
// Multiple components need the same UI state.
// This is NOT data from an API.
const { sidebarOpen, toggleSidebar } = useAppStore();
const { theme, setTheme } = useAppStore();
const { open: searchOpen } = useSearchStore();

// ─── SERVER STATE (React Query) ───────────────────────────────
// Comes from an API. Has loading, error, and cache lifecycle.
const { data: users, isLoading, error } = useUsers();
const { data: user } = useUser(id);

// ❌ WRONG — API data in Zustand
const useUserStore = create((set) => ({
  users: [],
  fetchUsers: async () => {
    const data = await usersService.getAll(); // ← belongs in React Query
    set({ users: data });
  },
}));

// ✅ RIGHT — API data in React Query, UI state in Zustand
const { data: users } = useUsers();             // React Query
const { activeFilter } = useFilterStore();      // Zustand`,
  },
  implementation: {
    nextjs: {
      description: "In Next.js App Router, all three state categories are demonstrated in the starter template. See: github.com/sindev08/react-principles-nextjs → src/shared/stores/ and src/features/users/hooks/",
      filename: "State taxonomy — from react-principles-nextjs starter",
      code: `// ─── SHARED STATE (Zustand) — src/shared/stores/ ─────────────
// useAppStore: theme + sidebar (app-wide UI)
'use client';
export const useAppStore = create<AppState>((set) => ({
  theme: 'light',
  sidebarOpen: true,
  toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}));

// useFilterStore: search + role + status filters with reset
// useSearchStore: search dialog open/closed

// ─── SERVER STATE (React Query) — src/features/users/hooks/ ──
// useUsers: paginated user list from DummyJSON
'use client';
export function useUsers(params?: { limit?: number; skip?: number }) {
  return useQuery({
    queryKey: queryKeys.users.list(params ?? {}),
    queryFn: () => api.get<UsersResponse>(ENDPOINTS.users.list, { params }),
  });
}
// useUser(id): single user detail
// useCreateUser: mutation with cache invalidation`,
    },
    vite: {
      description: "In Vite, all rendering is client-side. Server state always goes through React Query, shared state through Zustand, and local state through useState.",
      filename: "Taxonomy in Vite + React",
      code: `// ─── LOCAL STATE ──────────────────────────────────────────────
function RecipeCard() {
  const [bookmarked, setBookmarked] = useState(false); // local only
  return (
    <button onClick={() => setBookmarked(b => !b)}>
      {bookmarked ? 'Saved' : 'Save'}
    </button>
  );
}

// ─── SERVER STATE (React Query) ───────────────────────────────
function RecipeList() {
  const { data: recipes, isLoading } = useQuery({
    queryKey: ['recipes'],
    queryFn: recipesService.getAll,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return <Spinner />;
  return <div>{recipes?.map(r => <RecipeCard key={r.id} {...r} />)}</div>;
}

// ─── SHARED STATE (Zustand) ───────────────────────────────────
function Navbar() {
  const { theme, toggleTheme } = useAppStore(); // shared UI state
  return <button onClick={toggleTheme}>{theme}</button>;
}`,
    },
  },
  contributor: { name: "Singgih Budi Purnadi", role: "Frontend & Mobile Developer" },
  starterLink: {
    label: "View stores in starter",
    href: "https://github.com/sindev08/react-principles-nextjs/tree/main/src/shared/stores",
  },
};
