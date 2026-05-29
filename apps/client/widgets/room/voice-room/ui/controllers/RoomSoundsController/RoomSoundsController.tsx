'use client';

import { useVoiceRoomSounds } from '../../../model';

export const RoomSoundsController = ({ isChatOpen }: { isChatOpen: boolean }) => {
  useVoiceRoomSounds(isChatOpen);

  return null;
};
