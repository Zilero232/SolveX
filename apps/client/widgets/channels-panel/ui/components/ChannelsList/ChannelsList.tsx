'use client';

import { Loader2 } from 'lucide-react';

import { ScrollArea } from '@/shared/ui';

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
  activeRoomId,
  rooms,
  displayName,
  initial,
  isAdmin,
  isLoading,
  onSelectRoom,
  onDeleteRoom,
}: ChannelsListProps) => (
  <ScrollArea className={s.scroll}>
    <div className={s.list}>
      <SectionLabel offset>Voice rooms</SectionLabel>

      {isLoading ? <Loader2 className={s.loaderIcon} /> : null}

      {!isLoading && rooms.length === 0 ? <p className={s.emptyHint}>No rooms yet</p> : null}

      {rooms.map((room) => (
        <ChannelsRoomItem
          key={room.id}
          displayName={displayName}
          initial={initial}
          isActive={activeRoomId === room.id}
          isAdmin={isAdmin}
          room={room}
          onClick={() => onSelectRoom(room)}
          onDelete={onDeleteRoom}
        />
      ))}
    </div>
  </ScrollArea>
);
