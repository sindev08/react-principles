import type { RecipeDetail } from "../types";

export const serverState: RecipeDetail = {
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
import { usersService, type GetUsersParams } from '@/lib/services/users';

export function useUsers(params: GetUsersParams = {}) {
  return useQuery({
    queryKey: queryKeys.users.list(params),
    queryFn: () => usersService.getAll(params),
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
import { usersService } from '@/lib/services/users';

export default async function UsersPage() {
  const qc = getQueryClient();
  await qc.prefetchQuery({
    queryKey: queryKeys.users.list({}),
    queryFn: () => usersService.getAll({}),
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
  const { data, isLoading, isError } = useUsers({ limit: 10, skip: 0 });

  if (isLoading) return <LoadingState rows={5} />;
  if (isError) return <p>Failed to load users.</p>;

  return <UserList users={data.users} total={data.total} skip={data.skip} limit={data.limit} />;
}`,
    },
  },
  lastUpdated: "Feb 26, 2026",
  contributor: { name: "Singgih Budi Purnadi", role: "Frontend & Mobile Developer" },
  demoKey: "react-query",
};
