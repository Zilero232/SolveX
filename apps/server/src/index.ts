import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

import { env } from './lib/env';
import { authMiddleware } from './middleware/auth';
import { livekitRouter } from './routes/livekit';
import { roomsRouter } from './routes/rooms';

const app = new OpenAPIHono();

app.openAPIRegistry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});

// Web client origins come from env (comma-separated); Tauri origins are always allowed
// so the desktop app can reach the same API as the website.
const tauriOrigins = ['tauri://localhost', 'http://tauri.localhost'];
const allowedOrigins = [
  ...env.CORS_ORIGINS.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  ...tauriOrigins,
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
  .use('/livekit/*', authMiddleware)
  .route('/rooms', roomsRouter)
  .route('/livekit', livekitRouter);

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
