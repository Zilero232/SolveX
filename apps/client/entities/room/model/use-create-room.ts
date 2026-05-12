import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuthStore } from '@/entities/user';
import { type CreateRoomInput, createRoom, type Room } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const useCreateRoom = () => {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id);

  return useMutation<Room, Error, CreateRoomInput>({
    mutationFn: async (input) => {
      if (!userId) throw new Error('Not authenticated');

      return createRoom(input, userId);
    },
    onSuccess: (room) => {
      queryClient.setQueryData<Room[]>(QUERY_KEYS.rooms(), (prev) => {
        if (!prev) return [room];

        if (prev.some((r) => r.id === room.id)) return prev;

        return [room, ...prev];
      });
    },
  });
};
