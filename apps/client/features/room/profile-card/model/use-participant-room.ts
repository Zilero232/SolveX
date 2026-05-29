'use client';

import { entries, find, isNullish, pipe } from 'remeda';
import { useRooms, useRoomsPresence } from '@/entities/room/room';

export type ParticipantRoom = {
  roomId: string;
  roomName: string;
};

export const useParticipantRoom = (identity: string): ParticipantRoom | null => {
  const presence = useRoomsPresence();
  const { rooms } = useRooms();

  const entry = pipe(
    entries(presence),
    find(([, participants]) => participants.some((p) => p.identity === identity)),
  );

  if (isNullish(entry)) return null;

  const [roomId] = entry;
  const roomName = find(rooms, (room) => room.id === roomId)?.name ?? roomId;

  return { roomId, roomName };
};
