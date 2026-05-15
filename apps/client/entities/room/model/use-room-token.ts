import { useMutation } from '@tanstack/react-query';

import { fetchLiveKitToken } from '@/shared/api';

interface FetchInput {
  password?: string;
  roomId: string;
}

interface RoomToken {
  token: string;
  url: string;
}

export const useRoomToken = () =>
  useMutation<RoomToken, Error, FetchInput>({
    mutationFn: async ({ roomId, password }) => {
      const { token, url } = await fetchLiveKitToken({ roomId, password });

      return { token, url };
    },
  });
