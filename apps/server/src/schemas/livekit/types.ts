import type { z } from 'zod';

import type { tokenRequestSchema } from './inputs';
import type { tokenResponseSchema } from './outputs';

export type TokenRequest = z.infer<typeof tokenRequestSchema>;
export type TokenResponse = z.infer<typeof tokenResponseSchema>;
