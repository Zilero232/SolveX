import { HTTPException } from 'hono/http-exception';
import { isNonNullish, isNullish } from 'remeda';
import { prisma } from '../../lib/prisma';
import type { RouteHandler } from '@hono/zod-openapi';
import type { Prisma } from '../../../generated';
import type { Env } from '../shared/types';
import type {
  createRoomRoute,
  deleteRoomRoute,
  getRoomRoute,
  listRoomsRoute,
  updateRoomRoute,
} from './routes';

const roomSelect = {
  id: true,
  name: true,
  isPrivate: true,
  ownerId: true,
} satisfies Prisma.RoomSelect;

export const listRoomsHandler: RouteHandler<typeof listRoomsRoute, Env> = async (c) => {
  const rooms = await prisma.room.findMany({
    orderBy: { createdAt: 'desc' },
    select: roomSelect,
  });

  return c.json(rooms, 200);
};

export const getRoomHandler: RouteHandler<typeof getRoomRoute, Env> = async (c) => {
  const { id } = c.req.valid('param');

  const room = await prisma.room.findUnique({
    where: { id },
    select: roomSelect,
  });

  if (isNullish(room)) return c.json({ error: 'Room not found' }, 404);

  return c.json(room, 200);
};

export const createRoomHandler: RouteHandler<typeof createRoomRoute, Env> = async (c) => {
  const { isPrivate, name, password } = c.req.valid('json');
  const ownerId = c.get('userId');

  // Public rooms never carry a password — drop whatever the client sent.
  const storedPassword = isPrivate ? (password ?? null) : null;

  const room = await prisma.room.create({
    data: { name, isPrivate, password: storedPassword, ownerId },
    select: roomSelect,
  });

  return c.json(room, 201);
};

// Only the owner may rename, change password, or flip privacy.
const assertCanManage = async (roomId: string, userId: string) => {
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    select: { ownerId: true, isPrivate: true, password: true },
  });

  if (isNullish(room)) throw new HTTPException(404, { message: 'Room not found' });
  if (room.ownerId !== userId) throw new HTTPException(403, { message: 'Forbidden' });

  return room;
};

export const updateRoomHandler: RouteHandler<typeof updateRoomRoute, Env> = async (c) => {
  const { id } = c.req.valid('param');
  const body = c.req.valid('json');
  const userId = c.get('userId');

  const current = await assertCanManage(id, userId);

  // Privacy and password are coupled:
  //   - turning private OFF clears the stored password so joins skip the check
  //   - a new password replaces the stored one when room stays/becomes private
  //   - keeping isPrivate true without a new password leaves the existing one
  const data: Prisma.RoomUpdateInput = {};

  if (isNonNullish(body.name)) data.name = body.name;

  if (isNonNullish(body.isPrivate)) {
    data.isPrivate = body.isPrivate;

    if (body.isPrivate === false) data.password = null;
  }

  if (isNonNullish(body.password)) {
    const willBePrivate = body.isPrivate ?? current.isPrivate;

    if (willBePrivate) data.password = body.password;
  }

  const room = await prisma.room.update({
    where: { id },
    data,
    select: roomSelect,
  });

  return c.json(room, 200);
};

export const deleteRoomHandler: RouteHandler<typeof deleteRoomRoute, Env> = async (c) => {
  const { id } = c.req.valid('param');
  const userId = c.get('userId');

  await assertCanManage(id, userId);
  await prisma.room.delete({ where: { id } });

  return c.body(null, 204);
};
