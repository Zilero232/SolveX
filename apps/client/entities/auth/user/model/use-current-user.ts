import { useQuery } from '@tanstack/react-query';
import { filter, first, isNonNullish, isString, map, pipe } from 'remeda';
import { supabase } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';
import type { User } from '@supabase/supabase-js';
import type { UserRole } from './types';

const firstNonEmptyString = (values: unknown[]): string | null => {
  return (
    pipe(
      values,
      filter(isString),
      map((value) => value.trim()),
      filter((value) => value.length > 0),
      first(),
    ) ?? null
  );
};

const readRole = (user: User | null): UserRole => {
  return user?.app_metadata?.role === 'admin' ? 'admin' : 'user';
};

const readVerified = (user: User | null): boolean => {
  return user?.app_metadata?.verified === true;
};

const readProfileUrl = (user: User | null): string | null => {
  return firstNonEmptyString([user?.user_metadata?.profile_url]);
};

// display_name is set at email sign-up; Google sign-in stores the name under
// full_name/name. Fall back to the email local part as a last resort.
const resolveDisplayName = (user: User | null): string => {
  const meta = user?.user_metadata ?? {};

  return (
    firstNonEmptyString([meta.display_name, meta.full_name, meta.name]) ??
    user?.email?.split('@')[0] ??
    'you'
  );
};

// OAuth providers store the avatar URL under avatar_url; some use picture.
const readAvatarUrl = (user: User | null): string | null => {
  const meta = user?.user_metadata ?? {};

  return firstNonEmptyString([meta.avatar_url, meta.picture]);
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
    isAdmin: role === 'admin',
    avatarUrl: readAvatarUrl(user),
    verified: readVerified(user),
    profileUrl: readProfileUrl(user),
    isAuthenticated: isNonNullish(user),
  };
};
