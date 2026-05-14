import { z } from 'zod';

export const createRoomInputSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Name required')
      .max(64, 'Max 64 chars')
      .regex(/^[\w\s-]+$/, 'Only letters, digits, spaces, _ and -'),
    isPrivate: z.boolean().default(false),
    password: z.string().min(4, 'Min 4 chars').max(128, 'Max 128 chars').optional(),
  })
  .refine((data) => !data.isPrivate || (data.password && data.password.length >= 4), {
    message: 'Password required for private rooms',
    path: ['password'],
  });
