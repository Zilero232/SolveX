import { useQuery } from '@tanstack/react-query';

import { listRooms } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const useRooms = () =>
  useQuery({
    queryKey: QUERY_KEYS.rooms(),
    queryFn: listRooms,
    staleTime: 30_000,
  });
