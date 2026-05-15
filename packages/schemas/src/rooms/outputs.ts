import { z } from 'zod';

export const roomSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1).max(64),
  isPrivate: z.boolean(),
});
