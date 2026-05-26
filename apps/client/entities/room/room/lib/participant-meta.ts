import { participantMetadataSchema, safeJsonParse } from '@chatovo/schemas';

export const readParticipantMeta = (metadata: string | undefined) => {
  return participantMetadataSchema.parse(safeJsonParse(metadata));
};
