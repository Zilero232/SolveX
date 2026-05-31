import type { ChatLine } from '../../../model/types';

export type ChatMessageItemProps = {
  message: ChatLine;
  isOwn: boolean;
  isGrouped: boolean;
};
