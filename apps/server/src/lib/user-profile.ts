import { filter, first, isString, map, pipe } from 'remeda';
import type { UserProfile } from '@chatovo/schemas';
import type { User } from '@supabase/supabase-js';

export const resolveString = (value: unknown): string | null => {
  return isString(value) && value.trim().length > 0 ? value.trim() : null;
};

export const resolveDisplayName = (
  metadata: Record<string, unknown>,
  email: string | undefined,
  userId: string,
): string => {
  return (
    pipe(
      [metadata.display_name, metadata.full_name, metadata.name],
      map(resolveString),
      filter(isString),
      first(),
    ) ??
    email?.split('@')[0] ??
    userId
  );
};

export const resolveAvatarUrl = (metadata: Record<string, unknown>): string | null => {
  return (
    pipe([metadata.avatar_url, metadata.picture], map(resolveString), filter(isString), first()) ??
    null
  );
};

export const toUserProfile = (user: User): UserProfile => {
  const appMetadata = user.app_metadata ?? {};
  const userMetadata = user.user_metadata ?? {};

  return {
    id: user.id,
    name: resolveDisplayName(userMetadata, user.email, user.id),
    avatarUrl: resolveAvatarUrl(userMetadata),
    profileUrl: resolveString(userMetadata.profile_url),
    bannerColor: resolveString(userMetadata.banner_color),
    bio: resolveString(userMetadata.bio),
    verified: appMetadata.verified === true,
  };
};
