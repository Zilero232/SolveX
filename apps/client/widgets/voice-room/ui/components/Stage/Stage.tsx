'use client';

import { GridLayout, useTracks } from '@livekit/components-react';
import { Track } from 'livekit-client';

import { TileWithVisualizer } from '../TileWithVisualizer';
import { stageStyles as s } from './Stage.styles';

export const Stage = () => {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );

  return (
    <GridLayout className={s.root} tracks={tracks}>
      <TileWithVisualizer />
    </GridLayout>
  );
};
