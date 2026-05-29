import type { z } from 'zod';
import type { presenceStateRequestSchema, tokenRequestSchema } from './inputs';
import type {
  participantMetadataSchema,
  roomParticipantSchema,
  roomsParticipantsSnapshotSchema,
  tokenResponseSchema,
} from './outputs';

export type TokenRequest = z.infer<typeof tokenRequestSchema>;
export type TokenResponse = z.infer<typeof tokenResponseSchema>;
export type PresenceStateRequest = z.infer<typeof presenceStateRequestSchema>;
export type ParticipantMetadata = z.infer<typeof participantMetadataSchema>;
export type RoomParticipant = z.infer<typeof roomParticipantSchema>;
export type RoomsParticipantsSnapshot = z.infer<typeof roomsParticipantsSnapshotSchema>;
