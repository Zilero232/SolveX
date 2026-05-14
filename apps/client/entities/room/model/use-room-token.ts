import { useQuery } from '@tanstack/react-query';

import { fetchLiveKitToken } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

import type { RoomTokenCache } from '../lib/cache';

import { readRoomTokenCache, writeRoomTokenCache } from '../lib/cache';

interface Params {
  roomName: string | null;
}

export const useRoomToken = ({ roomName }: Params) =>
  useQuery({
    queryKey: QUERY_KEYS.livekitToken(roomName),
    enabled: !!roomName,
    staleTime: Number.POSITIVE_INFINITY,
    retry: false,
    queryFn: async (): Promise<RoomTokenCache> => {
      if (!roomName) throw new Error('Room name required');

      const cached = readRoomTokenCache(roomName);

      if (cached) return cached;

      const result = await fetchLiveKitToken({ room: roomName });

      const value: RoomTokenCache = { token: result.token, url: result.url };

      writeRoomTokenCache(roomName, value);

      return value;
    },
  });
