import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { serveStatic } from 'hono/bun';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';
import { logger } from 'hono/logger';
import { allowedOrigins } from './config/cors';
import { auth } from './lib/auth';
import { env } from './lib/env';
import { UPLOADS_DIR } from './lib/uploads';
import { authMiddleware } from './middleware/auth';
import { livekitAuthMiddleware } from './middleware/livekit-gate';
import { socialDoneHandler } from './routes/auth/social-done';
import { chatRouter } from './routes/chat';
import { githubRouter } from './routes/github';
import { livekitRouter } from './routes/livekit';
import { roomsRouter } from './routes/rooms';
import { usersRouter } from './routes/users';

const serveUploads = serveStatic({
  root: UPLOADS_DIR,
  rewriteRequestPath: (path) => path.replace(/^\/uploads/, ''),
});

const app = new OpenAPIHono({
  defaultHook: (result, c) => {
    if (!result.success) {
      return c.json({ error: result.error.issues[0]?.message ?? 'Invalid input' }, 400);
    }
  },
});

app.openAPIRegistry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});

export const routes = app
  .use('*', logger())
  .use(
    '*',
    cors({
      origin: allowedOrigins,
      credentials: true,
      exposeHeaders: ['set-auth-token'],
    }),
  )
  .get('/health', (c) => c.json({ ok: true }))
  .get('/auth/social-done', socialDoneHandler)
  .on(['POST', 'GET'], '/auth/*', (c) => auth.handler(c.req.raw))
  .use('/uploads/*', serveUploads)
  .use('/rooms/*', authMiddleware)
  .use('/users/*', authMiddleware)
  .use('/chat/*', authMiddleware)
  .use('/livekit/*', livekitAuthMiddleware)
  .route('/rooms', roomsRouter)
  .route('/users', usersRouter)
  .route('/chat', chatRouter)
  .route('/github', githubRouter)
  .route('/livekit', livekitRouter);

// Single place that turns thrown errors into HTTP responses. HTTPExceptions
// carry their own status; anything else is an unexpected failure -> 500.
app.onError((error, c) => {
  if (error instanceof HTTPException) return c.json({ error: error.message }, error.status);

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
