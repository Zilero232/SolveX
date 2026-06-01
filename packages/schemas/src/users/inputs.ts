import { z } from 'zod';

export const updateProfileInputSchema = z.object({
  displayName: z.string(),
  profileUrl: z.string(),
  bannerColor: z.string().nullable(),
  bio: z.string(),
  avatar: z.instanceof(File).nullable().optional(),
});
