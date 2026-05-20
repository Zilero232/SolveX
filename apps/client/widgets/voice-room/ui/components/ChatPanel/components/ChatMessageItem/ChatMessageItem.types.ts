import type { ReceivedChatMessage } from '@livekit/components-core';

export interface ChatMessageItemProps {
  isGrouped: boolean;
  isOwn: boolean;
  message: ReceivedChatMessage;
}
