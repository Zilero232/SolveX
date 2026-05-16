import type { RouteHandler } from '@hono/zod-openapi';
import { hashPassword } from '../../lib/password';
import { prisma } from '../../lib/prisma';
import type { AuthVars } from '../../middleware/auth';
import type { createRoomRoute, deleteRoomRoute, getRoomRoute, listRoomsRoute } from './routes';

interface Env {
  Variables: AuthVars;
}

export const listRoomsHandler: RouteHandler<typeof listRoomsRoute, Env> = async (c) => {
  const rooms = await prisma.room.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, isPrivate: true },
  });

  return c.json(rooms, 200);
};

export const getRoomHandler: RouteHandler<typeof getRoomRoute, Env> = async (c) => {
  const { id } = c.req.valid('param');

  const room = await prisma.room.findUnique({
    where: { id },
    select: { id: true, name: true, isPrivate: true },
  });

  if (!room) return c.json({ error: 'Room not found' }, 404);

  return c.json(room, 200);
};

export const createRoomHandler: RouteHandler<typeof createRoomRoute, Env> = async (c) => {
  const userId = c.get('userId');
  const { isPrivate, name, password } = c.req.valid('json');

  const passwordHash = isPrivate && password ? await hashPassword(password) : null;

  const room = await prisma.room.create({
    data: { name, isPrivate, passwordHash, createdById: userId },
    select: { id: true, name: true, isPrivate: true },
  });

  return c.json(room, 201);
};

export const deleteRoomHandler: RouteHandler<typeof deleteRoomRoute, Env> = async (c) => {
  const userId = c.get('userId');
  const { id } = c.req.valid('param');

  const room = await prisma.room.findUnique({
    where: { id },
    select: { createdById: true },
  });

  if (!room) return c.json({ error: 'Room not found' }, 404);
  if (room.createdById !== userId) return c.json({ error: 'Forbidden' }, 403);

  await prisma.room.delete({ where: { id } });

  return c.body(null, 204);
};
