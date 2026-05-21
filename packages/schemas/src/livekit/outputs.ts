import { z } from 'zod';

export const tokenResponseSchema = z.object({
  token: z.string(),
});

export const roomParticipantSchema = z.object({
  identity: z.string(),
  name: z.string(),
});

// SSE payload pushed to clients: the full participant list of every active
// room, keyed by roomId. The client replaces its cache wholesale on each event.
export const roomsParticipantsSnapshotSchema = z.object({
  rooms: z.record(z.string(), z.array(roomParticipantSchema)),
});
