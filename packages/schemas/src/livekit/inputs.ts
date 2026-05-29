import { z } from 'zod';
import { roomSchema } from '../rooms/outputs';

export const tokenRequestSchema = z.object({
  roomId: roomSchema.shape.id,
  password: z.string().min(1).max(128).optional(),
});

// Client reports a partial presence patch (mic, deafen, ...). LiveKit webhooks
// don't ship mute/attribute toggles, so the client pushes changes directly to
// keep the presence cache live. One endpoint, extensible by adding fields.
export const presenceStateRequestSchema = z.object({
  roomId: roomSchema.shape.id,
  micMuted: z.boolean().optional(),
  deafened: z.boolean().optional(),
});
