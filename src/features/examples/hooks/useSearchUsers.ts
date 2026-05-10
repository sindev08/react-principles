import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/shared/hooks";
import { queryKeys } from "@/lib/query-keys";
import { usersService } from "@/lib/services/users";

export function useSearchUsers(query: string) {
  const debouncedQuery = useDebounce(query, 300);

  return useQuery({
    queryKey: queryKeys.users.search(debouncedQuery),
    queryFn: () => usersService.search({ q: debouncedQuery }),
    enabled: debouncedQuery.length > 0,
    staleTime: 1000 * 60 * 5,
  });
}
