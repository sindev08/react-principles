import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { usersService } from "@/lib/services/users";
import type { UpdateUserInput } from "@/shared/types/user";

export function useUpdateUser(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserInput) => usersService.update(id, data),
    onSuccess: (updatedUser) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.setQueryData(queryKeys.users.detail(id), updatedUser);
    },
  });
}
