import { useQuery } from '@tanstack/react-query';

import { fetchLiveKitToken } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

type Options = {
  isPrivate: boolean;
  password?: string;
};

// Single LiveKit-token source for both public and private rooms.
// Public: fetches once roomId is known. Private: stays idle until a password
// is supplied, then fetches. Password is closed over (not in queryKey) so it
// never lands in the cache/devtools — call refetch() to retry with a new one.
export const useRoomToken = (roomId: string | null, { isPrivate, password }: Options) =>
  useQuery({
    queryKey: QUERY_KEYS.livekitToken(roomId),
    queryFn: () => fetchLiveKitToken({ roomId: roomId as string, password }),
    select: ({ token }) => token,
    enabled: !!roomId && (!isPrivate || !!password),
    retry: false,
    staleTime: 0,
  });
