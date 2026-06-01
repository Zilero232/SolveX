import { useQuery } from '@tanstack/react-query';
import { isNonNullish } from 'remeda';
import { authClient, getUserProfile } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';
import { firstNonEmpty } from '@/shared/lib';
import type { UserRole } from '../types';

export const useCurrentUser = () => {
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user ?? null;
  const userId = user?.id ?? null;
  const sessionToken = session?.session?.token ?? null;

  const { data: profile } = useQuery({
    queryKey: QUERY_KEYS.userProfile(userId ?? ''),
    queryFn: () => getUserProfile(userId as string),
    enabled: isNonNullish(userId) && isNonNullish(sessionToken),
  });

  const role: UserRole = user?.role === 'admin' ? 'admin' : 'user';

  const displayName = firstNonEmpty(profile?.name, user?.name, user?.email?.split('@')[0]) ?? 'you';
  const initial = displayName.charAt(0).toUpperCase();

  return {
    user,
    role,
    session: session ?? null,
    isLoading: isPending,
    displayName,
    initial,
    isAdmin: role === 'admin',
    avatarUrl: firstNonEmpty(profile?.avatarUrl, user?.image),
    verified: profile?.verified ?? user?.verified ?? false,
    profileUrl: firstNonEmpty(profile?.profileUrl),
    bannerColor: firstNonEmpty(profile?.bannerColor),
    bio: firstNonEmpty(profile?.bio),
    isAuthenticated: isNonNullish(user),
  };
};
