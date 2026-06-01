import { useQuery } from '@tanstack/react-query';
import { secondsToMilliseconds } from 'date-fns';
import { isEmpty } from 'remeda';
import { listRooms } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const useRooms = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.rooms(),
    queryFn: listRooms,
    staleTime: secondsToMilliseconds(30),
  });

  const rooms = data ?? [];

  return {
    rooms,
    isLoading,
    isError,
    isEmpty: !isLoading && isEmpty(rooms),
  };
};
