'use client';

import { useLocalParticipant } from '@livekit/components-react';
import { useAutoScroll } from '@siberiacancode/reactuse';
import { Paperclip } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { isEmpty, sortBy } from 'remeda';
import { sendChatMessage } from '@/shared/api';
import { useRoomChat } from '../model/contexts';
import { useChatFiles, useChatHistory } from '../model/hooks';
import { liveMessageToChatLine } from '../model/lib';
import { chatPanelStyles as s } from './ChatPanel.styles';
import { ChatComposer, ChatEmpty, ChatHeader, ChatMessageItem } from './components';
import type { ChatPanelProps } from './ChatPanel.types';

export const ChatPanel = ({ roomId, isOpen, onClose }: ChatPanelProps) => {
  const t = useTranslations('chat');

  const { isSending, chatMessages, send } = useRoomChat();
  const { localParticipant } = useLocalParticipant();

  const history = useChatHistory(roomId);

  const listRef = useAutoScroll<HTMLDivElement>();

  const sendAndPersist = async (body: string) => {
    await send(body);

    try {
      await sendChatMessage(roomId, body);
    } catch {}
  };

  const { dropRef, overed, isUploading, openPicker, onPaste } = useChatFiles({
    roomId,
    disabled: isSending,
    onSend: sendAndPersist,
  });

  const liveLines = chatMessages.map(liveMessageToChatLine);

  const liveIds = new Set(liveLines.map((line) => line.id));
  const messages = sortBy(
    [...history.filter((line) => !liveIds.has(line.id)), ...liveLines],
    (line) => line.timestamp,
  );

  return (
    <aside ref={dropRef} aria-hidden={!isOpen} className={s.root} data-open={isOpen}>
      <ChatHeader onClose={onClose} />

      {overed && (
        <div className={s.dropOverlay}>
          <Paperclip className="size-6" />
          {t('dropToSend')}
        </div>
      )}

      <div ref={listRef} className={s.scroll}>
        {isEmpty(messages) ? (
          <ChatEmpty />
        ) : (
          <div className={s.list}>
            {messages.map((message, index) => {
              const isOwn = message.from?.identity === localParticipant.identity;
              const isGrouped = messages[index - 1]?.from?.identity === message.from?.identity;

              return (
                <ChatMessageItem
                  key={`${message.timestamp}-${message.from?.identity ?? 'unknown'}`}
                  message={message}
                  isOwn={isOwn}
                  isGrouped={isGrouped}
                />
              );
            })}
          </div>
        )}
      </div>

      <ChatComposer
        isSending={isSending}
        isUploading={isUploading}
        onSend={sendAndPersist}
        onAttach={openPicker}
        onPaste={onPaste}
      />
    </aside>
  );
};
