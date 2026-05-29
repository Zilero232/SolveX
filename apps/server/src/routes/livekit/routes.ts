import {
  presenceStateRequestSchema,
  tokenRequestSchema,
  tokenResponseSchema,
} from '@chatovo/schemas';
import { createRoute, z } from '@hono/zod-openapi';
import { errorSchema } from '../shared/schemas';

export const tokenRoute = createRoute({
  method: 'post',
  path: '/token',
  tags: ['livekit'],
  summary: 'Issue LiveKit access token',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      required: true,
      content: { 'application/json': { schema: tokenRequestSchema } },
    },
  },
  responses: {
    200: {
      description: 'Access token',
      content: { 'application/json': { schema: tokenResponseSchema } },
    },
    401: {
      description: 'Password required',
      content: { 'application/json': { schema: errorSchema } },
    },
    403: {
      description: 'Invalid password',
      content: { 'application/json': { schema: errorSchema } },
    },
    404: {
      description: 'Room not found',
      content: { 'application/json': { schema: errorSchema } },
    },
    500: {
      description: 'Server error',
      content: { 'application/json': { schema: errorSchema } },
    },
  },
});

export const presenceStateRoute = createRoute({
  method: 'post',
  path: '/presence-state',
  tags: ['livekit'],
  summary: 'Report a partial presence patch (mic, deafen, ...)',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      required: true,
      content: { 'application/json': { schema: presenceStateRequestSchema } },
    },
  },
  responses: {
    200: {
      description: 'Accepted',
      content: { 'application/json': { schema: z.object({ ok: z.boolean() }) } },
    },
  },
});

// The LiveKit webhook is NOT an OpenAPI route. LiveKit POSTs a signed JSON
// body that the handler reads raw (c.req.text()) and verifies via
// WebhookReceiver — describing it with createRoute would let zod-openapi
// parse/validate the body and reject it before the handler runs. It is
// registered as a plain .post() in index.ts instead, like the SSE route.
