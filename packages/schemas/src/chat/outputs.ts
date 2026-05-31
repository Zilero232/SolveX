import { z } from 'zod';

export const chatAttachmentSchema = z.object({
  kind: z.literal('attachment'),
  url: z.url(),
  name: z.string().min(1).max(255),
  size: z.number().int().nonnegative(),
  mime: z.string().min(1).max(255),
});

export const chatMessageSchema = z.object({
  id: z.uuid(),
  roomId: z.uuid(),
  senderId: z.uuid().nullable(),
  senderName: z.string(),
  body: z.string(),
  createdAt: z.string(),
});

export const chatMessagesPageSchema = z.object({
  items: z.array(chatMessageSchema),
  nextCursor: z.string().nullable(),
});
