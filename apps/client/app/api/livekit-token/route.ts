import { createClient } from '@supabase/supabase-js';
import { AccessToken } from 'livekit-server-sdk';

import { tokenRequestSchema } from '@/shared/api/livekit';
import { env } from '@/shared/config';
import { serverEnv } from '@/shared/config/server-env';

const supabaseAdmin = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  serverEnv.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } },
);

const readRole = (metadata: Record<string, unknown> | undefined): 'admin' | 'user' =>
  metadata?.role === 'admin' ? 'admin' : 'user';

export const POST = async (request: Request) => {
  const authHeader = request.headers.get('authorization');
  const accessToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!accessToken) return Response.json({ error: 'Missing Bearer token' }, { status: 401 });

  const { data, error } = await supabaseAdmin.auth.getUser(accessToken);

  if (error || !data.user) return Response.json({ error: 'Invalid session' }, { status: 401 });

  const parsed = tokenRequestSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) return Response.json({ error: 'Invalid body' }, { status: 400 });

  const { room } = parsed.data;
  const role = readRole(data.user.app_metadata);

  const at = new AccessToken(serverEnv.LIVEKIT_API_KEY, serverEnv.LIVEKIT_API_SECRET, {
    identity: data.user.id,
    name: data.user.email ?? data.user.id,
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

  return Response.json({
    token: await at.toJwt(),
    url: serverEnv.LIVEKIT_URL,
    isAdmin: role === 'admin',
  });
};
