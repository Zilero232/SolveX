import type { CreateRoomRequest, Room } from '@chatovo/schemas/rooms';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uniqueBy } from 'remeda';

import { createRoom } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const useCreateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation<Room, Error, CreateRoomRequest>({
    mutationFn: createRoom,
    onSuccess: (room) => {
      queryClient.setQueryData<Room[]>(QUERY_KEYS.rooms(), (prev) =>
        uniqueBy([room, ...(prev ?? [])], (r) => r.id),
      );
    },
  });
};
