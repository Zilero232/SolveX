import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { fetchLiveKitToken } from '@/shared/api';
import { buildRoomHref, QUERY_KEYS } from '@/shared/constants';

export type EnterRoomInput = {
  password?: string;
  roomId: string;
};

export const useEnterRoom = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ roomId, password }: EnterRoomInput) => {
      const response = await fetchLiveKitToken({ roomId, password });

      queryClient.setQueryData(QUERY_KEYS.livekitToken(roomId), response);

      router.push(buildRoomHref(roomId));
    },
  });
};
