import type { z } from 'zod';

import type { createRoomInputSchema } from './inputs';
import type { roomSchema } from './outputs';

export type Room = z.infer<typeof roomSchema>;
export type CreateRoomInput = z.infer<typeof createRoomInputSchema>;
