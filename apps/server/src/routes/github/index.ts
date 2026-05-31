import { OpenAPIHono } from '@hono/zod-openapi';
import { latestReleaseHandler } from './handlers';
import { latestReleaseRoute } from './routes';
import type { Env } from '../shared/types';

export const githubRouter = new OpenAPIHono<Env>().openapi(
  latestReleaseRoute,
  latestReleaseHandler,
);
