import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { filter, map, pipe } from 'remeda';
import { env } from './lib/env';
import { ConflictError, NotFoundError } from './lib/errors';
import { authMiddleware } from './middleware/auth';
import { livekitRouter } from './routes/livekit';
import { roomsRouter } from './routes/rooms';

const app = new OpenAPIHono();

app.openAPIRegistry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});

// Web client origins come from env (comma-separated); Tauri origins are always
// allowed so the desktop app can reach the same API as the website.
// macOS/Linux Tauri webview uses `tauri://localhost`; Windows uses
// `http(s)://tauri.localhost` depending on the WebView2 build.
const TAURI_ORIGINS = ['tauri://localhost', 'http://tauri.localhost', 'https://tauri.localhost'];

const allowedOrigins = [
  ...pipe(
    env.CORS_ORIGINS.split(','),
    map((origin) => origin.trim()),
    filter((origin) => origin.length > 0),
  ),
  ...TAURI_ORIGINS,
];

export const routes = app
  .use('*', logger())
  .use(
    '*',
    cors({
      origin: allowedOrigins,
      credentials: true,
    }),
  )
  .get('/health', (c) => c.json({ ok: true }))
  .use('/rooms/*', authMiddleware)
  // The webhook is signed by LiveKit and the SSE stream authorizes via a query
  // token (EventSource cannot send headers) — both bypass the bearer middleware.
  .use('/livekit/*', async (c, next) => {
    const path = c.req.path;

    if (path === '/livekit/webhook' || path === '/livekit/presence') return next();

    return authMiddleware(c, next);
  })
  .route('/rooms', roomsRouter)
  .route('/livekit', livekitRouter);

// Single place that turns thrown errors into HTTP responses. Domain errors
// map to their status; anything else is an unexpected failure -> 500.
app.onError((error, c) => {
  if (error instanceof ConflictError) return c.json({ error: error.message }, 409);
  if (error instanceof NotFoundError) return c.json({ error: error.message }, 404);

  return c.json({ error: 'Internal server error' }, 500);
});

app.doc('/openapi.json', {
  openapi: '3.0.0',
  info: { title: 'Chatovo API', version: '0.1.0' },
});

app.get('/docs', swaggerUI({ url: '/openapi.json' }));

export type App = typeof routes;

export default {
  port: env.PORT,
  fetch: app.fetch,
};
