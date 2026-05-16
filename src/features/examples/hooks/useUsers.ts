import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { usersService, type GetUsersParams } from "@/lib/services/users";

export function useUsers(params: GetUsersParams = {}) {
  return useQuery({
    queryKey: queryKeys.users.list(params as Record<string, unknown>),
    queryFn: () => usersService.getAll(params),
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev,
  });
}
