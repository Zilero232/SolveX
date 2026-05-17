import { z } from 'zod';

export const tokenResponseSchema = z.object({
  token: z.string(),
});
