'use client';

import {
  ControlBar,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
} from '@livekit/components-react';
import { DisconnectReason, Track } from 'livekit-client';
import { Volume2 } from 'lucide-react';
import { useRef } from 'react';

import { voiceRoomStyles as s } from './VoiceRoom.styles';
import type { VoiceRoomProps } from './VoiceRoom.types';

const FAILURE_REASONS = new Set<DisconnectReason>([
  DisconnectReason.JOIN_FAILURE,
  DisconnectReason.SIGNAL_CLOSE,
  DisconnectReason.SERVER_SHUTDOWN,
  DisconnectReason.STATE_MISMATCH,
]);

const Stage = () => {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );

  return (
    <GridLayout className={s.stage} tracks={tracks}>
      <ParticipantTile />
    </GridLayout>
  );
};

export const VoiceRoom = ({
  token,
  serverUrl,
  roomName,
  userChoices,
  onLeave,
  onConnectFailure,
}: VoiceRoomProps) => {
  const hasConnectedRef = useRef(false);

  return (
    <LiveKitRoom
      className={s.root}
      token={token}
      serverUrl={serverUrl}
      connect
      audio={
        userChoices.audioEnabled ? { deviceId: userChoices.audioDeviceId || undefined } : false
      }
      video={
        userChoices.videoEnabled ? { deviceId: userChoices.videoDeviceId || undefined } : false
      }
      data-lk-theme="default"
      onConnected={() => {
        hasConnectedRef.current = true;
      }}
      onDisconnected={(reason) => {
        if (!hasConnectedRef.current) {
          if (reason !== undefined && FAILURE_REASONS.has(reason)) onConnectFailure(reason);

          return;
        }

        onLeave();
      }}
    >
      <div className={s.header}>
        <Volume2 className={s.headerIcon} />
        <span className={s.headerTitle}>{roomName}</span>
      </div>

      <Stage />

      <div className={s.controls} data-lk-theme="default">
        <ControlBar controls={{ chat: false, settings: false }} variation="minimal" />
      </div>

      <RoomAudioRenderer />
    </LiveKitRoom>
  );
};
