import { useQuery } from '@tanstack/react-query';

import { fetchLiveKitToken } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const usePublicRoomToken = (roomId: string | null, enabled: boolean) =>
  useQuery({
    queryKey: QUERY_KEYS.livekitToken(roomId),
    queryFn: () => fetchLiveKitToken({ roomId: roomId as string }),
    enabled: enabled && !!roomId,
    staleTime: 0,
  });
