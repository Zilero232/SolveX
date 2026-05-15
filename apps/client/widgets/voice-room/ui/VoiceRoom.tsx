'use client';

import {
  ControlBar,
  LiveKitRoom,
  RoomAudioRenderer,
} from '@livekit/components-react';
import { DisconnectReason } from 'livekit-client';
import { Volume2 } from 'lucide-react';
import { useRef } from 'react';

import type { VoiceRoomProps } from './VoiceRoom.types';

import { Stage } from './components/Stage';
import { voiceRoomStyles as s } from './VoiceRoom.styles';

const FAILURE_REASONS = new Set<DisconnectReason>([
  DisconnectReason.JOIN_FAILURE,
  DisconnectReason.SIGNAL_CLOSE,
  DisconnectReason.SERVER_SHUTDOWN,
  DisconnectReason.STATE_MISMATCH,
]);

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
      connect
      audio={
        userChoices.audioEnabled ? { deviceId: userChoices.audioDeviceId || undefined } : false
      }
      video={
        userChoices.videoEnabled ? { deviceId: userChoices.videoDeviceId || undefined } : false
      }
      className={s.root}
      data-lk-theme="default"
      serverUrl={serverUrl}
      token={token}
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
