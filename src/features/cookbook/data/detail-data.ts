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
  lastUpdated: string;
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
    lastUpdated: "Feb 26, 2026",
    contributor: { name: "Singgih Budi Purnadi", role: "Frontend & Mobile Developer" },
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
    lastUpdated: "Feb 26, 2026",
    contributor: { name: "Singgih Budi Purnadi", role: "Frontend & Mobile Developer" },
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
    lastUpdated: "Feb 26, 2026",
    contributor: { name: "Singgih Budi Purnadi", role: "Frontend & Mobile Developer" },
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
    lastUpdated: "Feb 26, 2026",
    contributor: { name: "Singgih Budi Purnadi", role: "Frontend & Mobile Developer" },
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
    lastUpdated: "Feb 26, 2026",
    contributor: { name: "Singgih Budi Purnadi", role: "Frontend & Mobile Developer" },
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
    lastUpdated: "Feb 26, 2026",
    contributor: { name: "Singgih Budi Purnadi", role: "Frontend & Mobile Developer" },
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
    lastUpdated: "Feb 26, 2026",
    contributor: { name: "Singgih Budi Purnadi", role: "Frontend & Mobile Developer" },
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
    lastUpdated: "Feb 26, 2026",
    contributor: { name: "Singgih Budi Purnadi", role: "Frontend & Mobile Developer" },
    demoKey: "table",
  },

  "data-visualization": {
    slug: "data-visualization",
    title: "Data Visualization",
    breadcrumbCategory: "Data Viz",
    description:
      "Composable chart components using Recharts with responsive containers, custom tooltips, and clean data transformation patterns.",
    principle: {
      text: "Charts are pure functions of data. Keep transformation logic outside components — map raw API responses to the exact shape your chart library expects before they reach the JSX. This keeps components declarative and makes the data pipeline independently testable.",
      tip: "Always wrap charts in a ResponsiveContainer from Recharts. Hard-coded pixel widths break on resize and cause layout shifts on mobile.",
    },
    rules: [
      { title: "Transform Before Render", description: "Derive chart-ready data with useMemo. Never transform inside JSX or inside the chart component itself." },
      { title: "ResponsiveContainer Always", description: "Every chart must be wrapped in <ResponsiveContainer width='100%' height={300}>. Never pass fixed pixel widths." },
      { title: "Custom Tooltip Component", description: "Build a typed CustomTooltip component instead of using Recharts' default. Gives full styling control and type safety." },
      { title: "Skeleton on Loading", description: "Show a pulse skeleton at the same dimensions as the chart. Avoid layout shift when data loads." },
    ],
    pattern: {
      filename: "hooks/useChartData.ts",
      code: `import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

type ChartPoint = { month: string; revenue: number; orders: number };

export function useRevenueChart(range: string) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['metrics', 'revenue', range],
    queryFn: () => fetchRevenue(range),
    staleTime: 1000 * 60 * 5,
  });

  const chartData = useMemo<ChartPoint[]>(() => {
    if (!data) return [];
    return data.map((d) => ({
      month: formatMonth(d.date),
      revenue: d.total_revenue,
      orders: d.order_count,
    }));
  }, [data]);

  return { chartData, isLoading, isError };
}`,
    },
    implementation: {
      nextjs: {
        description:
          "In Next.js App Router, import Recharts components only inside Client Components. Use dynamic import with ssr: false to prevent hydration mismatches from window-dependent chart code.",
        filename: "components/charts/RevenueChart.tsx",
        code: `'use client';

import {
  ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import { useRevenueChart } from '@/hooks/useChartData';

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-white p-3 shadow-lg text-sm">
      <p className="font-semibold text-slate-900">{label}</p>
      <p className="text-primary">\${payload[0]?.value?.toLocaleString()}</p>
    </div>
  );
}

export function RevenueChart({ range }: { range: string }) {
  const { chartData, isLoading } = useRevenueChart(range);

  if (isLoading) return <div className="h-[300px] animate-pulse rounded-xl bg-slate-100" />;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip content={<CustomTooltip />} />
        <Line type="monotone" dataKey="revenue" stroke="#4628F1" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}`,
      },
      vite: {
        description:
          "In Vite, Recharts works out of the box with no SSR concerns. The same pattern applies — transform data with useMemo, wrap in ResponsiveContainer.",
        filename: "components/charts/RevenueChart.tsx",
        code: `import {
  ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import { useRevenueChart } from '@/hooks/useChartData';

export function RevenueChart({ range }: { range: string }) {
  const { chartData, isLoading } = useRevenueChart(range);

  if (isLoading) return <div className="h-[300px] animate-pulse rounded-xl bg-slate-100" />;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Line type="monotone" dataKey="revenue" stroke="#4628F1" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}`,
      },
    },
    lastUpdated: "Feb 26, 2026",
    contributor: { name: "Singgih Budi Purnadi", role: "Frontend & Mobile Developer" },
  },

  "folder-structure": {
    slug: "folder-structure",
    title: "Folder Structure",
    breadcrumbCategory: "Foundations",
    description: "A feature-based folder structure so you always know where a file goes — and why it belongs there.",
    lastUpdated: "2026-03-01",
    principle: {
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
│   └── users/
│       ├── components/   # UI specific to this feature
│       ├── hooks/        # Data fetching and logic hooks
│       ├── stores/       # Zustand stores scoped to this feature
│       └── index.ts      # Public API — only export what others need
├── shared/           # Truly cross-cutting code
│   ├── components/   # Used by 2+ features (ErrorBoundary, LoadingState)
│   ├── hooks/        # Reusable hooks (useDebounce, useLocalStorage)
│   ├── stores/       # App-wide stores (theme, sidebar)
│   ├── types/        # Shared TypeScript types (API responses, common)
│   └── utils/        # Utility functions (cn, formatters, validators)
├── lib/              # External service clients (API, query client)
└── ui/               # Design system primitives (Button, Input, etc.)`,
    },
    implementation: {
      nextjs: {
        description: "Next.js adds the app/ directory for file-based routing. Route logic (pages) lives in app/, all business logic stays in features/. See the starter template at github.com/sindev08/react-principles-nextjs.",
        filename: "src/app/ — routing only",
        code: `src/
├── app/
│   ├── layout.tsx          # Root layout (fonts, providers, metadata)
│   ├── page.tsx            # Home page — thin, imports from features/
│   ├── providers.tsx       # Client-side context providers
│   └── globals.css         # Global styles and Tailwind imports
├── features/
│   └── users/              # CRUD users feature
│       ├── components/     # UserList, UserForm, UserCard
│       ├── hooks/          # useGetUsers, useCreateUser
│       ├── stores/         # useUserStore
│       └── index.ts        # Public API barrel export
├── shared/
│   ├── components/         # ErrorBoundary, LoadingState, EmptyState
│   ├── hooks/              # useDebounce, useLocalStorage
│   ├── types/              # API response types
│   └── utils/              # cn(), formatters
├── lib/                    # API client, query client, endpoints
└── ui/                     # Button, Card, Dialog, Input`,
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
  },

  "typescript-for-react": {
    slug: "typescript-for-react",
    title: "TypeScript for React",
    breadcrumbCategory: "Foundations",
    description: "How to type component props, event handlers, and hooks correctly. The contracts that prevent silent bugs.",
    lastUpdated: "2026-03-01",
    principle: {
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
  },

  "component-anatomy": {
    slug: "component-anatomy",
    title: "Component Anatomy",
    breadcrumbCategory: "Foundations",
    description: "The consistent internal structure every component follows — imports, types, constants, function, export.",
    lastUpdated: "2026-03-01",
    principle: {
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
        description: "In Next.js, mark client components explicitly with 'use client' — it goes above all imports as the very first line. See the annotated Button component in the starter template: github.com/sindev08/react-principles-nextjs → src/ui/Button.tsx",
        filename: "ui/Button.tsx — from react-principles-nextjs starter",
        code: `// 'use client' goes ABOVE imports if the component is a Client Component
// (Button doesn't need it — no hooks or browser APIs)

// 1. IMPORTS — React → external → internal (@/) → relative (./)
import { type ButtonHTMLAttributes } from 'react';
import { cn } from '@/shared/utils';

// 2. TYPES — props interface first, then supporting types
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

// 3. CONSTANTS — static, never changes based on props
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-zinc-900 text-white hover:bg-zinc-800 ...',
  secondary: 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 ...',
  // ...
};
const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

// 4. COMPONENT — named export, never default
export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  return (
    <button className={cn(BASE_CLASSES, VARIANT_CLASSES[variant], SIZE_CLASSES[size], className)} {...props}>
      {children}
    </button>
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
  },

  "oauth-flow": {
    slug: "oauth-flow",
    title: "OAuth Flow",
    breadcrumbCategory: "Auth Flows",
    description:
      "Social login with Next-Auth v5 covering the full OAuth 2.0 cycle: provider setup, callback handling, session management, and protected routes.",
    principle: {
      text: "OAuth delegates authentication to a trusted provider — you never handle passwords. The key is understanding the two-step flow: (1) redirect user to provider, (2) exchange the authorization code for tokens on your server. Never exchange codes on the client.",
      tip: "Store the minimal session payload on the JWT — just userId and role. Fetch full user data from your DB on demand. Bloated JWTs slow down every request.",
    },
    rules: [
      { title: "Server-Side Code Exchange", description: "The OAuth code-for-token exchange must happen on the server. Never expose your client_secret to the browser." },
      { title: "Minimal JWT Payload", description: "Only store userId and role in the JWT. Everything else (name, avatar, permissions) should be fetched from your DB when needed." },
      { title: "Protect Routes at Middleware Level", description: "Use Next.js middleware to check session before the page renders. Avoids flash of unauthenticated content." },
      { title: "Handle Token Refresh", description: "Implement silent refresh: detect expiry in the JWT callback and call the provider's token endpoint to get a new access token." },
    ],
    pattern: {
      filename: "auth.ts",
      code: `import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    jwt({ token, account, profile }) {
      // Persist minimal data to JWT on first sign-in
      if (account) {
        token.userId = profile?.sub;
        token.provider = account.provider;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.userId as string;
      return session;
    },
  },
});`,
    },
    implementation: {
      nextjs: {
        description:
          "Next-Auth v5 integrates natively with App Router. Expose the handlers at a catch-all route, use the auth() helper in Server Components, and protect pages via middleware.",
        filename: "middleware.ts",
        code: `import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isAuthenticated = !!req.auth;
  const isProtected = req.nextUrl.pathname.startsWith('/dashboard');

  if (isProtected && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
});

export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*'],
};

// app/api/auth/[...nextauth]/route.ts
import { handlers } from '@/auth';
export const { GET, POST } = handlers;

// app/dashboard/page.tsx (Server Component)
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect('/login');
  return <Dashboard user={session.user} />;
}`,
      },
      vite: {
        description:
          "In a Vite SPA, OAuth requires a backend callback endpoint. Use a lightweight Express/Hono server to handle the code exchange, then redirect back to the frontend with a session cookie.",
        filename: "server/auth.ts",
        code: `// Hono backend — handles OAuth callback
import { Hono } from 'hono';
import { setCookie } from 'hono/cookie';

const app = new Hono();

app.get('/auth/callback/github', async (c) => {
  const code = c.req.query('code');
  if (!code) return c.redirect('/login?error=missing_code');

  // Exchange code for access token (server-side only)
  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });
  const { access_token } = await tokenRes.json();

  // Create session and set cookie
  const sessionToken = await createSession(access_token);
  setCookie(c, 'session', sessionToken, { httpOnly: true, sameSite: 'Lax' });

  return c.redirect('/dashboard');
});`,
      },
    },
    lastUpdated: "Feb 26, 2026",
    contributor: { name: "Singgih Budi Purnadi", role: "Frontend & Mobile Developer" },
  },

  "useeffect-render-cycle": {
    slug: "useeffect-render-cycle",
    title: "useEffect & Render Cycle",
    breadcrumbCategory: "Foundations",
    description: "When effects run, why the dependency array exists, and how to clean up after yourself.",
    lastUpdated: "2026-03-01",
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
        description: "In Next.js, window is not available on the server. Use 'use client' and guard browser API access. See all three hooks in the starter template: github.com/sindev08/react-principles-nextjs → src/shared/hooks/",
        filename: "shared/hooks/useDebounce.ts — from react-principles-nextjs starter",
        code: `'use client';

import { useEffect, useState } from 'react';

// Effect pattern: setTimeout with cleanup
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set a timer to update after the delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: clear the timer if value changes before it fires
    // This is what makes it a "debounce" — rapid changes reset the timer
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]); // ✅ Honest dependencies

  return debouncedValue;
}

// Also in the starter:
// useMediaQuery — useSyncExternalStore with matchMedia (event listener pattern)
// useLocalStorage — cross-tab sync via storage event (cleanup pattern)`,
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
  },

  "component-composition": {
    slug: "component-composition",
    title: "Component Composition",
    breadcrumbCategory: "Foundations",
    description: "How components combine and communicate — children props, slot patterns, and why composition beats deep prop drilling.",
    lastUpdated: "2026-03-01",
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
        description: "In Next.js, composition works the same way. Server Components can pass Client Components as children — this is how you keep server/client boundaries clean. See the starter template: github.com/sindev08/react-principles-nextjs → src/shared/components/PageLayout.tsx and src/ui/Card.tsx",
        filename: "shared/components/PageLayout.tsx — from react-principles-nextjs starter",
        code: `// Named slots pattern — multiple injection points via named props
interface PageLayoutProps {
  header?: React.ReactNode;   // slot for navbar/header
  sidebar?: React.ReactNode;  // slot for sidebar navigation
  children: React.ReactNode;  // main content area
}

export function PageLayout({ header, sidebar, children }: PageLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {header && <header className="border-b">{header}</header>}
      <div className="flex flex-1">
        {sidebar && <aside className="w-64 shrink-0 border-r">{sidebar}</aside>}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

// Usage in a Server Component page:
export default async function UsersPage() {
  return (
    <PageLayout
      header={<Navbar />}
      sidebar={<Sidebar items={menuItems} />}
    >
      {/* Client Component as children — clean server/client boundary */}
      <UserList />
    </PageLayout>
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
  },

  "services-layer": {
    slug: "services-layer",
    title: "Services Layer",
    breadcrumbCategory: "Foundations",
    description: "How to organize all backend communication in one place — so when an API changes, you fix it in one file, not twenty.",
    lastUpdated: "2026-03-01",
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
        description: "In Next.js App Router, service functions can be called directly in Server Components. For Client Components, wrap them in React Query hooks. See the full chain in the starter: github.com/sindev08/react-principles-nextjs → src/lib/",
        filename: "lib/services/users.ts — from react-principles-nextjs starter",
        code: `// lib/api-client.ts — fetch-based factory (NOT axios)
import { createApiClient } from './api-client';
export const api = createApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? 'https://dummyjson.com',
});

// lib/services/users.ts — pure API communication
import { api } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import type { User, UsersResponse } from '@/shared/types/user';

export const usersService = {
  getAll: (params?: { limit?: number; skip?: number }): Promise<UsersResponse> =>
    api.get<UsersResponse>(ENDPOINTS.users.list, { params }),
  getById: (id: number): Promise<User> =>
    api.get<User>(ENDPOINTS.users.detail(id)),
  search: (q: string): Promise<UsersResponse> =>
    api.get<UsersResponse>(ENDPOINTS.users.search, { params: { q } }),
};

// features/users/hooks/useUsers.ts — hook wraps service with React Query
'use client';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';

export function useUsers(params?: { limit?: number; skip?: number }) {
  return useQuery({
    queryKey: queryKeys.users.list(params ?? {}),
    queryFn: () => usersService.getAll(params),
  });
}`,
      },
      vite: {
        description: "In Vite, the pattern is identical. The services layer is framework-agnostic — the same createApiClient factory works in both Next.js and Vite projects.",
        filename: "lib/services/users.ts + hooks usage",
        code: `// lib/api.ts — same createApiClient factory, different env var
import { createApiClient } from './api-client';
export const api = createApiClient({
  baseUrl: import.meta.env.VITE_API_URL ?? 'https://dummyjson.com',
});

// lib/services/users.ts — identical to Next.js version
import { api } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import type { User, UsersResponse } from '@/shared/types/user';

export const usersService = {
  getAll: (params?: { limit?: number; skip?: number }): Promise<UsersResponse> =>
    api.get<UsersResponse>(ENDPOINTS.users.list, { params }),
  getById: (id: number): Promise<User> =>
    api.get<User>(ENDPOINTS.users.detail(id)),
};

// features/users/hooks/useUsers.ts — hook wraps service
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';

export function useUsers(params?: { limit?: number; skip?: number }) {
  return useQuery({
    queryKey: queryKeys.users.list(params ?? {}),
    queryFn: () => usersService.getAll(params),
    staleTime: 5 * 60 * 1000,
  });
}`,
      },
    },
    contributor: { name: "Singgih Budi Purnadi", role: "Frontend & Mobile Developer" },
  },

  "state-taxonomy": {
    slug: "state-taxonomy",
    title: "State Taxonomy",
    breadcrumbCategory: "Foundations",
    description: "Three categories of state — local, shared, and server — and exactly which tool handles each one.",
    lastUpdated: "2026-03-01",
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
  },

  "custom-hooks": {
    slug: "custom-hooks",
    title: "Custom Hooks",
    breadcrumbCategory: "Foundations",
    description: "The boundary between logic and rendering. When to extract a hook, what the rules are, and how to avoid the most common mistake.",
    lastUpdated: "2026-03-01",
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
        description: "In Next.js, hooks that use browser APIs need 'use client'. Feature-specific hooks live in the feature folder, shared hooks in shared/. See the starter: github.com/sindev08/react-principles-nextjs → src/features/users/hooks/",
        filename: "features/users/hooks/useUsers.ts — from react-principles-nextjs starter",
        code: `'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import { queryKeys } from '@/lib/query-keys';
import type { UsersResponse } from '@/shared/types/user';

// Feature hook — encapsulates query key, endpoint, and response type
// Components just call useUsers() and get typed data back
export function useUsers(params?: { limit?: number; skip?: number }) {
  return useQuery({
    queryKey: queryKeys.users.list(params ?? {}),
    queryFn: () => api.get<UsersResponse>(ENDPOINTS.users.list, {
      params: { limit: params?.limit, skip: params?.skip },
    }),
  });
}

// Also in the starter:
// features/users/hooks/useCreateUser.ts — mutation with cache invalidation
// shared/hooks/useDebounce.ts — generic debounce (logic extraction)
// shared/hooks/useMediaQuery.ts — browser API sync (useSyncExternalStore)
// shared/hooks/useLocalStorage.ts — storage sync with cross-tab support`,
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
  },
};

export function getRecipeDetail(slug: string): RecipeDetail | null {
  return RECIPE_DETAILS[slug] ?? null;
}
