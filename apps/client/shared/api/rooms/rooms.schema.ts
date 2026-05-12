import { z } from 'zod';

export const roomSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1).max(64),
  is_private: z.boolean(),
  created_by: z.uuid(),
  created_at: z.string(),
});

export const createRoomInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name required')
    .max(64, 'Max 64 chars')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Only letters, digits, _ and -'),
  isPrivate: z.boolean().default(false),
});

export type Room = z.infer<typeof roomSchema>;
export type CreateRoomInput = z.infer<typeof createRoomInputSchema>;
