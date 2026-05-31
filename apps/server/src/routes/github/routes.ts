import { gitHubReleaseSchema } from '@chatovo/schemas';
import { createRoute } from '@hono/zod-openapi';
import { errorSchema } from '../shared/schemas';

export const latestReleaseRoute = createRoute({
  method: 'get',
  path: '/releases/latest',
  tags: ['github'],
  summary: 'Get the latest GitHub release',
  responses: {
    200: {
      description: 'Latest release',
      content: { 'application/json': { schema: gitHubReleaseSchema } },
    },
    502: {
      description: 'Upstream error',
      content: { 'application/json': { schema: errorSchema } },
    },
  },
});
