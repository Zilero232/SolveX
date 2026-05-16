import { OpenAPIHono } from '@hono/zod-openapi';

import type { AuthVars } from '../../middleware/auth';

import { createRoomHandler, deleteRoomHandler, getRoomHandler, listRoomsHandler } from './handlers';
import { createRoomRoute, deleteRoomRoute, getRoomRoute, listRoomsRoute } from './routes';

export const roomsRouter = new OpenAPIHono<{ Variables: AuthVars }>()
  .openapi(listRoomsRoute, listRoomsHandler)
  .openapi(getRoomRoute, getRoomHandler)
  .openapi(createRoomRoute, createRoomHandler)
  .openapi(deleteRoomRoute, deleteRoomHandler);
