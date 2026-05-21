'use client';

import { useRoomsPresence } from './rooms-presence';
import type { RoomParticipant } from '@chatovo/schemas/livekit';

const EMPTY: RoomParticipant[] = [];

/**
 * Live participant list for a single room, sourced from the shared presence
 * SSE stream — no per-room polling. Must be used within RoomsPresenceProvider.
 */
export const useRoomParticipants = (roomId: string | null): RoomParticipant[] => {
  const rooms = useRoomsPresence();

  return (roomId && rooms[roomId]) || EMPTY;
};
