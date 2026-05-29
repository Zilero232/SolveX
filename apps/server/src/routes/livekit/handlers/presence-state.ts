import { patchParticipant } from '../presence';
import type { RouteHandler } from '@hono/zod-openapi';
import type { Env } from '../../shared/types';
import type { presenceStateRoute } from '../routes';

// LiveKit has no webhook for mute/attribute toggles, so the client reports its
// live presence (mic, deafen, ...) here as a partial patch.
export const presenceStateHandler: RouteHandler<typeof presenceStateRoute, Env> = async (c) => {
  const { roomId, ...patch } = c.req.valid('json');
  const userId = c.get('userId');

  patchParticipant(roomId, userId, patch);

  return c.json({ ok: true }, 200);
};
