'use client';

import { Hash, Loader2 } from 'lucide-react';

import { ScrollArea } from '@/shared/ui/scroll-area';

import type { ChannelsListProps } from './ChannelsList.types';

import { ChannelsRoomItem } from '../ChannelsRoomItem';
import { channelsListStyles as s } from './ChannelsList.styles';

const SectionLabel = ({
  children,
  offset = false,
}: {
  children: React.ReactNode;
  offset?: boolean;
}) => (
  <p className={offset ? `${s.sectionLabel} ${s.sectionLabelOffset}` : s.sectionLabel}>
    {children}
  </p>
);

export const ChannelsList = ({
  activeRoom,
  rooms,
  displayName,
  initial,
  isAdmin,
  isLoading,
  onSelectLobby,
  onSelectRoom,
  onDeleteRoom,
}: ChannelsListProps) => (
  <ScrollArea className={s.scroll}>
    <div className={s.list}>
      <SectionLabel>Channels</SectionLabel>
      <button
        className={s.lobbyTrigger({ active: !activeRoom })}
        type="button"
        onClick={onSelectLobby}
      >
        <Hash className={s.lobbyIcon} />
        Lobby
      </button>

      <SectionLabel offset>Voice rooms</SectionLabel>

      {isLoading ? <Loader2 className={s.loaderIcon} /> : null}

      {!isLoading && rooms.length === 0 ? <p className={s.emptyHint}>No rooms yet</p> : null}

      {rooms.map((room) => (
        <ChannelsRoomItem
          key={room.id}
          displayName={displayName}
          initial={initial}
          isActive={activeRoom === room.name}
          isAdmin={isAdmin}
          room={room}
          onClick={() => onSelectRoom(room)}
          onDelete={onDeleteRoom}
        />
      ))}
    </div>
  </ScrollArea>
);
