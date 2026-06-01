'use client';

import { useParticipants, useRoomContext } from '@livekit/components-react';
import { RoomEvent } from 'livekit-client';
import { useRoomParticipants } from '@/entities/room/room';
import { ParticipantCard } from '../ParticipantCard';
import { participantsViewStyles as s } from './ParticipantsView.styles';

const ROSTER_EVENTS = [
  RoomEvent.ParticipantConnected,
  RoomEvent.ParticipantDisconnected,
  RoomEvent.ConnectionStateChanged,
];

export const ParticipantsView = () => {
  const room = useRoomContext();
  const participants = useParticipants({ updateOnlyOn: ROSTER_EVENTS });

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
