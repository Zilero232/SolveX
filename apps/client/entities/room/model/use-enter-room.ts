import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { fetchLiveKitToken, getFreshAccessToken } from '@/shared/api';
import { buildRoomHref } from '@/shared/constants';

import { writeRoomTokenCache } from '../lib/cache';

export type EnterRoomInput = {
  room: string;
};

export const useEnterRoom = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ room }: EnterRoomInput) => {
      const trimmed = room.trim();

      if (!trimmed) throw new Error('Room name required');

      const accessToken = await getFreshAccessToken();
      const { token, url } = await fetchLiveKitToken({ room: trimmed }, accessToken);

      writeRoomTokenCache(trimmed, { token, url });
      router.push(buildRoomHref(trimmed));
    },
  });
};
