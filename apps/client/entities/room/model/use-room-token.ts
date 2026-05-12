import { useQuery } from '@tanstack/react-query';

import { fetchLiveKitToken, getFreshAccessToken } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

import { type RoomTokenCache, readRoomTokenCache, writeRoomTokenCache } from '../lib/cache';

type Params = {
  roomName: string | null;
};

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

      const accessToken = await getFreshAccessToken();
      const result = await fetchLiveKitToken({ room: roomName }, accessToken);

      const value: RoomTokenCache = { token: result.token, url: result.url };

      writeRoomTokenCache(roomName, value);

      return value;
    },
  });
