import type { z } from 'zod';
import type { userProfileSchema } from './outputs';

export type UserProfile = z.infer<typeof userProfileSchema>;
