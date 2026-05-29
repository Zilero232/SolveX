import { OpenAPIHono } from '@hono/zod-openapi';
import { presenceHandler, presenceStateHandler, tokenHandler, webhookHandler } from './handlers';
import { presenceStateRoute, tokenRoute } from './routes';
import type { Env } from '../shared/types';

export const livekitRouter = new OpenAPIHono<Env>()
  .openapi(tokenRoute, tokenHandler)
  .openapi(presenceStateRoute, presenceStateHandler)
  // Webhook and SSE are plain Hono routes — not described by createRoute.
  // The webhook body is signed JSON read raw by the handler; OpenAPI body
  // validation would reject it before the handler runs.
  .post('/webhook', webhookHandler)
  .get('/presence', presenceHandler);
