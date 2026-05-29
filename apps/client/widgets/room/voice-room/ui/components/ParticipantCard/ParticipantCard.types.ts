import type { Participant } from 'livekit-client';

export type ParticipantCardProps = {
  participant: Participant;
  deafened: boolean;
};
