'use client';

import { BarVisualizer, useIsSpeaking, useParticipantTracks } from '@livekit/components-react';
import { Track } from 'livekit-client';
import { HeadphoneOff, MicOff, ScreenShare } from 'lucide-react';
import { isNonNullish } from 'remeda';
import { UserName } from '@/entities/auth/user';
import { readParticipantMeta } from '@/entities/room/room';
import { ProfileCardTrigger } from '@/features/room/profile-card';
import { CardVideo } from '../CardVideo';
import { ParticipantCardMenu } from '../ParticipantCardMenu';
import { participantCardStyles as s } from './ParticipantCard.styles';
import type { ParticipantCardProps } from './ParticipantCard.types';

export const ParticipantCard = ({ participant, deafened }: ParticipantCardProps) => {
  const [cameraTrack] = useParticipantTracks([Track.Source.Camera], participant.identity);
  const [screenTrack] = useParticipantTracks([Track.Source.ScreenShare], participant.identity);
  const [micTrack] = useParticipantTracks([Track.Source.Microphone], participant.identity);

  const isSpeaking = useIsSpeaking(participant);
  const displayName = participant.name || participant.identity;
  const { verified } = readParticipantMeta(participant.metadata);

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

        {hasScreen && (
          <div className={s.badges}>
            <span className={s.badge}>
              <ScreenShare className={s.badgeIcon} />
              share
            </span>
          </div>
        )}

        <div className={s.metadata}>
          {!participant.isMicrophoneEnabled && <MicOff className={s.micIcon} />}
          {deafened && <HeadphoneOff className={s.micIcon} />}
          <ProfileCardTrigger identity={participant.identity} name={displayName}>
            <button className={s.nameTrigger} type="button">
              <UserName name={displayName} verified={verified} className={s.name} />
            </button>
          </ProfileCardTrigger>
        </div>
      </div>
    </ParticipantCardMenu>
  );
};
