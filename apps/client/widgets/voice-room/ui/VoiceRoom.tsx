'use client';

import { ControlBar, LiveKitRoom, RoomAudioRenderer } from '@livekit/components-react';
import { useBoolean } from '@siberiacancode/reactuse';
import { DisconnectReason } from 'livekit-client';
import { MessageSquare, Volume2 } from 'lucide-react';
import { useRef } from 'react';
import { Button } from '@/shared/ui';
import { RoomChatProvider } from '../model';
import { ChatPanel, ParticipantsView } from './components';
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

  return (
    <div className={s.root}>
      <div className={s.frame}>
        <LiveKitRoom
          connect
          audio
          className={s.room}
          data-lk-theme="default"
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
              <Volume2 className={s.headerIcon} />
              <span className={s.headerTitle}>{roomName}</span>
              <Button
                aria-label={isChatOpen ? 'Hide chat' : 'Show chat'}
                aria-pressed={isChatOpen}
                size="icon-sm"
                type="button"
                variant={isChatOpen ? 'secondary' : 'ghost'}
                onClick={() => toggleChat()}
              >
                <MessageSquare />
              </Button>
            </div>

            <div className={s.body}>
              <ParticipantsView />
            </div>

            <div className={s.controls} data-lk-theme="default">
              <ControlBar variation="minimal" />
            </div>

            <RoomAudioRenderer />

            <ChatPanel isOpen={isChatOpen} onClose={() => toggleChat(false)} />
          </RoomChatProvider>
        </LiveKitRoom>
      </div>
    </div>
  );
};
