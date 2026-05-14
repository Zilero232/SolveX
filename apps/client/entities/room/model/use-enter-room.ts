import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { fetchLiveKitToken } from '@/shared/api';
import { buildRoomHref } from '@/shared/constants';

import { writeRoomTokenCache } from '../lib/cache';

export interface EnterRoomInput {
  room: string;
}

export const useEnterRoom = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ room }: EnterRoomInput) => {
      const trimmed = room.trim();

      if (!trimmed) throw new Error('Room name required');

      const { token, url } = await fetchLiveKitToken({ room: trimmed });

      writeRoomTokenCache(trimmed, { token, url });
      router.push(buildRoomHref(trimmed));
    },
  });
};
