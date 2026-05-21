import { useQuery } from '@tanstack/react-query';
import { isNonNullish, isString } from 'remeda';
import { supabase } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';
import type { User } from '@supabase/supabase-js';
import type { UserRole } from './types';

const readRole = (user: User | null): UserRole =>
  user?.app_metadata?.role === 'admin' ? 'admin' : 'user';

// display_name is set at email sign-up; Google sign-in stores the name under
// full_name/name instead. Fall back to the email local part as a last resort.
const resolveDisplayName = (user: User | null): string => {
  const metadata = user?.user_metadata ?? {};

  const nameFromMetadata = [metadata.display_name, metadata.full_name, metadata.name]
    .filter(isString)
    .map((value) => value.trim())
    .find((value) => value.length > 0);

  return nameFromMetadata ?? user?.email?.split('@')[0] ?? 'you';
};

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

  const displayName = resolveDisplayName(user);
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
