import { useMutation } from '@tanstack/react-query';

import { fetchLiveKitToken } from '@/shared/api';

import type { RoomTokenCache } from '../lib/cache';

import { readRoomTokenCache, writeRoomTokenCache } from '../lib/cache';

interface FetchInput {
  password?: string;
  roomId: string;
}

export const useRoomToken = () =>
  useMutation<RoomTokenCache, Error, FetchInput>({
    mutationFn: async ({ roomId, password }) => {
      const cached = readRoomTokenCache(roomId);

      if (cached && !password) return cached;

      const { token, url } = await fetchLiveKitToken({ roomId, password });

      const value: RoomTokenCache = { token, url };

      writeRoomTokenCache(roomId, value);

      return value;
    },
  });
