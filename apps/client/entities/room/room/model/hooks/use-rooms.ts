import { useQuery } from '@tanstack/react-query';
import { isEmpty } from 'remeda';
import { listRooms } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const useRooms = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.rooms(),
    queryFn: listRooms,
  });

  const rooms = data ?? [];

  return {
    rooms,
    isLoading,
    isError,
    isEmpty: !isLoading && isEmpty(rooms),
  };
};
