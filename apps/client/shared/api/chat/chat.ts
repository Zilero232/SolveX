import { api, readErrorMessage } from '../http';
import type { ChatAttachment, ChatMessage, ChatMessagesPage } from '@chatovo/schemas';

export const uploadChatAttachment = async (roomId: string, file: File): Promise<ChatAttachment> => {
  const res = await api.chat.attachments.$post({ form: { roomId, file } });

  if (!res.ok) {
    const message = await readErrorMessage(res);

    throw new Error(message ?? `Failed to upload attachment: ${res.status}`);
  }

  return await res.json();
};

export const sendChatMessage = async (roomId: string, body: string): Promise<ChatMessage> => {
  const res = await api.chat.messages.$post({ json: { roomId, body } });

  if (!res.ok) {
    const message = await readErrorMessage(res);

    throw new Error(message ?? `Failed to send message: ${res.status}`);
  }

  return await res.json();
};

export const fetchChatMessages = async (
  roomId: string,
  cursor?: string,
  limit = 50,
): Promise<ChatMessagesPage> => {
  const res = await api.chat.messages.$get({
    query: { roomId, limit: String(limit), ...(cursor ? { cursor } : {}) },
  });

  if (!res.ok) {
    const message = await readErrorMessage(res);

    throw new Error(message ?? `Failed to load messages: ${res.status}`);
  }

  return await res.json();
};
