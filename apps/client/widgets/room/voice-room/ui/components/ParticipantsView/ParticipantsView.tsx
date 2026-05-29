'use client';

import { useParticipants, useRoomContext } from '@livekit/components-react';
import { useRoomParticipants } from '@/entities/room/room';
import { ParticipantCard } from '../ParticipantCard';
import { participantsViewStyles as s } from './ParticipantsView.styles';

export const ParticipantsView = () => {
  const room = useRoomContext();
  const participants = useParticipants();

  const presence = useRoomParticipants(room.name);
  const deafenedIds = new Set(presence.filter((p) => p.deafened).map((p) => p.identity));

  return (
    <div className={s.root}>
      <div className={s.grid}>
        {participants.map((participant) => (
          <ParticipantCard
            key={participant.identity}
            participant={participant}
            deafened={deafenedIds.has(participant.identity)}
          />
        ))}
      </div>
    </div>
  );
};
