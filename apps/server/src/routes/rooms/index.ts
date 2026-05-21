import { OpenAPIHono } from '@hono/zod-openapi';
import { createRoomHandler, deleteRoomHandler, getRoomHandler, listRoomsHandler } from './handlers';
import { createRoomRoute, deleteRoomRoute, getRoomRoute, listRoomsRoute } from './routes';
import type { Env } from '../shared/types';

export const roomsRouter = new OpenAPIHono<Env>()
  .openapi(listRoomsRoute, listRoomsHandler)
  .openapi(getRoomRoute, getRoomHandler)
  .openapi(createRoomRoute, createRoomHandler)
  .openapi(deleteRoomRoute, deleteRoomHandler);
