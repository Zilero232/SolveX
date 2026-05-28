import { z } from 'zod';

export const tokenResponseSchema = z.object({
  token: z.string(),
});

// Profile facts that travel with a participant — embedded in LiveKit metadata
// at token issue and re-emitted by the presence SSE stream. Kept as a base
// schema so both responses extend the same source.
const participantProfileSchema = z.object({
  verified: z.boolean().default(false),
  profileUrl: z.string().nullable().default(null),
  avatarUrl: z.string().nullable().default(null),
});

// Shape of the JSON string carried in LiveKit participant.metadata. The only
// channel for per-user data like the verified mark.
export const participantMetadataSchema = participantProfileSchema.extend({
  email: z.string().nullable().default(null),
});

export const roomParticipantSchema = participantProfileSchema.extend({
  identity: z.string(),
  name: z.string(),
  // True when the participant has no published, unmuted microphone track.
  // Includes the "joined but mic never published yet" case, which is still
  // effectively silent for everyone else in the room.
  micMuted: z.boolean().default(true),
});

// SSE payload pushed to clients: the full participant list of every active
// room, keyed by roomId. The client replaces its cache wholesale on each event.
export const roomsParticipantsSnapshotSchema = z.object({
  rooms: z.record(z.string(), z.array(roomParticipantSchema)),
  lobbyOnline: z.number().int().nonnegative().default(0),
});
