import type { ChatAttachment } from '@chatovo/schemas';

export type MessageAttachmentProps = {
  attachment: ChatAttachment;
  isOwn: boolean;
};
