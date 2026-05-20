import type { TokenResponse } from '@chatovo/schemas/livekit';
import type { RouteHandler } from '@hono/zod-openapi';

import { AccessToken } from 'livekit-server-sdk';
import { env } from '../../lib/env';
import { verifyPassword } from '../../lib/password';
import { prisma } from '../../lib/prisma';
import { supabaseAdmin } from '../../lib/supabase';
import type { AuthVars } from '../../middleware/auth';
import type { tokenRoute } from './routes';

type Env = {
  Variables: AuthVars;
};

const readRole = (metadata: Record<string, unknown> | undefined): 'admin' | 'user' =>
  metadata?.role === 'admin' ? 'admin' : 'user';

export const tokenHandler: RouteHandler<typeof tokenRoute, Env> = async (c) => {
  const userId = c.get('userId');
  const email = c.get('email');
  const { roomId, password } = c.req.valid('json');

  const room = await prisma.room.findUnique({ where: { id: roomId } });

  if (!room) return c.json({ error: 'Room not found' }, 404);

  if (room.isPrivate) {
    if (!password) return c.json({ error: 'Password required' }, 401);
    if (!room.passwordHash) return c.json({ error: 'Room misconfigured' }, 500);

    const ok = await verifyPassword(password, room.passwordHash);

    if (!ok) return c.json({ error: 'Invalid password' }, 403);
  }

  const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);

  if (error || !data.user) return c.json({ error: 'User lookup failed' }, 500);

  const role = readRole(data.user.app_metadata);
  const isAdmin = role === 'admin';

  // display_name is set by the user at sign-up; fall back to the email local part.
  const displayName =
    (data.user.user_metadata?.display_name as string | undefined)?.trim() ||
    email?.split('@')[0] ||
    userId;

  const at = new AccessToken(env.LIVEKIT_API_KEY, env.LIVEKIT_API_SECRET, {
    identity: userId,
    name: displayName,
    // Travels to every other participant via participant.metadata.
    metadata: JSON.stringify({ email: email ?? null }),
    ttl: 60 * 60,
  });

  at.addGrant({
    room: room.id,
    roomJoin: true,
    roomCreate: true,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
    roomAdmin: isAdmin,
  });

  const payload: TokenResponse = {
    token: await at.toJwt(),
  };

  return c.json(payload, 200);
};
