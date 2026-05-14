import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';

import type { AuthVars } from '../middleware/auth';
import type {Room} from '../schemas/rooms';

import { prisma } from '../lib/prisma';
import { createRoomInputSchema  } from '../schemas/rooms';

const toDto = (row: {
  id: string;
  name: string;
  slug: string;
  isPrivate: boolean;
  createdById: string;
  createdAt: Date;
}): Room => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  is_private: row.isPrivate,
  created_by: row.createdById,
  created_at: row.createdAt.toISOString(),
});

export const roomsRouter = new Hono<{ Variables: AuthVars }>()
  .get('/', async (c) => {
    const rows = await prisma.room.findMany({ orderBy: { createdAt: 'desc' } });

    return c.json(rows.map(toDto));
  })
  .post('/', zValidator('json', createRoomInputSchema), async (c) => {
    const userId = c.get('userId');
    const input = c.req.valid('json');

    const row = await prisma.room.create({
      data: {
        name: input.name,
        slug: input.name.toLowerCase(),
        isPrivate: input.isPrivate,
        createdById: userId,
      },
    });

    return c.json(toDto(row), 201);
  })
  .delete('/:id', async (c) => {
    const userId = c.get('userId');
    const id = c.req.param('id');

    const room = await prisma.room.findUnique({ where: { id }, select: { createdById: true } });

    if (!room) return c.json({ error: 'Room not found' }, 404);
    if (room.createdById !== userId) return c.json({ error: 'Forbidden' }, 403);

    await prisma.room.delete({ where: { id } });

    return c.body(null, 204);
  });
