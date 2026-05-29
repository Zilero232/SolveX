import { z } from 'zod';

export const passwordSchema = z.object({
  password: z.string().trim().min(1, 'required'),
});
