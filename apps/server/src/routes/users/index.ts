import { OpenAPIHono } from '@hono/zod-openapi';
import { getUserProfileHandler, updateProfileHandler } from './handlers';
import { getUserProfileRoute, updateProfileRoute } from './routes';
import type { Env } from '../shared/types';

export const usersRouter = new OpenAPIHono<Env>()
  .openapi(getUserProfileRoute, getUserProfileHandler)
  .openapi(updateProfileRoute, updateProfileHandler);
