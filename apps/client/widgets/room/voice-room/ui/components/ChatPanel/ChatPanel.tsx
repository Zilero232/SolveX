'use client';

import { useLocalParticipant } from '@livekit/components-react';
import { useAutoScroll } from '@siberiacancode/reactuse';
import { isEmpty } from 'remeda';
import { useRoomChat } from '../../../model';
import { chatPanelStyles as s } from './ChatPanel.styles';
import { ChatComposer, ChatEmpty, ChatHeader, ChatMessageItem } from './components';
import type { ChatPanelProps } from './ChatPanel.types';

export const ChatPanel = ({ isOpen, onClose }: ChatPanelProps) => {
  const { isSending, chatMessages, send } = useRoomChat();
  const { localParticipant } = useLocalParticipant();
  const listRef = useAutoScroll<HTMLDivElement>();

  const handleSend = async (value: string) => {
    await send(value);
  };

  return (
    <aside aria-hidden={!isOpen} className={s.root} data-open={isOpen}>
      <ChatHeader onClose={onClose} />

      <div ref={listRef} className={s.scroll}>
        {isEmpty(chatMessages) ? (
          <ChatEmpty />
        ) : (
          <div className={s.list}>
            {chatMessages.map((message, index) => {
              const isOwn = message.from?.identity === localParticipant.identity;
              const isGrouped = chatMessages[index - 1]?.from?.identity === message.from?.identity;

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

      <ChatComposer isSending={isSending} onSend={handleSend} />
    </aside>
  );
};
