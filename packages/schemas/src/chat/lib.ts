import { chatAttachmentSchema } from './outputs';
import type { ChatAttachment } from './types';

export const encodeChatAttachment = (attachment: ChatAttachment): string => {
  return JSON.stringify(attachment);
};

export const decodeChatAttachment = (message: string): ChatAttachment | null => {
  try {
    const parsed = JSON.parse(message);
    const result = chatAttachmentSchema.safeParse(parsed);

    return result.success ? result.data : null;
  } catch {
    return null;
  }
};

export const isImageMime = (mime: string): boolean => {
  return mime.startsWith('image/');
};
