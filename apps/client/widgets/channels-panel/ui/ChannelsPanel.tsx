'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import type { Room } from '@/shared/api';

import { useDeleteRoom, useRooms } from '@/entities/room';
import { useCurrentUser } from '@/entities/user';
import { buildRoomHref, ROUTES } from '@/shared/constants';

import { channelsPanelStyles as s } from './ChannelsPanel.styles';
import { ChannelsFooter } from './components/ChannelsFooter';
import { ChannelsHeader } from './components/ChannelsHeader';
import { ChannelsList } from './components/ChannelsList';

export const ChannelsPanel = () => {
  const router = useRouter();
  const params = useSearchParams();

  const { user, isAdmin } = useCurrentUser();

  const rooms = useRooms();
  const deleteMutation = useDeleteRoom();

  const activeRoomId = params.get('id');
  const displayName = user?.email?.split('@')[0] ?? 'you';
  const initial = displayName.charAt(0).toUpperCase();

  const handleSelectLobby = () => router.replace(ROUTES.lobby);
  const handleSelectRoom = ({ id }: Room) => router.push(buildRoomHref(id));

  const handleDelete = (room: Room) => {
    deleteMutation.mutate(room.id, {
      onSuccess: () => {
        toast.success('Room deleted', { description: `"${room.name}"` });

        if (activeRoomId === room.id) router.replace(ROUTES.lobby);
      },
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <div className={s.root}>
      <ChannelsHeader isAdmin={isAdmin} />

      <ChannelsList
        activeRoomId={activeRoomId}
        displayName={displayName}
        initial={initial}
        isAdmin={isAdmin}
        isLoading={rooms.isLoading}
        rooms={rooms.data ?? []}
        onDeleteRoom={handleDelete}
        onSelectLobby={handleSelectLobby}
        onSelectRoom={handleSelectRoom}
      />

      <ChannelsFooter displayName={displayName} initial={initial} />
    </div>
  );
};
