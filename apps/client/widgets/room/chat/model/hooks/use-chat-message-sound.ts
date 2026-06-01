'use client';

import { useLocalParticipant } from '@livekit/components-react';
import { useEffect, useRef } from 'react';
import { isNullish, last } from 'remeda';
import { appBus } from '@/shared/lib';
import { useRoomChat } from '../contexts';

export const useChatMessageSound = () => {
  const { chatMessages } = useRoomChat();
  const { localParticipant } = useLocalParticipant();

  const lastSeenRef = useRef<string | null>(null);

  useEffect(() => {
    const latest = last(chatMessages);
    if (isNullish(latest)) return;

    const key = latest.id ?? `${latest.timestamp}-${latest.from?.identity ?? 'unknown'}`;

    if (isNullish(lastSeenRef.current)) {
      lastSeenRef.current = key;
      return;
    }

    if (lastSeenRef.current === key) return;
    lastSeenRef.current = key;

    if (latest.from?.identity === localParticipant.identity) return;

    appBus.push('chatMessage', undefined);
  }, [chatMessages, localParticipant.identity]);
};
