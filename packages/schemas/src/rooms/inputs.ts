import { z } from 'zod';

export const createRoomInputSchema = z
  .object({
    isPrivate: z.boolean(),
    name: z
      .string()
      .trim()
      .min(1, 'Name required')
      .max(64, 'Max 64 chars')
      .regex(/^[\w\s-]+$/, 'Only letters, digits, spaces, _ and -'),
    password: z
      .string()
      .min(4, 'Min 4 chars')
      .max(128, 'Max 128 chars')
      .optional()
      .or(z.literal('').transform(() => undefined)),
  })
  .refine((data) => !data.isPrivate || (data.password && data.password.length >= 4), {
    message: 'Password required for private rooms',
    path: ['password'],
  });
