import { zValidator } from '@hono/zod-validator';
import { createRoomInputSchema } from '@solvex/schemas/rooms';
import { Hono } from 'hono';

import type { AuthVars } from '../middleware/auth';

import { hashPassword } from '../lib/password';
import { prisma } from '../lib/prisma';

export const roomsRouter = new Hono<{ Variables: AuthVars }>()
  .get('/', async (c) => {
    const rooms = await prisma.room.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, isPrivate: true },
    });

    return c.json(rooms);
  })
  .post('/', zValidator('json', createRoomInputSchema), async (c) => {
    const userId = c.get('userId');
    const { isPrivate, name, password } = c.req.valid('json');

    const passwordHash = isPrivate && password ? await hashPassword(password) : null;

    const room = await prisma.room.create({
      data: { name, isPrivate, passwordHash, createdById: userId },
      select: { id: true, name: true, isPrivate: true },
    });

    return c.json(room, 201);
  })
  .delete('/:id', async (c) => {
    const userId = c.get('userId');
    const { id } = c.req.param();

    const room = await prisma.room.findUnique({
      where: { id },
      select: { createdById: true },
    });

    if (!room) return c.json({ error: 'Room not found' }, 404);
    if (room.createdById !== userId) return c.json({ error: 'Forbidden' }, 403);

    await prisma.room.delete({ where: { id } });

    return c.body(null, 204);
  });
