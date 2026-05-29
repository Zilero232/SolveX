import { extension } from 'mime-types';
import { supabaseAdmin } from '../../lib/supabase';
import { toUserProfile } from '../../lib/user-profile';
import type { RouteHandler } from '@hono/zod-openapi';
import type { Env } from '../shared/types';
import type { getUserProfileRoute, updateProfileRoute } from './routes';

const AVATAR_MAX_BYTES = 2 * 1024 * 1024;
const AVATAR_BUCKET = 'avatars';

export const getUserProfileHandler: RouteHandler<typeof getUserProfileRoute, Env> = async (c) => {
  const { id } = c.req.valid('param');

  const { data, error } = await supabaseAdmin.auth.admin.getUserById(id);

  if (error || !data.user) return c.json({ error: 'User not found' }, 404);

  return c.json(toUserProfile(data.user), 200);
};

const uploadAvatar = async (userId: string, file: File): Promise<string> => {
  const path = `${userId}/avatar.${extension(file.type) || 'png'}`;
  const buffer = await file.arrayBuffer();

  const { error } = await supabaseAdmin.storage
    .from(AVATAR_BUCKET)
    .upload(path, buffer, { upsert: true, contentType: file.type });

  if (error) throw error;

  const { data } = supabaseAdmin.storage.from(AVATAR_BUCKET).getPublicUrl(path);

  return `${data.publicUrl}?v=${Date.now()}`;
};

export const updateProfileHandler: RouteHandler<typeof updateProfileRoute, Env> = async (c) => {
  const userId = c.get('userId');
  const { name, profileUrl, bannerColor, bio, avatar, removeAvatar } = c.req.valid('form');

  if (name.trim().length < 2) return c.json({ error: 'Invalid name' }, 400);

  const { data: current, error: lookupError } = await supabaseAdmin.auth.admin.getUserById(userId);

  if (lookupError || !current.user) return c.json({ error: 'User not found' }, 404);

  const metadata: Record<string, unknown> = {
    ...current.user.user_metadata,
    display_name: name.trim(),
    profile_url: profileUrl.trim(),
    banner_color: bannerColor.length > 0 ? bannerColor : null,
    bio: bio.trim().length > 0 ? bio.trim() : null,
  };

  if (avatar instanceof File && avatar.size > 0) {
    if (!avatar.type.startsWith('image/')) return c.json({ error: 'Not an image' }, 400);
    if (avatar.size > AVATAR_MAX_BYTES) return c.json({ error: 'Image too large' }, 400);

    metadata.avatar_url = await uploadAvatar(userId, avatar);
  } else if (removeAvatar === 'true') {
    metadata.avatar_url = null;
  }

  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    user_metadata: metadata,
  });

  if (error || !data.user) return c.json({ error: 'Update failed' }, 500);

  return c.json(toUserProfile(data.user), 200);
};
