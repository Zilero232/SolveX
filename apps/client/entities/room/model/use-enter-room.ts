import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { fetchLiveKitToken } from '@/shared/api';
import { buildRoomHref } from '@/shared/constants';

export type EnterRoomInput = {
  password?: string;
  roomId: string;
};

export const useEnterRoom = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ roomId, password }: EnterRoomInput) => {
      await fetchLiveKitToken({ roomId, password });
      router.push(buildRoomHref(roomId));
    },
  });
};
