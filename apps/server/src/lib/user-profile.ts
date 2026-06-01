import { isString } from 'remeda';
import type { UserProfile } from '@chatovo/schemas';
import type { Prisma } from '../../generated';

export const resolveString = (value: unknown): string | null => {
  return isString(value) && value.trim().length > 0 ? value.trim() : null;
};

export type UserWithProfile = Prisma.UserGetPayload<{ include: { profile: true } }>;

type DisplayNameSource = Partial<Pick<Prisma.UserGetPayload<true>, 'name' | 'email'>> & {
  displayName?: string | null;
  userId: string;
};

export const resolveDisplayName = ({
  displayName,
  name,
  email,
  userId,
}: DisplayNameSource): string => {
  return resolveString(displayName) ?? resolveString(name) ?? email?.split('@')[0] ?? userId;
};

export const toUserProfile = (user: UserWithProfile): UserProfile => {
  const { id, name, email, image, verified, profile } = user;

  return {
    id,
    name: resolveDisplayName({ displayName: profile?.displayName, name, email, userId: id }),
    avatarUrl: resolveString(profile?.avatarUrl) ?? resolveString(image),
    profileUrl: resolveString(profile?.profileUrl),
    bannerColor: resolveString(profile?.bannerColor),
    bio: resolveString(profile?.bio),
    verified,
  };
};
