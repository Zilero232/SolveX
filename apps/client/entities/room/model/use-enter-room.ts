import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { fetchLiveKitToken } from '@/shared/api';
import { buildRoomHref } from '@/shared/constants';

import { writeRoomTokenCache } from '../lib/cache';

export interface EnterRoomInput {
  password?: string;
  roomId: string;
}

export const useEnterRoom = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ roomId, password }: EnterRoomInput) => {
      const { token, url } = await fetchLiveKitToken({ roomId, password });

      writeRoomTokenCache(roomId, { token, url });
      router.push(buildRoomHref(roomId));
    },
  });
};
