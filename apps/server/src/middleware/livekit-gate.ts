import { PUBLIC_LIVEKIT_PATHS } from '../config/livekit';
import { authMiddleware } from './auth';
import type { MiddlewareHandler } from 'hono';

export const livekitAuthMiddleware: MiddlewareHandler = (c, next) => {
  if (PUBLIC_LIVEKIT_PATHS.includes(c.req.path)) return next();

  return authMiddleware(c, next);
};
