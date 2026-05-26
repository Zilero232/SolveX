'use client';

import { useRoomsPresence } from '../rooms-presence';
import type { RoomParticipant } from '@chatovo/schemas';

const EMPTY: RoomParticipant[] = [];

export const useRoomParticipants = (roomId: string | null): RoomParticipant[] => {
  const rooms = useRoomsPresence();

  return (roomId && rooms[roomId]) || EMPTY;
};
