export interface RuleItem {
  title: string;
  description: string;
}

export interface ImplTab {
  description: string;
  filename: string;
  code: string;
}

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
  demoHref?: string;
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
    demoHref: "/react-query",
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
    demoHref: "/forms",
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
    demoHref: "/state",
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
    demoHref: "/react-query",
  },
};

export function getRecipeDetail(slug: string): RecipeDetail | null {
  return RECIPE_DETAILS[slug] ?? null;
}
