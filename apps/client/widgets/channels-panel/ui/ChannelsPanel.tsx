'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import { useDeleteRoom, useRooms, useRoomsRealtime } from '@/entities/room';
import { useCurrentUser } from '@/entities/user';
import type { Room } from '@/shared/api';
import { buildRoomHref, ROUTES } from '@/shared/constants';

import { channelsPanelStyles as s } from './ChannelsPanel.styles';
import { ChannelsFooter } from './components/ChannelsFooter';
import { ChannelsHeader } from './components/ChannelsHeader';
import { ChannelsList } from './components/ChannelsList';

export const ChannelsPanel = () => {
  const router = useRouter();
  const params = useSearchParams();
  const activeRoom = params.get('name');
  const { user, isAdmin } = useCurrentUser();
  const rooms = useRooms();
  const deleteMutation = useDeleteRoom();
  const displayName = user?.email?.split('@')[0] ?? 'you';
  const initial = displayName.charAt(0).toUpperCase();

  useRoomsRealtime();

  const handleDelete = (room: Room) => {
    deleteMutation.mutate(room.id, {
      onSuccess: () => {
        toast.success('Room deleted', { description: `"${room.name}"` });

        if (activeRoom === room.name) router.replace(ROUTES.lobby);
      },
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <div className={s.root}>
      <ChannelsHeader isAdmin={isAdmin} />
      <ChannelsList
        activeRoom={activeRoom}
        rooms={rooms.data ?? []}
        displayName={displayName}
        initial={initial}
        isAdmin={isAdmin}
        isLoading={rooms.isLoading}
        onSelectLobby={() => router.replace(ROUTES.lobby)}
        onSelectRoom={(room) => router.push(buildRoomHref(room.name))}
        onDeleteRoom={handleDelete}
      />
      <ChannelsFooter displayName={displayName} initial={initial} />
    </div>
  );
};
