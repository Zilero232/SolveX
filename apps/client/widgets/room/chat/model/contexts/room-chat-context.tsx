'use client';

import { useChat } from '@livekit/components-react';
import { createContextHook } from '@siberiacancode/reactuse';
import { useChatMessageSound } from '../hooks';
import type { ReactNode } from 'react';

const { Provider, use } = createContextHook(useChat);

const ChatSoundController = () => {
  useChatMessageSound();

  return null;
};

export const RoomChatProvider = ({ children }: { children: ReactNode }) => (
  <Provider params={[]}>
    {children}

    <ChatSoundController />
  </Provider>
);

export const useRoomChat = () => {
  const value = use();

  if (!value) throw new Error('useRoomChat must be used within RoomChatProvider');

  return value;
};
