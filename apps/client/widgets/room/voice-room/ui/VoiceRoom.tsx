'use client';

import { ControlBar, LiveKitRoom, RoomAudioRenderer } from '@livekit/components-react';
import { useBoolean } from '@siberiacancode/reactuse';
import { MessageSquare } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';
import { cn } from '@/shared/lib';
import { Button } from '@/shared/ui';
import { useAppSettings } from '@/widgets/app/app-settings';
import { FAILURE_REASONS } from '../config';
import { RoomChatProvider, usePttActive } from '../model';
import { ChatPanel, ConnectingOverlay, ConnectionIndicator, ParticipantsView } from './components';
import { RoomControllers } from './controllers';
import { voiceRoomStyles as s } from './VoiceRoom.styles';
import type { VoiceRoomProps } from './VoiceRoom.types';

export const VoiceRoom = ({
  roomName,
  serverUrl,
  token,
  onConnectFailure,
  onLeave,
}: VoiceRoomProps) => {
  const t = useTranslations('chat');
  const { settings } = useAppSettings();

  const [isChatOpen, toggleChat] = useBoolean(false);

  const hasConnectedRef = useRef(false);
  const audioCaptureRef = useRef(settings.audio);

  const pttState = usePttActive();

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
              <div
                className={cn(
                  s.controlBar,
                  pttState !== 'off' && s.controlBarPttIdle,
                  pttState === 'active' && s.controlBarPttActive,
                )}
                data-lk-theme="default"
              >
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

            <RoomAudioRenderer />
            <RoomControllers isChatOpen={isChatOpen} />
          </RoomChatProvider>
        </LiveKitRoom>
      </div>
    </div>
  );
};
