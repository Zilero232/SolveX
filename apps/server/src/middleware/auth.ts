import type { MiddlewareHandler } from 'hono';

import { supabaseAdmin } from '../lib/supabase';

export type AuthVars = {
  email?: string;
  userId: string;
};

export const authMiddleware: MiddlewareHandler<{ Variables: AuthVars }> = async (c, next) => {
  const header = c.req.header('Authorization');

  if (!header?.startsWith('Bearer ')) return c.json({ error: 'Unauthorized' }, 401);

  const token = header.slice(7);
  const { data, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !data.user) return c.json({ error: 'Unauthorized' }, 401);

  const { id, email } = data.user;

  c.set('userId', id);
  c.set('email', email);

  await next();
};
