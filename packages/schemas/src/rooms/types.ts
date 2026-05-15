import type { z } from 'zod';

import type { createRoomInputSchema } from './inputs';
import type { roomSchema } from './outputs';

export type Room = z.infer<typeof roomSchema>;
export type CreateRoomInput = z.output<typeof createRoomInputSchema>;
export type CreateRoomRawInput = z.input<typeof createRoomInputSchema>;

export type CreateRoomRequest = CreateRoomInput;
export type RoomResponse = Room;
