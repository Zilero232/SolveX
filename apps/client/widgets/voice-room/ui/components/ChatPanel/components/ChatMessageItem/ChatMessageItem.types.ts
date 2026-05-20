import type { ReceivedChatMessage } from '@livekit/components-core';

export type ChatMessageItemProps = {
  isGrouped: boolean;
  isOwn: boolean;
  message: ReceivedChatMessage;
};
