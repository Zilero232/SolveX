import { createRoomInputSchema, roomSchema } from '@chatovo/schemas/rooms';
import { createRoute, z } from '@hono/zod-openapi';
import { errorSchema } from '../shared/schemas';

const idParamSchema = z.object({
  id: z.uuid().openapi({ param: { name: 'id', in: 'path' } }),
});

export const listRoomsRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['rooms'],
  summary: 'List rooms',
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'Rooms list',
      content: { 'application/json': { schema: z.array(roomSchema) } },
    },
  },
});

export const getRoomRoute = createRoute({
  method: 'get',
  path: '/{id}',
  tags: ['rooms'],
  summary: 'Get room',
  security: [{ bearerAuth: [] }],
  request: { params: idParamSchema },
  responses: {
    200: {
      description: 'Room',
      content: { 'application/json': { schema: roomSchema } },
    },
    404: {
      description: 'Not found',
      content: { 'application/json': { schema: errorSchema } },
    },
  },
});

export const createRoomRoute = createRoute({
  method: 'post',
  path: '/',
  tags: ['rooms'],
  summary: 'Create room',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      required: true,
      content: { 'application/json': { schema: createRoomInputSchema } },
    },
  },
  responses: {
    201: {
      description: 'Created',
      content: { 'application/json': { schema: roomSchema } },
    },
    409: {
      description: 'A room with this name already exists',
      content: { 'application/json': { schema: errorSchema } },
    },
  },
});
