import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { CreateRoomInput, Room } from '@/shared/api';

import { createRoom } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const useCreateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation<Room, Error, CreateRoomInput>({
    mutationFn: createRoom,
    onSuccess: (room) => {
      queryClient.setQueryData<Room[]>(QUERY_KEYS.rooms(), (prev) => {
        if (!prev) return [room];

        if (prev.some((r) => r.id === room.id)) return prev;

        return [room, ...prev];
      });
    },
  });
};
