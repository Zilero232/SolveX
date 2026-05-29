import { z } from 'zod';

export const userProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatarUrl: z.string().nullable().default(null),
  profileUrl: z.string().nullable().default(null),
  bannerColor: z.string().nullable().default(null),
  bio: z.string().nullable().default(null),
  verified: z.boolean().default(false),
});
