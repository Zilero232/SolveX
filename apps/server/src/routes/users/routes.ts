import { userProfileSchema } from '@chatovo/schemas';
import { createRoute, z } from '@hono/zod-openapi';
import { errorSchema } from '../shared/schemas';

const idParamSchema = z.object({
  id: z.string().openapi({ param: { name: 'id', in: 'path' } }),
});

const updateProfileFormSchema = z.object({
  name: z.string(),
  profileUrl: z.string(),
  bannerColor: z.string(),
  bio: z.string(),
  avatar: z.instanceof(File).optional(),
  removeAvatar: z.string().optional(),
});

export const updateProfileRoute = createRoute({
  method: 'post',
  path: '/profile',
  tags: ['users'],
  summary: 'Update the signed-in user profile',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      required: true,
      content: { 'multipart/form-data': { schema: updateProfileFormSchema } },
    },
  },
  responses: {
    200: {
      description: 'Updated profile',
      content: { 'application/json': { schema: userProfileSchema } },
    },
    400: {
      description: 'Invalid input',
      content: { 'application/json': { schema: errorSchema } },
    },
    404: {
      description: 'Not found',
      content: { 'application/json': { schema: errorSchema } },
    },
    500: {
      description: 'Update failed',
      content: { 'application/json': { schema: errorSchema } },
    },
  },
});

export const getUserProfileRoute = createRoute({
  method: 'get',
  path: '/{id}/profile',
  tags: ['users'],
  summary: 'Get a user public profile',
  security: [{ bearerAuth: [] }],
  request: { params: idParamSchema },
  responses: {
    200: {
      description: 'User profile',
      content: { 'application/json': { schema: userProfileSchema } },
    },
    404: {
      description: 'Not found',
      content: { 'application/json': { schema: errorSchema } },
    },
  },
});
