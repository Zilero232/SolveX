'use client';

import { ControlBar, LiveKitRoom, RoomAudioRenderer } from '@livekit/components-react';
import { useBoolean } from '@siberiacancode/reactuse';
import { DisconnectReason } from 'livekit-client';
import { MessageSquare } from 'lucide-react';
import { useRef } from 'react';
import { Button } from '@/shared/ui';
import { useAppSettings } from '@/widgets/app-settings';
import { RoomChatProvider } from '../model';
import { ChatPanel, ConnectionIndicator, ParticipantsView, RoomSounds } from './components';
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
  const hasConnectedRef = useRef(false);
  const [isChatOpen, toggleChat] = useBoolean(false);

  const { settings } = useAppSettings();

  // Capture the audio processing flags once at mount. The `audio` prop is read
  // only on the initial connect, so seeding it from a ref keeps later toggles
  // (handled live by AudioSettings via setMicrophoneEnabled) from forcing a
  // reconnect when the persisted settings change mid-call.
  const audioCaptureRef = useRef({
    noiseSuppression: settings.noiseSuppression,
    echoCancellation: settings.echoCancellation,
    autoGainControl: settings.autoGainControl,
  });

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
            <RoomSounds isChatOpen={isChatOpen} />

            <div className={s.header}>
              <span className={s.headerTitle}>{roomName}</span>
              <ConnectionIndicator />
            </div>

            <div className={s.body}>
              <ParticipantsView />
            </div>

            <div className={s.controls}>
              <div className={s.controlBar} data-lk-theme="default">
                <ControlBar variation="minimal" />
              </div>

              <Button
                aria-label={isChatOpen ? 'Hide chat' : 'Show chat'}
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

            <RoomAudioRenderer />

            <ChatPanel isOpen={isChatOpen} onClose={() => toggleChat(false)} />
          </RoomChatProvider>
        </LiveKitRoom>
      </div>
    </div>
  );
};
