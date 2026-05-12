import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { type Room, supabase } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const useRoomsRealtime = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('public:rooms')
      .on<Room>(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'rooms' },
        ({ new: room }) => {
          queryClient.setQueryData<Room[]>(QUERY_KEYS.rooms(), (prev) => {
            if (!prev) return [room];

            if (prev.some((r) => r.id === room.id)) return prev;

            return [room, ...prev];
          });
        },
      )
      .on<Room>(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'rooms' },
        ({ old }) => {
          queryClient.setQueryData<Room[]>(QUERY_KEYS.rooms(), (prev) =>
            prev ? prev.filter((r) => r.id !== old.id) : prev,
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
};
