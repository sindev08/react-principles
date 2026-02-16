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

export interface RecipeDetail {
  slug: string;
  title: string;
  breadcrumbCategory: string;
  description: string;
  principle: { text: string; tip: string };
  rules: RuleItem[];
  pattern: { filename: string; code: string };
  implementation: { nextjs: ImplTab; vite: ImplTab };
  contributor: { name: string; role: string };
  demoKey?: DemoKey;
}

export const RECIPE_DETAILS: Record<string, RecipeDetail> = {
  "e-commerce-dashboard": {
    slug: "e-commerce-dashboard",
    title: "E-commerce Dashboard",
    breadcrumbCategory: "Dashboards",
    description:
      "A full-featured admin panel using TanStack Query for server state and TanStack Table for data rendering with real-time updates.",
    principle: {
      text: "Dashboard architecture separates data fetching from UI rendering. TanStack Query manages all server state — metrics, orders, inventory — while TanStack Table handles display logic. This eliminates the need for manual caching and pagination state.",
      tip: "Centralize all query keys in a factory file. This prevents key collisions and makes invalidation predictable across your entire dashboard.",
    },
    rules: [
      { title: "Query Key Factory", description: "Use hierarchical array keys: [\"orders\", \"list\", filters] for precise cache control." },
      { title: "Separate Data Layers", description: "Keep fetch functions outside components. Services folder → custom hooks → UI." },
      { title: "Prefetch on Hover", description: "Prefetch linked records on hover to make navigation feel instant." },
      { title: "Optimistic UI", description: "Apply mutations optimistically and roll back on error for a snappy user experience." },
    ],
    pattern: {
      filename: "hooks/queries/useDashboardMetrics.ts",
      code: `import { useQuery } from '@tanstack/react-query';
import { dashboardKeys } from '@/lib/query-keys';

export const useDashboardMetrics = (range: DateRange) => {
  return useQuery({
    queryKey: dashboardKeys.metrics(range),
    queryFn: () => fetchMetrics(range),
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: (prev) => prev,
  });
};`,
    },
    implementation: {
      nextjs: {
        description:
          "In Next.js App Router, prefetch dashboard data in the server component and pass it to the client via HydrationBoundary for instant initial render.",
        filename: "app/dashboard/page.tsx",
        code: `import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/get-query-client';

export default async function DashboardPage() {
  const qc = getQueryClient();
  await qc.prefetchQuery({
    queryKey: dashboardKeys.metrics('7d'),
    queryFn: () => fetchMetrics('7d'),
  });
  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <DashboardClient />
    </HydrationBoundary>
  );
}`,
      },
      vite: {
        description:
          "In Vite, wrap your app in QueryClientProvider and use the custom hook directly in client components. Queries run on mount.",
        filename: "pages/DashboardPage.tsx",
        code: `import { useDashboardMetrics } from '@/hooks/queries/useDashboardMetrics';

export function DashboardPage() {
  const { data, isLoading, isError } = useDashboardMetrics('7d');

  if (isLoading) return <MetricsSkeleton />;
  if (isError) return <ErrorAlert />;

  return <MetricsGrid data={data} />;
}`,
      },
    },
    contributor: { name: "Alex Rivera", role: "React Specialist" },
  },

  "saas-landing-page": {
    slug: "saas-landing-page",
    title: "SaaS Landing Page",
    breadcrumbCategory: "Landing Pages",
    description:
      "Optimized conversion funnels with component composition, SSG/ISR, and accessible form layouts built for maximum performance.",
    principle: {
      text: "Landing pages must be statically generated for SEO and performance. Use a section-based component architecture where each section is an independent, lazily-loaded unit. Avoid client-side data fetching for above-the-fold content.",
      tip: "Use ISR (Incremental Static Regeneration) for pricing and content sections that update occasionally without requiring a full rebuild.",
    },
    rules: [
      { title: "Atomic Section Components", description: "Each section (Hero, Features, Pricing) is a standalone component with no shared state." },
      { title: "Mobile-First CSS", description: "Design for 375px first. Scale up with sm:, md:, lg: breakpoints." },
      { title: "Static Generation", description: "Use generateStaticParams or SSG — never getServerSideProps — for landing pages." },
      { title: "Lazy Load Below Fold", description: "Dynamically import sections below the fold to reduce initial bundle size." },
    ],
    pattern: {
      filename: "components/landing/SectionFactory.tsx",
      code: `import dynamic from 'next/dynamic';

const SECTIONS = {
  hero: dynamic(() => import('./HeroSection')),
  features: dynamic(() => import('./FeaturesSection')),
  pricing: dynamic(() => import('./PricingSection')),
} as const;

export function SectionFactory({ type, props }: SectionProps) {
  const Section = SECTIONS[type];
  return <Section {...props} />;
}`,
    },
    implementation: {
      nextjs: {
        description: "Use Next.js static generation with revalidation for dynamic pricing data while keeping the page fast.",
        filename: "app/page.tsx",
        code: `export const revalidate = 3600; // ISR: revalidate hourly

export default async function LandingPage() {
  const pricing = await fetchPricingPlans();
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <PricingSection plans={pricing} />
      <CTASection />
    </>
  );
}`,
      },
      vite: {
        description: "In Vite, use React.lazy and Suspense boundaries to lazy-load sections and reduce initial bundle.",
        filename: "pages/LandingPage.tsx",
        code: `const PricingSection = lazy(() => import('./sections/PricingSection'));

export function LandingPage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <Suspense fallback={<PricingSkeleton />}>
        <PricingSection />
      </Suspense>
    </>
  );
}`,
      },
    },
    contributor: { name: "Maria Chen", role: "Frontend Architect" },
  },

  "authentication-flow": {
    slug: "authentication-flow",
    title: "Authentication Flow",
    breadcrumbCategory: "Auth Flows",
    description:
      "Secure login, signup, and token refresh patterns. Auth state lives in Zustand — never in React Query — with JWT and protected route handling.",
    principle: {
      text: "Authentication state is client state, not server state. It belongs in Zustand or Context, not React Query. The auth store manages tokens, user profile, and session status. API interceptors handle token refresh transparently.",
      tip: "Store only the minimum necessary in auth state. Token expiry, user ID, and roles. Fetch full user profile via React Query when needed.",
    },
    rules: [
      { title: "Never Store Sensitive Data in State", description: "Tokens live in httpOnly cookies or secure storage — never in React state or localStorage." },
      { title: "Centralize Interceptors", description: "One Axios/fetch interceptor handles 401 responses and token refresh for all API calls." },
      { title: "Separate Auth from UI", description: "AuthProvider wraps the app. UI components only call useAuth() — never touch tokens directly." },
      { title: "Route Protection at Layout", description: "Protect routes at the layout level, not inside individual pages." },
    ],
    pattern: {
      filename: "stores/useAuthStore.ts",
      code: `import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'auth-storage' },
  ),
);`,
    },
    implementation: {
      nextjs: {
        description: "Use Next.js Middleware to protect routes server-side before the page renders. Check the auth cookie on every request.",
        filename: "middleware.ts",
        code: `import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('auth-token');
  const isProtected = req.nextUrl.pathname.startsWith('/dashboard');

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  return NextResponse.next();
}`,
      },
      vite: {
        description: "Wrap protected routes in a PrivateRoute component that checks Zustand auth state and redirects unauthenticated users.",
        filename: "components/PrivateRoute.tsx",
        code: `import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';

export function PrivateRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}`,
      },
    },
    contributor: { name: "Jordan Kim", role: "Security Engineer" },
  },

  "api-integration": {
    slug: "api-integration",
    title: "API Integration",
    breadcrumbCategory: "API Integration",
    description:
      "Typed REST and GraphQL clients with interceptors, retry logic, and centralized error handling using React Query.",
    principle: {
      text: "All API calls flow through a single typed client layer. React Query wraps the client for caching and synchronization. Components never call fetch() directly — they use custom hooks that compose the query client and API client together.",
      tip: "Use Zod to validate API responses at the boundary. This catches backend contract violations early and ensures your types are always accurate.",
    },
    rules: [
      { title: "Single API Client Instance", description: "One Axios/fetch instance with all interceptors. Import it everywhere via a singleton." },
      { title: "Type All Responses", description: "Define TypeScript interfaces for every endpoint. Use Zod for runtime validation." },
      { title: "Centralized Error Handling", description: "Map API error codes to user-friendly messages in one place — not scattered in components." },
      { title: "Retry Transient Failures", description: "Configure React Query retry logic for 5xx errors. Never retry 4xx client errors." },
    ],
    pattern: {
      filename: "lib/api-client.ts",
      code: `import axios from 'axios';
import { z } from 'zod';

const apiClient = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });

export async function fetchTyped<T>(
  url: string,
  schema: z.ZodType<T>,
): Promise<T> {
  const { data } = await apiClient.get(url);
  return schema.parse(data);
}`,
    },
    implementation: {
      nextjs: {
        description: "In Next.js, use Route Handlers as a BFF (Backend for Frontend) layer to proxy external APIs and add auth headers server-side.",
        filename: "app/api/posts/route.ts",
        code: `import { NextResponse } from 'next/server';
import { postListSchema } from '@/lib/schemas';

export async function GET() {
  const res = await fetch(process.env.EXTERNAL_API + '/posts', {
    headers: { Authorization: \`Bearer \${process.env.API_SECRET}\` },
    next: { revalidate: 60 },
  });
  const data = postListSchema.parse(await res.json());
  return NextResponse.json(data);
}`,
      },
      vite: {
        description: "In Vite, call external APIs directly from custom hooks using the typed API client. Use environment variables for base URLs.",
        filename: "hooks/queries/usePosts.ts",
        code: `import { useQuery } from '@tanstack/react-query';
import { fetchTyped } from '@/lib/api-client';
import { postListSchema } from '@/lib/schemas';

export const usePosts = () =>
  useQuery({
    queryKey: ['posts', 'list'],
    queryFn: () => fetchTyped('/posts', postListSchema),
    staleTime: 1000 * 60,
  });`,
      },
    },
    contributor: { name: "Sam Osei", role: "API Architect" },
  },

  "server-state": {
    slug: "server-state",
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
    contributor: { name: "Alex Rivera", role: "React Specialist" },
    demoKey: "react-query",
  },

  "client-state": {
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
    contributor: { name: "Jordan Kim", role: "Security Engineer" },
    demoKey: "zustand",
  },

  "form-validation": {
    slug: "form-validation",
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
    contributor: { name: "Maria Chen", role: "Frontend Architect" },
    demoKey: "forms",
  },

  "data-tables": {
    slug: "data-tables",
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
    contributor: { name: "Sam Osei", role: "API Architect" },
    demoKey: "table",
  },
};

export function getRecipeDetail(slug: string): RecipeDetail | null {
  return RECIPE_DETAILS[slug] ?? null;
}
