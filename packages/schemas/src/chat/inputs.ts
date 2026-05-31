import { z } from 'zod';

export const sendMessageInputSchema = z.object({
  roomId: z.uuid(),
  body: z.string().min(1).max(4000),
});

export const listMessagesQuerySchema = z.object({
  roomId: z.uuid(),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});
