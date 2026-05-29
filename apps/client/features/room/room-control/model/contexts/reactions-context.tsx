'use client';

import { useDataChannel } from '@livekit/components-react';
import { createContextHook } from '@siberiacancode/reactuse';
import { useRef, useState } from 'react';
import { REACTIONS_TOPIC } from '../../config/keys';
import type { ReactNode } from 'react';

export type FloatingReaction = {
  id: number;
  emoji: string;
  offset: number;
};

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const REACTION_LIFETIME = 6000;

const useReactionsState = () => {
  const [reactions, setReactions] = useState<FloatingReaction[]>([]);

  const nextId = useRef(0);

  const spawn = (emoji: string) => {
    const id = nextId.current++;

    setReactions((prev) => [...prev, { id, emoji, offset: (id % 4) * 6 }]);

    setTimeout(() => {
      setReactions((prev) => prev.filter((reaction) => reaction.id !== id));
    }, REACTION_LIFETIME);
  };

  const { send: sendData } = useDataChannel(REACTIONS_TOPIC, (msg) => {
    spawn(decoder.decode(msg.payload));
  });

  const send = (emoji: string) => {
    spawn(emoji);

    void sendData(encoder.encode(emoji), { reliable: true });
  };

  return { reactions, send };
};

const { Provider, use } = createContextHook(useReactionsState);

export const ReactionsProvider = ({ children }: { children: ReactNode }) => (
  <Provider params={[]}>{children}</Provider>
);

export const useReactions = () => {
  const value = use();

  if (!value) throw new Error('useReactions must be used within ReactionsProvider');

  return value;
};
