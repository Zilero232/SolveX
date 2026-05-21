import type { Participant } from 'livekit-client';
import type { ReactNode } from 'react';

export type ParticipantCardMenuProps = {
  participant: Participant;
  children: ReactNode;
};
