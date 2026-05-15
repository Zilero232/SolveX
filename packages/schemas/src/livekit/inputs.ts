import { z } from 'zod';

export const tokenRequestSchema = z.object({
  roomId: z.uuid(),
  password: z.string().min(1).max(128).optional(),
});
