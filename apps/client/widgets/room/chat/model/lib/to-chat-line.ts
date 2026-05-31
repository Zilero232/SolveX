import type { ChatMessage } from '@chatovo/schemas';
import type { ReceivedChatMessage } from '@livekit/components-core';
import type { ChatLine } from '../types';

export const liveMessageToChatLine = ({
  id,
  timestamp,
  message,
  from,
}: ReceivedChatMessage): ChatLine => {
  return {
    id: id ?? `${timestamp}-${from?.identity ?? 'unknown'}`,
    timestamp,
    message,
    from: from ? { identity: from.identity, name: from.name, metadata: from.metadata } : undefined,
  };
};

export const chatMessageToChatLine = ({
  id,
  createdAt,
  body,
  senderId,
  senderName,
}: ChatMessage): ChatLine => {
  return {
    id,
    timestamp: new Date(createdAt).getTime(),
    message: body,
    from: {
      identity: senderId ?? 'deleted',
      name: senderName,
    },
  };
};
