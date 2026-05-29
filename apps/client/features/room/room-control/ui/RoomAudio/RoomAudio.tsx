'use client';

import { RoomAudioRenderer } from '@livekit/components-react';
import { useDeafen } from '../../model/hooks/use-deafen';

export const RoomAudio = () => {
  const { isDeafened } = useDeafen();

  return <RoomAudioRenderer muted={isDeafened} />;
};
