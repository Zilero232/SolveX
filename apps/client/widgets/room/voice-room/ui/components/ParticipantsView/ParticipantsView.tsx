'use client';

import { useParticipants } from '@livekit/components-react';
import { ParticipantCard } from '../ParticipantCard';
import { participantsViewStyles as s } from './ParticipantsView.styles';

export const ParticipantsView = () => {
  const participants = useParticipants();

  return (
    <div className={s.root}>
      <div className={s.grid}>
        {participants.map((participant) => (
          <ParticipantCard key={participant.identity} participant={participant} />
        ))}
      </div>
    </div>
  );
};
