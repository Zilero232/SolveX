'use client';

import { BarVisualizer, useParticipantTracks } from '@livekit/components-react';
import { Track } from 'livekit-client';
import { MicOff } from 'lucide-react';

import { CardVideo } from './CardVideo';
import { ParticipantAvatar } from './ParticipantAvatar';
import { participantCardStyles as s } from './ParticipantCard.styles';
import type { ParticipantCardProps } from './ParticipantCard.types';

export const ParticipantCard = ({ participant }: ParticipantCardProps) => {
  const [cameraTrack] = useParticipantTracks([Track.Source.Camera], participant.identity);
  const [screenTrack] = useParticipantTracks([Track.Source.ScreenShare], participant.identity);
  const [micTrack] = useParticipantTracks([Track.Source.Microphone], participant.identity);

  const displayName = participant.name || participant.identity;

  // A track may be published but muted; the *Enabled getters account for that.
  const hasCamera = !!cameraTrack && participant.isCameraEnabled;
  const hasScreen = !!screenTrack && participant.isScreenShareEnabled;
  const hasVideo = hasCamera || hasScreen;

  return (
    <div className={s.root}>
      <div className={s.stage}>
        {hasVideo ? (
          <div className={s.videoGrid}>
            {hasCamera && cameraTrack ? <CardVideo trackRef={cameraTrack} /> : null}
            {hasScreen && screenTrack ? <CardVideo trackRef={screenTrack} /> : null}
          </div>
        ) : (
          <ParticipantAvatar name={displayName} />
        )}

        {!hasVideo && micTrack ? (
          <BarVisualizer barCount={5} className={s.visualizer} track={micTrack}>
            <span className={s.bar} />
          </BarVisualizer>
        ) : null}
      </div>

      <div className={s.metadata}>
        {participant.isMicrophoneEnabled ? null : <MicOff className={s.micIcon} />}
        <span className={s.name}>{displayName}</span>
      </div>
    </div>
  );
};
