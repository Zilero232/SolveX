import { useQuery } from '@tanstack/react-query';
import { isNonNullish } from 'remeda';
import { getRoom } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const useRoomById = (roomId: string | null) => {
  const {
    data: room,
    isLoading,
    isError,
  } = useQuery({
    queryKey: QUERY_KEYS.room(roomId),
    queryFn: () => getRoom(roomId as string),
    enabled: isNonNullish(roomId),
    retry: false,
  });

  return {
    room,
    isLoading,
    isError,
    displayName: room?.name ?? roomId ?? '',
    isPrivate: !!room?.isPrivate,
  };
};
