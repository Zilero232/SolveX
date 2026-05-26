import type { ReceivedChatMessage } from '@livekit/components-core';

export type ChatMessageItemProps = {
  message: ReceivedChatMessage;
  isOwn: boolean;
  isGrouped: boolean;
};
