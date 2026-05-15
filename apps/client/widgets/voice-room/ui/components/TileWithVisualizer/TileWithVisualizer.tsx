'use client';

import {
  BarVisualizer,
  ParticipantTile,
  useMaybeTrackRefContext,
  useParticipantTracks,
} from '@livekit/components-react';
import { Track } from 'livekit-client';

import { tileWithVisualizerStyles as s } from './TileWithVisualizer.styles';

export const TileWithVisualizer = () => {
  const trackRef = useMaybeTrackRefContext();
  const participant = trackRef?.participant;
  const [micTrack] = useParticipantTracks(
    [Track.Source.Microphone],
    participant?.identity,
  );

  return (
    <div className={s.root}>
      <ParticipantTile />
      {micTrack ? (
        <BarVisualizer barCount={10} className={s.visualizer} track={micTrack}>
          <span className={s.bar} />
        </BarVisualizer>
      ) : null}
    </div>
  );
};
