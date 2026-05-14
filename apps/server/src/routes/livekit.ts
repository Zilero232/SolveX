import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { AccessToken } from 'livekit-server-sdk';

import type { AuthVars } from '../middleware/auth';
import type {TokenResponse} from '../schemas/livekit';

import { env } from '../lib/env';
import { supabaseAdmin } from '../lib/supabase';
import { tokenRequestSchema  } from '../schemas/livekit';

const readRole = (metadata: Record<string, unknown> | undefined): 'admin' | 'user' =>
  metadata?.role === 'admin' ? 'admin' : 'user';

export const livekitRouter = new Hono<{ Variables: AuthVars }>().post(
  '/token',
  zValidator('json', tokenRequestSchema),
  async (c) => {
    const userId = c.get('userId');
    const email = c.get('email');
    const { room } = c.req.valid('json');

    const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);

    if (error || !data.user) return c.json({ error: 'User lookup failed' }, 500);

    const role = readRole(data.user.app_metadata);

    const at = new AccessToken(env.LIVEKIT_API_KEY, env.LIVEKIT_API_SECRET, {
      identity: userId,
      name: email ?? userId,
      ttl: 60 * 60,
    });

    at.addGrant({
      room,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
      roomCreate: role === 'admin',
      roomAdmin: role === 'admin',
    });

    const payload: TokenResponse = {
      token: await at.toJwt(),
      url: env.LIVEKIT_URL,
      isAdmin: role === 'admin',
    };

    return c.json(payload);
  },
);
