import { useQuery } from '@tanstack/react-query';

import { getRoom } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const useRoomById = (roomId: string | null) =>
  useQuery({
    queryKey: QUERY_KEYS.room(roomId),
    queryFn: () => getRoom(roomId as string),
    enabled: !!roomId,
    retry: false, // 404 = room not found; do not retry
  });
