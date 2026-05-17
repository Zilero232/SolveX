'use client';

import { Loader2 } from 'lucide-react';

import { useRooms } from '@/entities/room';
import { ScrollArea } from '@/shared/ui';

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

export const ChannelsList = () => {
  const { rooms, isLoading, isEmpty } = useRooms();

  return (
    <ScrollArea className={s.scroll}>
      <div className={s.list}>
        <SectionLabel offset>Voice rooms</SectionLabel>

        {isLoading ? <Loader2 className={s.loaderIcon} /> : null}

        {isEmpty ? <p className={s.emptyHint}>No rooms yet</p> : null}

        {rooms.map((room) => (
          <ChannelsRoomItem key={room.id} room={room} />
        ))}
      </div>
    </ScrollArea>
  );
};
