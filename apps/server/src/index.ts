import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

import { env } from './lib/env';
import { authMiddleware } from './middleware/auth';
import { livekitRouter } from './routes/livekit';
import { roomsRouter } from './routes/rooms';

const app = new Hono()
  .use('*', logger())
  .use(
    '*',
    cors({
      origin: ['http://localhost:3000', 'tauri://localhost', 'http://tauri.localhost'],
      credentials: true,
    }),
  )
  .get('/health', (c) => c.json({ ok: true }))
  .use('/api/*', authMiddleware)
  .route('/api/rooms', roomsRouter)
  .route('/api/livekit', livekitRouter);

export type App = typeof app;

export default {
  port: env.PORT,
  fetch: app.fetch,
};
