import { HTTPException } from 'hono/http-exception';
import { extension } from 'mime-types';
import { isNullish } from 'remeda';
import { prisma } from '../../lib/prisma';
import { supabaseAdmin } from '../../lib/supabase';
import { resolveDisplayName } from '../../lib/user-profile';
import type { ChatAttachment, ChatMessage } from '@chatovo/schemas';
import type { RouteHandler } from '@hono/zod-openapi';
import type { Prisma } from '../../../generated';
import type { Env } from '../shared/types';
import type { listMessagesRoute, sendMessageRoute, uploadAttachmentRoute } from './routes';

const senderSelect = { select: { email: true, raw_user_meta_data: true } } as const;

type MessageWithSender = Prisma.MessageGetPayload<{ include: { sender: typeof senderSelect } }>;

const ATTACHMENT_BUCKET = 'chat-attachments';
const ATTACHMENT_MAX_BYTES = 25 * 1024 * 1024;

const assertRoomExists = async (roomId: string): Promise<void> => {
  const room = await prisma.room.findUnique({ where: { id: roomId }, select: { id: true } });

  if (isNullish(room)) throw new HTTPException(404, { message: 'Room not found' });
};

export const uploadAttachmentHandler: RouteHandler<typeof uploadAttachmentRoute, Env> = async (
  c,
) => {
  const { roomId, file } = c.req.valid('form');

  if (file.size === 0) throw new HTTPException(400, { message: 'Empty file' });
  if (file.size > ATTACHMENT_MAX_BYTES) throw new HTTPException(400, { message: 'File too large' });

  await assertRoomExists(roomId);

  const ext = extension(file.type) || 'bin';
  const path = `${roomId}/${crypto.randomUUID()}.${ext}`;
  const buffer = await file.arrayBuffer();

  const { error } = await supabaseAdmin.storage
    .from(ATTACHMENT_BUCKET)
    .upload(path, buffer, { contentType: file.type });

  if (error) return c.json({ error: 'Upload failed' }, 500);

  const { data } = supabaseAdmin.storage.from(ATTACHMENT_BUCKET).getPublicUrl(path);

  const attachment: ChatAttachment = {
    kind: 'attachment',
    url: data.publicUrl,
    name: file.name,
    size: file.size,
    mime: file.type,
  };

  return c.json(attachment, 200);
};

const toChatMessage = (row: MessageWithSender): ChatMessage => {
  const metadata = (row.sender?.raw_user_meta_data ?? {}) as Record<string, unknown>;

  return {
    id: row.id,
    roomId: row.roomId,
    senderId: row.senderId,
    senderName:
      row.sender && row.senderId
        ? resolveDisplayName(metadata, row.sender.email ?? undefined, row.senderId)
        : 'Deleted user',
    body: row.body,
    createdAt: row.createdAt.toISOString(),
  };
};

export const sendMessageHandler: RouteHandler<typeof sendMessageRoute, Env> = async (c) => {
  const userId = c.get('userId');
  const { roomId, body } = c.req.valid('json');

  await assertRoomExists(roomId);

  const message = await prisma.message.create({
    data: { roomId, senderId: userId, body },
    include: { sender: senderSelect },
  });

  return c.json(toChatMessage(message), 200);
};

export const listMessagesHandler: RouteHandler<typeof listMessagesRoute, Env> = async (c) => {
  const { roomId, cursor, limit } = c.req.valid('query');

  await assertRoomExists(roomId);

  const rows = await prisma.message.findMany({
    where: { roomId },
    orderBy: { createdAt: 'desc' },
    take: limit + 1,
    include: { sender: senderSelect },
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  });

  const hasMore = rows.length > limit;
  const page = hasMore ? rows.slice(0, limit) : rows;

  return c.json(
    {
      items: page.reverse().map(toChatMessage),
      nextCursor: hasMore ? (page[0]?.id ?? null) : null,
    },
    200,
  );
};
