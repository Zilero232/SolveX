import { AccessToken } from 'livekit-server-sdk';
import { readRole } from '../../../lib/auth';
import { env } from '../../../lib/env';
import { prisma } from '../../../lib/prisma';
import { supabaseAdmin } from '../../../lib/supabase';
import { toUserProfile } from '../../../lib/user-profile';
import type { ParticipantMetadata, TokenResponse } from '@chatovo/schemas';
import type { RouteHandler } from '@hono/zod-openapi';
import type { Env } from '../../shared/types';
import type { tokenRoute } from '../routes';

export const tokenHandler: RouteHandler<typeof tokenRoute, Env> = async (c) => {
  const userId = c.get('userId');
  const email = c.get('email');
  const { roomId, password } = c.req.valid('json');

  const room = await prisma.room.findUnique({ where: { id: roomId } });

  if (!room) return c.json({ error: 'Room not found' }, 404);

  if (room.isPrivate) {
    if (!password) return c.json({ error: 'Password required' }, 401);
    if (!room.password) return c.json({ error: 'Room misconfigured' }, 500);
    if (password !== room.password) return c.json({ error: 'Invalid password' }, 403);
  }

  const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);

  if (error || !data.user) return c.json({ error: 'User lookup failed' }, 500);

  const isAdmin = readRole(data.user.app_metadata) === 'admin';
  const profile = toUserProfile(data.user);

  const participantMetadata: ParticipantMetadata = {
    email: email ?? null,
    verified: profile.verified,
    profileUrl: profile.profileUrl,
    avatarUrl: profile.avatarUrl,
    bannerColor: profile.bannerColor,
  };

  const at = new AccessToken(env.LIVEKIT_API_KEY, env.LIVEKIT_API_SECRET, {
    identity: userId,
    name: profile.name,
    metadata: JSON.stringify(participantMetadata),
    ttl: 60 * 60,
  });

  at.addGrant({
    room: room.id,
    roomJoin: true,
    roomCreate: true,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
    canUpdateOwnMetadata: true,
    roomAdmin: isAdmin,
  });

  const payload: TokenResponse = {
    token: await at.toJwt(),
  };

  return c.json(payload, 200);
};
