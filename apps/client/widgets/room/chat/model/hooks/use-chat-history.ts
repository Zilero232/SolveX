'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchChatMessages } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';
import { chatMessageToChatLine } from '../lib';
import type { ChatLine } from '../types';

export const useChatHistory = (roomId: string, enabled = true) => {
  const { data } = useQuery({
    queryKey: QUERY_KEYS.chatMessages(roomId),
    enabled: enabled && roomId.length > 0,
    staleTime: Number.POSITIVE_INFINITY,
    queryFn: async (): Promise<ChatLine[]> => {
      const page = await fetchChatMessages(roomId);

      return page.items.map(chatMessageToChatLine);
    },
  });

  return data ?? [];
};
