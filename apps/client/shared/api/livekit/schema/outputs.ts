import { z } from 'zod';

export const tokenResponseSchema = z.object({
  token: z.string(),
  url: z.string(),
  isAdmin: z.boolean(),
});
