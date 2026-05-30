'use client';

import { LiveKitRoom } from '@livekit/components-react';
import { useBoolean } from '@siberiacancode/reactuse';
import { AudioLines, MessageSquare } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';
import { useRecentRooms } from '@/entities/room/room';
import {
  DeafenProvider,
  ReactionsOverlay,
  ReactionsProvider,
  RoomAudio,
  RoomControlBar,
} from '@/features/room/room-control';
import { Button } from '@/shared/ui';
import { useAppSettings } from '@/widgets/app/app-settings';
import { FAILURE_REASONS } from '../config';
import { RoomChatProvider } from '../model';
import { ChatPanel, ConnectingOverlay, ConnectionIndicator, ParticipantsView } from './components';
import { RoomControllers } from './controllers';
import { voiceRoomStyles as s } from './VoiceRoom.styles';
import type { VoiceRoomProps } from './VoiceRoom.types';

const RoomHeader = ({ name }: { name: string }) => {
  return (
    <div className={s.header}>
      <span aria-hidden className={s.headerIcon}>
        <AudioLines className="size-4" />
      </span>

      <div className={s.headerInfo}>
        <span className={s.headerTitle}>{name}</span>
      </div>

      <ConnectionIndicator />
    </div>
  );
};

export const VoiceRoom = ({
  roomId,
  roomName,
  serverUrl,
  token,
  onConnectFailure,
  onLeave,
}: VoiceRoomProps) => {
  const t = useTranslations('chat');
  const { settings } = useAppSettings();
  const { push: pushRecent } = useRecentRooms();

  const [isChatOpen, toggleChat] = useBoolean(false);

  const hasConnectedRef = useRef(false);
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
            pushRecent(roomId);
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
            <DeafenProvider>
              <ReactionsProvider>
                <RoomHeader name={roomName} />

                <div className={s.body}>
                  <ParticipantsView />
                  <ReactionsOverlay />
                  <ConnectingOverlay roomName={roomName} />
                </div>

                <div className={s.controls}>
                  <div className={s.controlBarWrap}>
                    <RoomControlBar />
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

                <RoomAudio />
                <RoomControllers roomId={roomId} />
              </ReactionsProvider>
            </DeafenProvider>
          </RoomChatProvider>
        </LiveKitRoom>
      </div>
    </div>
  );
};
