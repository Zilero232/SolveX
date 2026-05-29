'use client';

import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const useUserProfile = (identity: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.userProfile(identity),
    queryFn: () => getUserProfile(identity),
  });
};
