'use client';

import { useVoiceRoomSounds } from '../../../model';

// Runs inside LiveKitRoom so it can subscribe to room/participant events.
export const RoomSoundsController = ({ isChatOpen }: { isChatOpen: boolean }) => {
  useVoiceRoomSounds(isChatOpen);

  return null;
};
