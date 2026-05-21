import { useQuery } from '@tanstack/react-query';
import { isNonNullish } from 'remeda';
import { supabase } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';
import type { User } from '@supabase/supabase-js';
import type { UserRole } from './types';

const readRole = (user: User | null): UserRole =>
  user?.app_metadata?.role === 'admin' ? 'admin' : 'user';

export const useCurrentUser = () => {
  const { data: session, isLoading } = useQuery({
    queryKey: QUERY_KEYS.session(),
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();

      return data.session;
    },
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
  });

  const user = session?.user ?? null;
  const role = readRole(user);
  // display_name is chosen at sign-up; fall back to the email local part.
  const displayName =
    (user?.user_metadata?.display_name as string | undefined)?.trim() ||
    user?.email?.split('@')[0] ||
    'you';
  const initial = displayName.charAt(0).toUpperCase();

  return {
    user,
    role,
    session: session ?? null,
    isLoading,
    displayName,
    initial,
    isAuthenticated: isNonNullish(user),
    isAdmin: role === 'admin',
  };
};
