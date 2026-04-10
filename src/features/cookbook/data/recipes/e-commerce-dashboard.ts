import type { RecipeDetail } from "../types";

export const eCommerceDashboard: RecipeDetail = {
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
};
