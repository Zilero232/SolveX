'use client';

import { ControlBar, LiveKitRoom, RoomAudioRenderer } from '@livekit/components-react';
import { useBoolean } from '@siberiacancode/reactuse';
import { DisconnectReason } from 'livekit-client';
import { MessageSquare } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';
import { Button } from '@/shared/ui';
import { useAppSettings } from '@/widgets/app-settings';
import { RoomChatProvider } from '../model';
import {
  ChatPanel,
  ConnectingOverlay,
  ConnectionIndicator,
  ParticipantsView,
  RoomDeviceSync,
  RoomSounds,
} from './components';
import { voiceRoomStyles as s } from './VoiceRoom.styles';
import type { VoiceRoomProps } from './VoiceRoom.types';

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
  onLeave,
  onConnectFailure,
}: VoiceRoomProps) => {
  const t = useTranslations('chat');
  const hasConnectedRef = useRef(false);
  const [isChatOpen, toggleChat] = useBoolean(false);

  const { settings } = useAppSettings();

  // Seed the mic's processing flags for the initial capture. The `audio` prop
  // is read only on the first connect, so a ref freezes it — later changes are
  // applied live by useDeviceSync (processing flags and device alike), which
  // also owns picking the actual input device. Keeping deviceId out of here
  // leaves useDeviceSync as the single path that selects devices.
  const audioCaptureRef = useRef(settings.audio);

  return (
    <div className={s.root}>
      <div className={s.frame}>
        <LiveKitRoom
          connect
          audio={audioCaptureRef.current}
          className={s.room}
          data-lk-theme="default"
          options={{ webAudioMix: true }}
          serverUrl={serverUrl}
          token={token}
          video={false}
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
          <RoomChatProvider>
            <div className={s.header}>
              <span className={s.headerTitle}>{roomName}</span>
              <ConnectionIndicator />
            </div>

            <div className={s.body}>
              <ParticipantsView />
              <ConnectingOverlay roomName={roomName} />
            </div>

            <div className={s.controls}>
              <div className={s.controlBar} data-lk-theme="default">
                <ControlBar variation="minimal" />
              </div>

              <Button
                aria-label={isChatOpen ? t('hide') : t('open')}
                aria-pressed={isChatOpen}
                className={s.chatButton}
                size="icon-lg"
                type="button"
                variant={isChatOpen ? 'secondary' : 'ghost'}
                onClick={() => toggleChat()}
              >
                <MessageSquare />
              </Button>
            </div>

            <ChatPanel isOpen={isChatOpen} onClose={() => toggleChat(false)} />

            <RoomDeviceSync />
            <RoomAudioRenderer />
            <RoomSounds isChatOpen={isChatOpen} />
          </RoomChatProvider>
        </LiveKitRoom>
      </div>
    </div>
  );
};
