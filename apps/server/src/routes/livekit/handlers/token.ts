import { AccessToken } from 'livekit-server-sdk';
import { readRole } from '../../../lib/auth';
import { env } from '../../../lib/env';
import { verifyPassword } from '../../../lib/password';
import { prisma } from '../../../lib/prisma';
import { supabaseAdmin } from '../../../lib/supabase';
import type { TokenResponse } from '@chatovo/schemas/livekit';
import type { RouteHandler } from '@hono/zod-openapi';
import type { Env } from '../../shared/types';
import type { tokenRoute } from '../routes';

/** Issues a short-lived LiveKit access token for a room, gating private rooms. */
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

  const isAdmin = readRole(data.user.app_metadata) === 'admin';

  // display_name is set at email sign-up; Google sign-in stores the name under
  // full_name/name instead. Fall back to the email local part as a last resort.
  const metadata = data.user.user_metadata ?? {};
  const displayName =
    [metadata.display_name, metadata.full_name, metadata.name]
      .map((value) => (typeof value === 'string' ? value.trim() : ''))
      .find(Boolean) ||
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
