export interface RuleItem {
  title: string;
  description: string;
}

export interface ImplTab {
  description: string;
  filename: string;
  code: string;
}

export type DemoKey = "react-query" | "zustand" | "forms" | "table";

export type ContentType = "recipe" | "reference" | "concept";

export interface SeeAlsoItem {
  slug: string;
  label: string;
}

export interface LeadsTo {
  slug: string;
  teaser: string;
}

// ─── Recipe-specific fields ─────────────────────────────────────

export interface RecipeProblem {
  scenario: string;
  mistake: string;
}

export interface CommonMistake {
  title: string;
  wrong: string;
  right: string;
  explanation: string;
}

// ─── Reference-specific fields ──────────────────────────────────

export interface Alternative {
  approach: string;
  tradeoff: string;
}

// ─── Concept-specific fields ────────────────────────────────────

export interface DecisionTreeItem {
  condition: string;
  answer: string;
}

export interface ConceptExample {
  scenario: string;
  decision: string;
  why: string;
}

export interface CommonTrap {
  trap: string;
  fix: string;
}

// ─── Unified RecipeDetail ───────────────────────────────────────

export interface RecipeDetail {
  slug: string;
  title: string;
  contentType: ContentType;
  breadcrumbCategory: string;
  description: string;
  lastUpdated: string;
  rules: RuleItem[];
  pattern: { filename: string; code: string };
  implementation: { nextjs: ImplTab; vite: ImplTab };
  contributor: { name: string; role: string };
  demoKey?: DemoKey;

  // Shared new fields
  seeAlso?: SeeAlsoItem[];
  leadsTo?: LeadsTo | null;

  // Recipe-type fields
  principle?: { text: string; tip: string };
  problem?: RecipeProblem;
  commonMistakes?: CommonMistake[];
  checkpoint?: string[];

  // Reference-type fields
  context?: string;
  convention?: { text: string; tip: string };
  reasoning?: string;
  alternatives?: Alternative[];

  // Concept-type fields
  mentalModel?: { text: string; tip: string };
  decisionTree?: DecisionTreeItem[];
  examples?: ConceptExample[];
  commonTraps?: CommonTrap[];
}

export const RECIPE_DETAILS: Record<string, RecipeDetail> = {
  "server-state": {
    slug: "server-state",
    contentType: "recipe",
    title: "Server State with React Query",
    breadcrumbCategory: "Patterns",
    description:
      "Fetch, cache, and synchronize server data using TanStack Query v5. Covers pagination, search, background refetching, and loading states.",
    principle: {
      text: "Server state is async, shared, and can become stale. TanStack Query owns the entire lifecycle — fetching, caching, deduplication, and background revalidation. Components declare what data they need via custom hooks and stay completely free of fetch logic.",
      tip: "Never mirror server data into useState. If it came from an API, it belongs in React Query's cache. Local state is only for UI — modals, toggles, input values.",
    },
    rules: [
      { title: "Hooks own the fetching", description: "Query hooks go in hooks/queries/. Components only call the hook and render the result." },
      { title: "Hierarchical query keys", description: "Structure keys as arrays: [\"users\", \"list\", { search, page }] for granular cache invalidation." },
      { title: "Always set staleTime", description: "Default staleTime is 0 — every render refetches. Be explicit: 5 min for lists, 10 min for details." },
      { title: "Handle all states", description: "Always render isLoading, isError, and empty states. Never assume data exists on first render." },
    ],
    pattern: {
      filename: "hooks/queries/useUsers.ts",
      code: `import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { getUsers, type GetUsersParams } from '@/services/users';

export function useUsers(params: GetUsersParams = {}) {
  return useQuery({
    queryKey: queryKeys.users.list(params),
    queryFn: () => getUsers(params),
    staleTime: 1000 * 60 * 5,       // 5 minutes
    placeholderData: (prev) => prev, // no layout shift on page change
  });
}`,
    },
    implementation: {
      nextjs: {
        description:
          "In Next.js App Router, prefetch data in a Server Component and hydrate the client cache via HydrationBoundary. The user sees real data on first paint — no loading spinner.",
        filename: "app/users/page.tsx",
        code: `import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/get-query-client';
import { queryKeys } from '@/lib/query-keys';
import { getUsers } from '@/services/users';

export default async function UsersPage() {
  const qc = getQueryClient();
  await qc.prefetchQuery({
    queryKey: queryKeys.users.list({}),
    queryFn: () => getUsers({}),
  });
  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <UserList />
    </HydrationBoundary>
  );
}`,
      },
      vite: {
        description:
          "In Vite, QueryClientProvider wraps the app. Call the hook directly inside your component — React Query handles loading and error states automatically.",
        filename: "pages/UsersPage.tsx",
        code: `import { useUsers } from '@/hooks/queries/useUsers';
import { LoadingState } from '@/components/common/LoadingState';

export function UsersPage() {
  const { data, isLoading, isError } = useUsers({ page: 1, limit: 10 });

  if (isLoading) return <LoadingState rows={5} />;
  if (isError) return <p>Failed to load users.</p>;

  return <UserList users={data.data} meta={data.meta} />;
}`,
      },
    },
    lastUpdated: "Feb 26, 2026",
    contributor: { name: "Singgih Budi Purnadi", role: "Frontend & Mobile Developer" },
    demoKey: "react-query",
    seeAlso: [
      { slug: "services-layer", label: "API Integration flow: Services Layer" },
      { slug: "typescript-for-react", label: "API Integration flow: Response Types" },
      { slug: "state-taxonomy", label: "When to use React Query vs Zustand" },
    ],
    leadsTo: null,
  },

  "client-state": {
    slug: "client-state",
    contentType: "recipe",
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
    seeAlso: [
      { slug: "state-taxonomy", label: "When to use Zustand vs React Query" },
      { slug: "server-state", label: "Server state belongs in React Query" },
    ],
    leadsTo: null,
  },

  "form-validation": {
    slug: "form-validation",
    contentType: "recipe",
    title: "Form Validation with Zod",
    breadcrumbCategory: "Patterns",
    description:
      "Schema-first form validation with React Hook Form and Zod. Type-safe, declarative error messages, and zero boilerplate for create and edit flows.",
    principle: {
      text: "The Zod schema is the single source of truth — it defines the shape, types, and error messages. React Hook Form handles registration, submission, and field state. Components never write validation logic; they display what the schema declares.",
      tip: "Write the schema before a single input. Share schemas across forms with .pick(), .extend(), or .omit(). Keep all error messages inside the schema, not in JSX.",
    },
    rules: [
      { title: "Schema before form", description: "Define the Zod schema first. Never add validation inline with register options or manual if-statements." },
      { title: "Omit server-generated fields", description: "Use .omit({ id: true, createdAt: true }) for create forms. The schema reflects what the user provides." },
      { title: "handleSubmit owns errors", description: "Wrap mutation calls in handleSubmit. Validation errors surface automatically without try/catch in the component." },
      { title: "Reset after success", description: "Call reset() after a successful mutation to clear all field values and dirty state." },
    ],
    pattern: {
      filename: "components/UserForm.tsx",
      code: `import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const createUserSchema = z.object({
  name:   z.string().min(1, 'Name is required'),
  email:  z.string().email('Enter a valid email address'),
  role:   z.enum(['viewer', 'editor', 'admin']),
  status: z.enum(['active', 'inactive']),
});

type CreateUserValues = z.infer<typeof createUserSchema>;

export function UserForm() {
  const { register, handleSubmit, reset,
    formState: { errors, isSubmitting } } = useForm<CreateUserValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { name: '', email: '', role: 'viewer', status: 'active' },
  });

  const onSubmit = async (data: CreateUserValues) => {
    await createUser(data);
    reset();
  };

  return <form onSubmit={handleSubmit(onSubmit)}>{/* fields */}</form>;
}`,
    },
    implementation: {
      nextjs: {
        description:
          "In Next.js App Router, pair the form with a Server Action for zero-client-bundle mutations. Validate with the same Zod schema on the server to prevent bypassing client validation.",
        filename: "app/users/actions.ts",
        code: `'use server';

import { createUserSchema } from '@/lib/schemas';
import { db } from '@/lib/db';

export async function createUserAction(values: unknown) {
  const data = createUserSchema.parse(values); // validates server-side too
  await db.user.create({ data });
}`,
      },
      vite: {
        description:
          "In Vite, pair the form with a React Query mutation. On success, invalidate the users list so the table refreshes automatically.",
        filename: "hooks/mutations/useCreateUser.ts",
        code: `import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser } from '@/services/users';
import { queryKeys } from '@/lib/query-keys';

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.users.lists() });
    },
  });
}`,
      },
    },
    lastUpdated: "Feb 26, 2026",
    contributor: { name: "Singgih Budi Purnadi", role: "Frontend & Mobile Developer" },
    demoKey: "forms",
    seeAlso: [
      { slug: "typescript-for-react", label: "TypeScript patterns for type-safe forms" },
    ],
    leadsTo: null,
  },

  "data-tables": {
    slug: "data-tables",
    contentType: "recipe",
    title: "Data Tables with TanStack Table",
    breadcrumbCategory: "Patterns",
    description:
      "Headless, sortable, filterable, and paginated tables using TanStack Table v8. Full styling control with no component library lock-in.",
    principle: {
      text: "TanStack Table is a headless engine — it computes row models, manages sorting, filtering, and pagination state, but renders nothing. You own the markup. This separation means complete styling control without fighting a component library.",
      tip: "Wrap column definitions in useMemo with an empty dependency array. Column definitions are stable references — recreating them on every render causes unnecessary row model recalculations.",
    },
    rules: [
      { title: "Columns are stable", description: "Wrap column definitions in useMemo(() => [...], []). Redefining them each render triggers unnecessary re-sorts and re-filters." },
      { title: "Own the render loop", description: "Use flexRender() for both headers and cells. Never manually extract cell values — let the column definition handle rendering." },
      { title: "Server-side for large data", description: "Client-side filtering and sorting works up to ~1,000 rows. Beyond that, move pagination and filtering to the server." },
      { title: "Global vs column filters", description: "Use globalFilter for quick full-text search. Use column-level filters for advanced filtering UI with per-field controls." },
    ],
    pattern: {
      filename: "components/UserTable.tsx",
      code: `import { useMemo, useState } from 'react';
import {
  useReactTable, getCoreRowModel, getSortedRowModel,
  getFilteredRowModel, getPaginationRowModel,
  flexRender, type ColumnDef, type SortingState,
} from '@tanstack/react-table';
import type { User } from '@/types';

const columns: ColumnDef<User>[] = [
  { accessorKey: 'name',   header: 'Name' },
  { accessorKey: 'email',  header: 'Email' },
  { accessorKey: 'role',   header: 'Role' },
  { accessorKey: 'status', header: 'Status' },
];

export function UserTable({ data }: { data: User[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const cols = useMemo(() => columns, []);

  const table = useReactTable({
    data, columns: cols,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  // render table.getHeaderGroups() and table.getRowModel().rows
}`,
    },
    implementation: {
      nextjs: {
        description:
          "In Next.js, prefetch the initial page of data in a Server Component and pass it as initialData. The table renders immediately without a loading state.",
        filename: "app/users/page.tsx",
        code: `import { UserTable } from '@/components/UserTable';
import { getUsers } from '@/services/users';

export default async function UsersPage() {
  const initialData = await getUsers({ page: 1, limit: 20 });
  return <UserTable initialData={initialData} />;
}`,
      },
      vite: {
        description:
          "In Vite, fetch data via a React Query hook and pass it to the table. For datasets under 1,000 rows, all filtering and sorting can stay client-side.",
        filename: "pages/UsersPage.tsx",
        code: `import { useUsers } from '@/hooks/queries/useUsers';
import { UserTable } from '@/components/UserTable';

export function UsersPage() {
  const { data, isLoading } = useUsers({ limit: 100 });

  if (isLoading) return <TableSkeleton />;

  return <UserTable data={data?.data ?? []} />;
}`,
      },
    },
    lastUpdated: "Feb 26, 2026",
    contributor: { name: "Singgih Budi Purnadi", role: "Frontend & Mobile Developer" },
    demoKey: "table",
    seeAlso: [
      { slug: "server-state", label: "Data fetching with React Query" },
    ],
    leadsTo: null,
  },

  "folder-structure": {
    slug: "folder-structure",
    contentType: "reference",
    title: "Folder Structure",
    breadcrumbCategory: "Foundations",
    description: "A feature-based folder structure so you always know where a file goes — and why it belongs there.",
    lastUpdated: "Mar 17, 2026",
    convention: {
      text: "A good folder structure answers one question instantly: 'where does this file go?' Feature-based organization groups everything related to a feature together — its components, hooks, and data — so you spend time building, not searching. When a feature grows or gets deleted, everything moves together.",
      tip: "If you can't decide where a file goes in under 10 seconds, your structure is too abstract. Feature-based organization should make the answer obvious.",
    },
    rules: [
      {
        title: "Feature-based grouping",
        description: "Everything related to a feature lives in src/features/[name]/ — its components, hooks, and data together.",
      },
      {
        title: "Co-location",
        description: "Tests, types, and constants live next to the code they describe. Avoid global /types or /constants folders.",
      },
      {
        title: "No cross-feature imports",
        description: "Features never import directly from each other. Code needed by multiple features moves to src/shared/.",
      },
      {
        title: "Public API via index.ts",
        description: "Each feature exposes only what needs to be exposed via an index.ts file. Internals stay internal.",
      },
    ],
    pattern: {
      filename: "src/ — feature-based structure",
      code: `src/
├── app/              # Next.js routing only — no business logic here
├── features/         # One folder per domain feature
│   ├── cookbook/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── data/
│   │   └── index.ts  # Public API — only export what others need
│   └── examples/
│       ├── components/
│       ├── hooks/
│       └── index.ts
├── shared/           # Truly cross-cutting code
│   ├── components/   # Used by 2+ features
│   ├── hooks/
│   ├── stores/
│   └── utils/
├── lib/              # External service clients (API, query client)
└── ui/               # Design system primitives (Button, Input, etc.)`,
    },
    implementation: {
      nextjs: {
        description: "Next.js adds the app/ directory for file-based routing. Route logic (pages) lives in app/, all business logic stays in features/.",
        filename: "src/app/ — routing only",
        code: `src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page → renders <LandingPage />
│   ├── (examples)/         # Route group — no URL segment
│   │   └── forms/page.tsx  # Renders <UserForm /> from features/
│   └── nextjs/
│       └── cookbook/
│           └── [slug]/page.tsx
├── features/
│   └── landing/
│       └── components/
│           └── LandingPage.tsx  # Actual component lives here
└── shared/`,
      },
      vite: {
        description: "Vite projects use React Router for routing. The same src/ structure applies — routing config lives separately from feature code.",
        filename: "src/ — Vite structure",
        code: `src/
├── routes/             # React Router config — routing only
│   ├── index.tsx       # Route definitions
│   └── layouts/
├── features/           # Same feature-based structure
│   └── cookbook/
│       ├── components/
│       ├── hooks/
│       └── index.ts
├── shared/
├── lib/
└── ui/`,
      },
    },
    contributor: { name: "Singgih Budi Purnadi", role: "Frontend & Mobile Developer" },
    leadsTo: {
      slug: "component-anatomy",
      teaser: "Udah tau dimana file-nya. Tapi isi file-nya berantakan?",
    },
  },

  "typescript-for-react": {
    slug: "typescript-for-react",
    contentType: "reference",
    title: "TypeScript for React",
    breadcrumbCategory: "Foundations",
    description: "How to type component props, event handlers, and hooks correctly. The contracts that prevent silent bugs.",
    lastUpdated: "Mar 17, 2026",
    convention: {
      text: "Bugs caught at compile time cost nothing to fix. Bugs caught in production cost everything. TypeScript for React is not about learning the full TypeScript language — it is about writing the right contracts between your components so that mistakes are caught before the code even runs.",
      tip: "Start by typing your component props. If you can describe what a component accepts and returns, the rest of the types follow naturally.",
    },
    rules: [
      {
        title: "interface for component props",
        description: "Use interface to define component props. It is extendable and reads clearly as a contract.",
      },
      {
        title: "type for unions and utilities",
        description: "Use type for union types, utility types, and function signatures — things that are not directly 'objects with fields'.",
      },
      {
        title: "Never use any",
        description: "any disables type checking completely. Use unknown and narrow it with type guards instead.",
      },
      {
        title: "strict: true in tsconfig",
        description: "Strict mode enables the full set of type checks. Without it, TypeScript catches only the most obvious errors.",
      },
    ],
    pattern: {
      filename: "components/UserCard.tsx — typed component",
      code: `import type { ReactNode } from 'react';

// ✅ interface for component props
interface UserCardProps {
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';  // union type
  isActive: boolean;
  onEdit: (id: string) => void;          // typed event handler
  children?: ReactNode;
}

// ✅ typed event handler
function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
  event.preventDefault();
}

// ✅ typed useState
const [count, setCount] = useState<number>(0);

// ❌ never do this
const fetchUser = async (): Promise<any> => { ... }

// ✅ use unknown and narrow
const fetchUser = async (): Promise<unknown> => { ... }`,
    },
    implementation: {
      nextjs: {
        description: "Next.js page components receive typed params and searchParams. Always type these explicitly.",
        filename: "app/users/[id]/page.tsx",
        code: `// ✅ Typed Next.js page props
interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}

export default async function UserPage({ params }: PageProps) {
  const { id } = await params;
  return <UserDetail id={id} />;
}

// ✅ Typed Server Action
async function updateUser(
  id: string,
  data: UpdateUserInput
): Promise<{ success: boolean }> {
  'use server';
  // ...
}`,
      },
      vite: {
        description: "In Vite + React Router, type your route params using useParams with a generic.",
        filename: "features/users/components/UserDetail.tsx",
        code: `import { useParams } from 'react-router-dom';

// ✅ Typed route params
function UserDetail() {
  const { id } = useParams<{ id: string }>();

  // id is string | undefined — handle both cases
  if (!id) return null;

  return <div>{id}</div>;
}

// ✅ Typed custom hook return
function useUser(id: string): {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
} {
  // ...
}`,
      },
    },
    contributor: { name: "Singgih Budi Purnadi", role: "Frontend & Mobile Developer" },
    seeAlso: [
      { slug: "services-layer", label: "API Integration flow: Response Types" },
      { slug: "server-state", label: "API Integration flow: Typed Query Hooks" },
    ],
    leadsTo: {
      slug: "useeffect-render-cycle",
      teaser: "Types udah aman. Tapi kok useEffect jalan terus? Infinite loop!",
    },
  },

  "component-anatomy": {
    slug: "component-anatomy",
    contentType: "reference",
    title: "Component Anatomy",
    breadcrumbCategory: "Foundations",
    description: "The consistent internal structure every component follows — imports, types, constants, function, export.",
    lastUpdated: "Mar 17, 2026",
    convention: {
      text: "When every component follows the same structure, you stop thinking about where things go inside a file and start thinking about what the component actually does. Consistent anatomy means anyone on the team can open any file and immediately know where to look — props are always at the top, constants are always before the function, exports are always at the bottom.",
      tip: "The hardest part of component anatomy is constants vs. props. Rule of thumb: if it never changes based on what's passed in, it is a constant. If it could change from outside, it is a prop.",
    },
    rules: [
      {
        title: "Imports first",
        description: "Order: React → external libraries → internal aliases (@/) → relative imports (./). This makes dependencies visible at a glance.",
      },
      {
        title: "Types and interfaces second",
        description: "Define all types used in this file immediately after imports. Props interface always comes first.",
      },
      {
        title: "Constants third",
        description: "Component-scoped constants (static data, config, labels) come before the function. Never define constants inside the function body.",
      },
      {
        title: "Component function fourth",
        description: "The function itself comes after everything it depends on. Keep it focused — if it grows past 200 lines, split it.",
      },
      {
        title: "Named export last",
        description: "Always use named exports, never default exports. Named exports make refactoring and search easier.",
      },
    ],
    pattern: {
      filename: "components/RecipeCard.tsx — anatomy template",
      code: `// 1. IMPORTS — React → external → internal → relative
import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/shared/utils/cn';
import { useSavedStore } from '../stores/useSavedStore';

// 2. TYPES
interface RecipeCardProps {
  slug: string;
  title: string;
  description: string;
  category: string;
}

// 3. CONSTANTS — static, never changes based on props
const MAX_DESCRIPTION_LENGTH = 120;
const CARD_BASE_CLASS = 'rounded-xl border bg-white shadow-sm';

// 4. COMPONENT FUNCTION
export function RecipeCard({ slug, title, description, category }: RecipeCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { isSaved } = useSavedStore();

  const truncated = description.slice(0, MAX_DESCRIPTION_LENGTH);

  return (
    <div className={cn(CARD_BASE_CLASS, isHovered && 'shadow-lg')}>
      {/* ... */}
    </div>
  );
}

// 5. EXPORT — named, at the bottom
// (already exported above with "export function")`,
    },
    implementation: {
      nextjs: {
        description: "In Next.js, mark client components explicitly with 'use client' — it goes above all imports as the very first line.",
        filename: "features/cookbook/components/RecipeCard.tsx",
        code: `// 'use client' goes ABOVE imports if the component is a Client Component
'use client';

// 1. IMPORTS
import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/shared/utils/cn';

// 2. TYPES
interface RecipeCardProps {
  slug: string;
  title: string;
  framework: 'nextjs' | 'vitejs';
}

// 3. CONSTANTS
const HREF_MAP = {
  nextjs: '/nextjs/cookbook',
  vitejs: '/vitejs/cookbook',
} as const;

// 4. COMPONENT
export function RecipeCard({ slug, title, framework }: RecipeCardProps) {
  const [saved, setSaved] = useState(false);
  const href = \`\${HREF_MAP[framework]}/\${slug}\`;

  return (
    <Link href={href}>
      <span>{title}</span>
    </Link>
  );
}`,
      },
      vite: {
        description: "In Vite + React, all components are client-side by default. No 'use client' needed — just follow the anatomy.",
        filename: "features/cookbook/components/RecipeCard.tsx",
        code: `// 1. IMPORTS
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/shared/utils/cn';

// 2. TYPES
interface RecipeCardProps {
  slug: string;
  title: string;
}

// 3. CONSTANTS
const BASE_PATH = '/cookbook';

// 4. COMPONENT
export function RecipeCard({ slug, title }: RecipeCardProps) {
  const [saved, setSaved] = useState(false);

  return (
    <Link to={\`\${BASE_PATH}/\${slug}\`}>
      <span>{title}</span>
    </Link>
  );
}`,
      },
    },
    contributor: { name: "Singgih Budi Purnadi", role: "Frontend & Mobile Developer" },
    leadsTo: {
      slug: "typescript-for-react",
      teaser: "File udah rapi. Tapi props bisa apa aja? Error di runtime?",
    },
  },

  "useeffect-render-cycle": {
    slug: "useeffect-render-cycle",
    contentType: "recipe",
    title: "useEffect & Render Cycle",
    breadcrumbCategory: "Foundations",
    description: "When effects run, why the dependency array exists, and how to clean up after yourself.",
    lastUpdated: "Mar 17, 2026",
    principle: {
      text: "useEffect is not a lifecycle method — it is a synchronization tool. It answers one question: 'what side effects need to stay in sync with this data?' Every time the dependency array changes, React re-runs the effect to keep things synchronized. When you understand this mental model, dependency arrays stop feeling like magic rules and start making sense.",
      tip: "If you find yourself writing useEffect to fetch data, stop. That is what React Query is for. useEffect is for synchronizing with things outside React — browser APIs, subscriptions, timers.",
    },
    rules: [
      {
        title: "Always declare dependencies honestly",
        description: "Every value from the component scope used inside the effect belongs in the dependency array. If you add eslint-disable to hide a missing dependency, you have a bug.",
      },
      {
        title: "Return a cleanup function when needed",
        description: "If your effect creates a subscription, timer, or event listener — clean it up in the return function. Otherwise you get memory leaks and stale handlers.",
      },
      {
        title: "Empty array means once on mount",
        description: "[] runs the effect once after the first render. Only use this when the effect truly has no dependencies — not as a shortcut to avoid thinking about deps.",
      },
      {
        title: "Do not use useEffect for data fetching",
        description: "Fetching data inside useEffect causes race conditions, no loading state management, and no caching. Use React Query instead.",
      },
    ],
    pattern: {
      filename: "hooks/useWindowSize.ts — effect with cleanup",
      code: `import { useEffect, useState } from 'react';

interface WindowSize {
  width: number;
  height: number;
}

export function useWindowSize(): WindowSize {
  const [size, setSize] = useState<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    // The effect: subscribe to resize events
    function handleResize() {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);

    // The cleanup: unsubscribe when component unmounts
    // or before the effect re-runs
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // No deps — window never changes

  return size;
}`,
    },
    implementation: {
      nextjs: {
        description: "In Next.js, window is not available on the server. Guard all browser API access with a typeof window check or use 'use client'.",
        filename: "shared/hooks/useWindowSize.ts",
        code: `'use client'; // Required — window only exists in browser

import { useEffect, useState } from 'react';

export function useWindowSize() {
  // ✅ Safe initial state — no window access during SSR
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // ✅ Now safe — this only runs in the browser
    function handleResize() {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }

    handleResize(); // Set initial size
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}`,
      },
      vite: {
        description: "In Vite, all code runs in the browser — no SSR concerns. The pattern is straightforward.",
        filename: "shared/hooks/useWindowSize.ts",
        code: `import { useEffect, useState } from 'react';

export function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}`,
      },
    },
    contributor: { name: "Singgih Budi Purnadi", role: "Frontend & Mobile Developer" },
    leadsTo: {
      slug: "component-composition",
      teaser: "Component udah jalan. Tapi prop drilling 5 level ke bawah?",
    },
  },

  "component-composition": {
    slug: "component-composition",
    contentType: "recipe",
    title: "Component Composition",
    breadcrumbCategory: "Foundations",
    description: "How components combine and communicate — children props, slot patterns, and why composition beats deep prop drilling.",
    lastUpdated: "Mar 17, 2026",
    principle: {
      text: "Prop drilling happens when you pass data through multiple components that do not use it — just to get it to a component deep in the tree. Composition solves this differently: instead of passing data down, you pass components down. The parent controls what gets rendered, and children receive exactly what they need directly.",
      tip: "When you find yourself adding a prop to a component just to pass it further down, stop. That is the signal to use composition instead.",
    },
    rules: [
      {
        title: "Use children for flexible content",
        description: "The children prop lets a parent inject content into a component without the component needing to know what it is.",
      },
      {
        title: "Use named slots for multiple injection points",
        description: "When you need more than one place to inject content (header + footer + body), use named props instead of children.",
      },
      {
        title: "Prefer composition over configuration",
        description: "A component that accepts children is more flexible than one with 10 props controlling its internals. Compose behavior, do not configure it.",
      },
      {
        title: "Keep components focused",
        description: "Each component does one thing. Composition is how you build complex UIs from simple, focused pieces.",
      },
    ],
    pattern: {
      filename: "components/Card.tsx — slot composition pattern",
      code: `// ❌ Prop drilling — Card needs to know about title, footer, etc.
<Card
  title="Recipe"
  subtitle="Foundations"
  footer={<Button>View</Button>}
  headerIcon="layers"
/>

// ✅ Composition — Card just provides structure
<Card>
  <Card.Header>
    <span>Foundations</span>
    <h2>Recipe</h2>
  </Card.Header>
  <Card.Body>
    Content goes here
  </Card.Body>
  <Card.Footer>
    <Button>View</Button>
  </Card.Footer>
</Card>

// The Card implementation
interface CardProps { children: React.ReactNode }
interface CardHeaderProps { children: React.ReactNode }

function Card({ children }: CardProps) {
  return <div className="rounded-xl border bg-white">{children}</div>;
}

function CardHeader({ children }: CardHeaderProps) {
  return <div className="p-4 border-b">{children}</div>;
}

Card.Header = CardHeader;
Card.Body = ({ children }: CardProps) => <div className="p-4">{children}</div>;
Card.Footer = ({ children }: CardProps) => <div className="p-4 border-t">{children}</div>;`,
    },
    implementation: {
      nextjs: {
        description: "In Next.js, composition works the same way. Server Components can pass Client Components as children — this is how you keep server/client boundaries clean.",
        filename: "features/cookbook/components/RecipeLayout.tsx",
        code: `// Server Component — fetches data
export default async function RecipePage({ params }: PageProps) {
  const detail = await getRecipeDetail(params.slug);

  return (
    // Passes a Client Component as children
    <RecipeLayout
      header={<RecipeHeader title={detail.title} />}
      sidebar={<RecipeToc sections={detail.sections} />}
    >
      {/* Client Component receives data as props, not fetching itself */}
      <RecipeContent detail={detail} />
    </RecipeLayout>
  );
}

// RecipeLayout — just structure, no data concerns
interface RecipeLayoutProps {
  header: React.ReactNode;
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

export function RecipeLayout({ header, sidebar, children }: RecipeLayoutProps) {
  return (
    <div>
      <header>{header}</header>
      <div className="flex">
        <aside>{sidebar}</aside>
        <main>{children}</main>
      </div>
    </div>
  );
}`,
      },
      vite: {
        description: "In Vite, all components are client-side. Composition is the primary tool for managing component complexity without prop drilling.",
        filename: "features/cookbook/components/RecipeLayout.tsx",
        code: `interface RecipeLayoutProps {
  header: React.ReactNode;
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

export function RecipeLayout({ header, sidebar, children }: RecipeLayoutProps) {
  return (
    <div className="min-h-screen">
      <header className="border-b">{header}</header>
      <div className="flex max-w-7xl mx-auto">
        <aside className="w-64 shrink-0">{sidebar}</aside>
        <main className="flex-1 px-8">{children}</main>
      </div>
    </div>
  );
}

// Usage in a route component
export function RecipePage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: detail } = useRecipeDetail(slug!);

  if (!detail) return null;

  return (
    <RecipeLayout
      header={<RecipeHeader title={detail.title} />}
      sidebar={<RecipeToc sections={detail.sections} />}
    >
      <RecipeContent detail={detail} />
    </RecipeLayout>
  );
}`,
      },
    },
    contributor: { name: "Singgih Budi Purnadi", role: "Frontend & Mobile Developer" },
    leadsTo: {
      slug: "custom-hooks",
      teaser: "useEffect + useState logic-nya sama di 3 component. Copy-paste?",
    },
  },

  "services-layer": {
    slug: "services-layer",
    contentType: "recipe",
    title: "Services Layer",
    breadcrumbCategory: "Foundations",
    description: "How to organize all backend communication in one place — so when an API changes, you fix it in one file, not twenty.",
    lastUpdated: "Mar 17, 2026",
    principle: {
      text: "When you fetch data directly inside a component, the component becomes responsible for knowing the URL, the HTTP method, the request format, and the error handling. That is four responsibilities too many. A services layer centralizes all backend communication — components just call a function and get data back. When the API changes, you fix it in one file, not twenty.",
      tip: "A service function should read like plain English: getUserById(id), createOrder(data), deletePost(id). If it needs more than one argument object, consider splitting it into two functions.",
    },
    rules: [
      {
        title: "Services only talk to the API",
        description: "A service function takes inputs, calls the API, and returns data. It does not touch state, does not render anything, and does not know about React.",
      },
      {
        title: "One file per resource",
        description: "Group service functions by the API resource they belong to: users.ts, orders.ts, recipes.ts. Not by HTTP method.",
      },
      {
        title: "Services live in lib/",
        description: "The services layer belongs in src/lib/ alongside the API client and query keys — not inside a feature folder.",
      },
      {
        title: "Hooks consume services, components consume hooks",
        description: "Components never call service functions directly. The chain is: service → custom hook → component.",
      },
    ],
    pattern: {
      filename: "lib/services/users.ts — service layer pattern",
      code: `import { apiClient } from '@/lib/api-client';
import type { User, CreateUserInput, UpdateUserInput } from '@/shared/types/user';

// ✅ Service functions — pure API communication
export const usersService = {
  getAll: async (): Promise<User[]> => {
    const response = await apiClient.get('/users');
    return response.data;
  },

  getById: async (id: string): Promise<User> => {
    const response = await apiClient.get(\`/users/\${id}\`);
    return response.data;
  },

  create: async (data: CreateUserInput): Promise<User> => {
    const response = await apiClient.post('/users', data);
    return response.data;
  },

  update: async (id: string, data: UpdateUserInput): Promise<User> => {
    const response = await apiClient.patch(\`/users/\${id}\`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(\`/users/\${id}\`);
  },
};`,
    },
    implementation: {
      nextjs: {
        description: "In Next.js App Router, service functions can be called directly in Server Components. For Client Components, wrap them in React Query hooks.",
        filename: "lib/services/users.ts + hooks usage",
        code: `// lib/api-client.ts — axios instance
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// lib/services/users.ts — service layer
import { apiClient } from '@/lib/api-client';
import type { User } from '@/shared/types/user';

export const usersService = {
  getAll: async (): Promise<User[]> => {
    const { data } = await apiClient.get('/users');
    return data;
  },
  getById: async (id: string): Promise<User> => {
    const { data } = await apiClient.get(\`/users/\${id}\`);
    return data;
  },
};

// features/examples/hooks/useUsers.ts — hook wraps service
import { useQuery } from '@tanstack/react-query';
import { usersService } from '@/lib/services/users';

export function useUsers() {
  return useQuery({
    queryKey: ['users', 'list'],
    queryFn: usersService.getAll,
  });
}`,
      },
      vite: {
        description: "In Vite, the pattern is identical. The services layer is framework-agnostic — the same service files work in both Next.js and Vite projects.",
        filename: "lib/services/users.ts + hooks usage",
        code: `// lib/api-client.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// lib/services/users.ts — same as Next.js version
import { apiClient } from '@/lib/api-client';
import type { User } from '@/shared/types/user';

export const usersService = {
  getAll: async (): Promise<User[]> => {
    const { data } = await apiClient.get('/users');
    return data;
  },
};

// features/examples/hooks/useUsers.ts
import { useQuery } from '@tanstack/react-query';
import { usersService } from '@/lib/services/users';

export function useUsers() {
  return useQuery({
    queryKey: ['users', 'list'],
    queryFn: usersService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}`,
      },
    },
    contributor: { name: "Singgih Budi Purnadi", role: "Frontend & Mobile Developer" },
    seeAlso: [
      { slug: "typescript-for-react", label: "API Integration flow: Response Types" },
      { slug: "server-state", label: "API Integration flow: Query Hooks" },
    ],
    leadsTo: {
      slug: "state-taxonomy",
      teaser: "Services layer done. Tapi kapan pakai useState, Zustand, atau React Query?",
    },
  },

  "state-taxonomy": {
    slug: "state-taxonomy",
    contentType: "concept",
    title: "State Taxonomy",
    breadcrumbCategory: "Foundations",
    description: "Three categories of state — local, shared, and server — and exactly which tool handles each one.",
    lastUpdated: "Mar 17, 2026",
    mentalModel: {
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
        description: "In Next.js App Router, Server Components fetch server state directly — no React Query or Zustand needed. React Query is for Client Components that fetch after mount.",
        filename: "Taxonomy in Next.js App Router",
        code: `// ─── SERVER STATE in Server Components ───────────────────────
// fetch() directly — no React Query, no Zustand
export default async function UsersPage() {
  const users = await usersService.getAll(); // Direct async call
  return <UserList users={users} />;
}

// ─── SERVER STATE in Client Components ───────────────────────
// Need to fetch after interaction? Use React Query
'use client';
export function UserSearch() {
  const [query, setQuery] = useState('');
  const { data: users } = useQuery({
    queryKey: ['users', 'search', query],
    queryFn: () => usersService.search(query),
    enabled: query.length > 2,
  });
  // ...
}

// ─── SHARED STATE ─────────────────────────────────────────────
// UI state only — no API data
'use client';
export function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useAppStore();
  return (
    <aside className={sidebarOpen ? 'w-64' : 'w-0'}>
      <button onClick={toggleSidebar}>Toggle</button>
    </aside>
  );
}`,
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
    seeAlso: [
      { slug: "server-state", label: "Server state → React Query" },
      { slug: "client-state", label: "Shared UI state → Zustand" },
    ],
    leadsTo: {
      slug: "why-react-query",
      teaser: "Tau kapan pakai apa. Sekarang kenapa React Query, bukan useEffect + fetch?",
    },
  },

  "custom-hooks": {
    slug: "custom-hooks",
    contentType: "recipe",
    title: "Custom Hooks",
    breadcrumbCategory: "Foundations",
    description: "The boundary between logic and rendering. When to extract a hook, what the rules are, and how to avoid the most common mistake.",
    lastUpdated: "Mar 17, 2026",
    principle: {
      text: "A custom hook is not just a function that starts with 'use' — it is a boundary between logic and rendering. The component handles what the user sees. The hook handles how data gets there. When you separate these two concerns, components become easier to read, logic becomes easier to test, and both become easier to change independently.",
      tip: "If you would write a unit test for the logic, it belongs in a hook. If you would write a component test for it, it belongs in the JSX.",
    },
    rules: [
      {
        title: "Name starts with 'use'",
        description: "This is not just a convention — React uses it to enforce the rules of hooks. A function starting with 'use' is treated as a hook.",
      },
      {
        title: "Extract when logic repeats",
        description: "If the same stateful logic appears in two components, extract it to a hook. Do not copy-paste hooks between components.",
      },
      {
        title: "Extract when logic is complex",
        description: "If a component has more than one useEffect, multiple useState calls, or complex derived state — that logic belongs in a hook.",
      },
      {
        title: "Hooks are not global state",
        description: "Each component that calls a hook gets its own isolated instance. Hooks do not share state between components unless backed by a store or context.",
      },
    ],
    pattern: {
      filename: "hooks/useDebounce.ts — logic extracted from component",
      code: `// ❌ Before — logic mixed into component
function SearchInput() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Component is doing too much
  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}

// ✅ After — logic extracted to a hook
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

// Component is now focused on rendering only
function SearchInput() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}`,
    },
    implementation: {
      nextjs: {
        description: "In Next.js, hooks can only run in Client Components. If a hook uses browser APIs, add 'use client' to the component that calls it — not to the hook file itself.",
        filename: "shared/hooks/useDebounce.ts",
        code: `// The hook itself has no 'use client' — it is framework-agnostic
import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

// The component that calls it gets 'use client'
// features/cookbook/components/SearchInput.tsx
'use client';

import { useDebounce } from '@/shared/hooks/useDebounce';

export function SearchInput({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  return (
    <input
      value={query}
      onChange={e => setQuery(e.target.value)}
      placeholder="Search recipes..."
    />
  );
}`,
      },
      vite: {
        description: "In Vite, hooks work the same way with no SSR considerations. Co-locate feature-specific hooks inside the feature folder.",
        filename: "shared/hooks/useDebounce.ts",
        code: `import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

// Usage in a component
// features/cookbook/components/SearchInput.tsx
import { useState, useEffect } from 'react';
import { useDebounce } from '@/shared/hooks/useDebounce';

export function SearchInput({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  return (
    <input
      value={query}
      onChange={e => setQuery(e.target.value)}
      placeholder="Search recipes..."
    />
  );
}`,
      },
    },
    contributor: { name: "Singgih Budi Purnadi", role: "Frontend & Mobile Developer" },
    leadsTo: {
      slug: "component-splitting",
      teaser: "Hooks extracted. Tapi component masih 400 baris?",
    },
  },

  "component-splitting": {
    slug: "component-splitting",
    contentType: "recipe",
    title: "Component Splitting",
    breadcrumbCategory: "Foundations",
    lastUpdated: "Mar 2026",
    description:
      "How to break a 400-line component into focused pieces — using composition and custom hooks together to split UI and logic the right way.",
    principle: {
      text: "A component should do one thing. When a file grows past 200 lines, it's doing too much — mixing layout, state logic, and side effects in one place. Split by extracting custom hooks for logic and child components for UI sections. The parent becomes a thin orchestrator.",
      tip: "Don't split too early. Wait until the component has clear seams — distinct state groups, independent UI sections, or reusable logic. Premature splitting creates unnecessary indirection.",
    },
    rules: [
      { title: "Split by responsibility", description: "Each child component handles one visual section. Each custom hook handles one piece of logic." },
      { title: "Parent orchestrates", description: "After splitting, the parent component connects hooks to child components via props. It should read like a table of contents." },
      { title: "200-line signal", description: "If a component file exceeds 200 lines, look for split opportunities. Not a hard rule — but a reliable signal." },
      { title: "Co-locate splits", description: "Keep extracted components and hooks in the same feature folder. Don't scatter them across the project." },
    ],
    pattern: {
      filename: "features/users/components/UserDashboard.tsx",
      code: `// BEFORE: 400-line monolith
// function UserDashboard() {
//   const [users, setUsers] = useState([]);
//   const [search, setSearch] = useState('');
//   const [page, setPage] = useState(1);
//   useEffect(() => { fetch... }, [search, page]);
//   // ... 350 more lines of mixed logic and JSX
// }

// AFTER: Split into hooks + components

// 1. Extract logic → custom hooks
// hooks/useUserSearch.ts
// hooks/useUserPagination.ts

// 2. Extract UI → child components
// components/UserSearchBar.tsx
// components/UserTable.tsx
// components/UserPagination.tsx

// 3. Parent orchestrates
export function UserDashboard() {
  const { users, isLoading } = useUserSearch();
  const { page, setPage, totalPages } = useUserPagination();

  return (
    <div>
      <UserSearchBar />
      <UserTable users={users} isLoading={isLoading} />
      <UserPagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}`,
    },
    implementation: {
      nextjs: {
        description:
          "In Next.js, splitting also lets you mark leaf components as Server Components when they don't need interactivity, reducing client bundle size.",
        filename: "features/users/components/UserDashboard.tsx",
        code: `"use client";

import { UserSearchBar } from "./UserSearchBar";
import { UserTable } from "./UserTable";
import { UserPagination } from "./UserPagination";
import { useUserSearch } from "../hooks/useUserSearch";

export function UserDashboard() {
  const { users, isLoading, error } = useUserSearch();

  if (error) return <ErrorState error={error} />;

  return (
    <section className="space-y-6">
      <UserSearchBar />
      <UserTable users={users} isLoading={isLoading} />
      <UserPagination />
    </section>
  );
}`,
      },
      vite: {
        description:
          "Same splitting pattern in Vite — extract hooks for logic, child components for UI sections, parent orchestrates.",
        filename: "features/users/components/UserDashboard.tsx",
        code: `import { UserSearchBar } from "./UserSearchBar";
import { UserTable } from "./UserTable";
import { UserPagination } from "./UserPagination";
import { useUserSearch } from "../hooks/useUserSearch";

export function UserDashboard() {
  const { users, isLoading, error } = useUserSearch();

  if (error) return <ErrorState error={error} />;

  return (
    <section className="space-y-6">
      <UserSearchBar />
      <UserTable users={users} isLoading={isLoading} />
      <UserPagination />
    </section>
  );
}`,
      },
    },
    contributor: { name: "Singgih Budi Purnadi", role: "Frontend & Mobile Developer" },
    leadsTo: {
      slug: "services-layer",
      teaser: "fetch() ada di 12 component. API berubah? Fix 12 tempat.",
    },
  },
};

export function getRecipeDetail(slug: string): RecipeDetail | null {
  return RECIPE_DETAILS[slug] ?? null;
}
