import { verifyAccessToken } from '../lib/auth';
import type { MiddlewareHandler } from 'hono';

export type AuthVars = {
  email?: string;
  userId: string;
};

export const authMiddleware: MiddlewareHandler<{ Variables: AuthVars }> = async (c, next) => {
  const header = c.req.header('Authorization');

  if (!header?.startsWith('Bearer ')) return c.json({ error: 'Unauthorized' }, 401);

  const user = await verifyAccessToken(header.slice(7));

  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  c.set('userId', user.userId);
  c.set('email', user.email);

  await next();
};
