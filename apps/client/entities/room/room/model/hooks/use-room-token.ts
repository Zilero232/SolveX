import { useQuery } from '@tanstack/react-query';
import { isNonNullish } from 'remeda';
import { fetchLiveKitToken } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

type Options = {
  isPrivate: boolean;
  password?: string;
};

export const useRoomToken = (roomId: string | null, { isPrivate, password }: Options) => {
  return useQuery({
    queryKey: QUERY_KEYS.livekitToken(roomId),
    queryFn: () => fetchLiveKitToken({ roomId: roomId as string, password }),
    select: ({ token }) => token,
    enabled: isNonNullish(roomId) && (!isPrivate || isNonNullish(password)),
    retry: false,
    staleTime: 0,
  });
};
