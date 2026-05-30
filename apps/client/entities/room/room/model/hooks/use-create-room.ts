import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uniqueBy } from 'remeda';
import { createRoom } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';
import type { Room } from '@chatovo/schemas';

export const useCreateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRoom,
    onSuccess: (room) => {
      queryClient.setQueryData<Room[]>(QUERY_KEYS.rooms(), (prev) => {
        const next: Room[] = [room, ...(prev ?? [])];

        return uniqueBy(next, (r) => r.id);
      });
    },
  });
};
