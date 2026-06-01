import { extension } from 'mime-types';
import { AVATAR_MAX_BYTES } from '../../config/uploads';
import { prisma } from '../../lib/prisma';
import { saveUpload } from '../../lib/uploads';
import { toUserProfile } from '../../lib/user-profile';
import type { RouteHandler } from '@hono/zod-openapi';
import type { Env } from '../shared/types';
import type { getUserProfileRoute, updateProfileRoute } from './routes';

export const getUserProfileHandler: RouteHandler<typeof getUserProfileRoute, Env> = async (c) => {
  const { id } = c.req.valid('param');

  const user = await prisma.user.findUnique({ where: { id }, include: { profile: true } });

  if (!user) return c.json({ error: 'User not found' }, 404);

  return c.json(toUserProfile(user), 200);
};

const uploadAvatar = async (userId: string, file: File): Promise<string> => {
  const ext = extension(file.type) || 'png';
  const key = `avatars/${userId}/avatar.${ext}`;
  const buffer = await file.arrayBuffer();

  const url = await saveUpload(key, buffer);

  return `${url}?v=${Date.now()}`;
};

export const updateProfileHandler: RouteHandler<typeof updateProfileRoute, Env> = async (c) => {
  const userId = c.get('userId');
  const { displayName, profileUrl, bannerColor, bio, avatar, removeAvatar } = c.req.valid('form');

  if (displayName.trim().length < 2) return c.json({ error: 'Invalid name' }, 400);

  let avatarUrl: string | null | undefined;

  if (avatar instanceof File && avatar.size > 0) {
    const { type, size } = avatar;

    if (!type.startsWith('image/')) return c.json({ error: 'Not an image' }, 400);
    if (size > AVATAR_MAX_BYTES) return c.json({ error: 'Image too large' }, 400);

    avatarUrl = await uploadAvatar(userId, avatar);
  } else if (removeAvatar === 'true') {
    avatarUrl = null;
  }

  const profileData = {
    displayName: displayName.trim(),
    profileUrl: profileUrl.trim().length > 0 ? profileUrl.trim() : null,
    bannerColor: bannerColor.length > 0 ? bannerColor : null,
    bio: bio.trim().length > 0 ? bio.trim() : null,
    ...(avatarUrl !== undefined ? { avatarUrl } : {}),
  };

  await prisma.profile.upsert({
    where: { userId },
    create: { userId, ...profileData },
    update: profileData,
  });

  const user = await prisma.user.findUnique({ where: { id: userId }, include: { profile: true } });

  if (!user) return c.json({ error: 'User not found' }, 404);

  return c.json(toUserProfile(user), 200);
};
