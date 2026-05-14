import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { queryKeys } from "@/lib/query-keys";
import { usersService } from "@/lib/services/users";
import { UserList } from "@/features/examples/components/UserList";

export default async function ReactQueryPage() {
  const qc = getQueryClient();
  await qc.prefetchQuery({
    queryKey: queryKeys.users.list({}),
    queryFn: () => usersService.getAll({}),
  });

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">React Query Example</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Fetching and displaying users with TanStack React Query.
      </p>
      <div className="mt-8">
        <HydrationBoundary state={dehydrate(qc)}>
          <UserList />
        </HydrationBoundary>
      </div>
    </main>
  );
}
