'use client';

import { BarVisualizer, useIsSpeaking, useParticipantTracks } from '@livekit/components-react';
import { Track } from 'livekit-client';
import { MicOff } from 'lucide-react';
import { isNonNullish } from 'remeda';
import { readParticipantMeta } from '@/entities/room/room';
import { UserName } from '@/entities/auth/user';
import { CardVideo } from '../CardVideo';
import { ParticipantCardMenu } from '../ParticipantCardMenu';
import { participantCardStyles as s } from './ParticipantCard.styles';
import type { ParticipantCardProps } from './ParticipantCard.types';

export const ParticipantCard = ({ participant }: ParticipantCardProps) => {
  const [cameraTrack] = useParticipantTracks([Track.Source.Camera], participant.identity);
  const [screenTrack] = useParticipantTracks([Track.Source.ScreenShare], participant.identity);
  const [micTrack] = useParticipantTracks([Track.Source.Microphone], participant.identity);

  const isSpeaking = useIsSpeaking(participant);
  const displayName = participant.name || participant.identity;
  const { profileUrl, verified } = readParticipantMeta(participant.metadata);

  // A track may be published but muted; the *Enabled getters account for that.
  const hasCamera = isNonNullish(cameraTrack) && participant.isCameraEnabled;
  const hasScreen = isNonNullish(screenTrack) && participant.isScreenShareEnabled;
  const hasVideo = hasCamera || hasScreen;

  return (
    <ParticipantCardMenu participant={participant}>
      <div className={s.root} data-speaking={isSpeaking}>
        <div className={s.stage}>
          {hasVideo ? (
            <div className={s.videoGrid}>
              {hasCamera && cameraTrack && <CardVideo trackRef={cameraTrack} />}
              {hasScreen && screenTrack && <CardVideo trackRef={screenTrack} />}
            </div>
          ) : (
            <div className={s.audioStage}>
              <BarVisualizer barCount={5} className={s.visualizer} track={micTrack}>
                <span className={s.bar} />
              </BarVisualizer>
            </div>
          )}
        </div>

        <div className={s.metadata}>
          {!participant.isMicrophoneEnabled && <MicOff className={s.micIcon} />}
          <UserName
            name={displayName}
            verified={verified}
            profileUrl={profileUrl}
            className={s.name}
          />
        </div>
      </div>
    </ParticipantCardMenu>
  );
};
