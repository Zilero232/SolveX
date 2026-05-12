import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteRoom, type Room } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const useDeleteRoom = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteRoom,
    onSuccess: (_data, id) => {
      queryClient.setQueryData<Room[]>(QUERY_KEYS.rooms(), (prev) =>
        prev ? prev.filter((r) => r.id !== id) : prev,
      );
    },
  });
};
