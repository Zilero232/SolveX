'use client';

import { Loader2, Search } from 'lucide-react';
import { useState } from 'react';
import { isEmpty as isEmptyList } from 'remeda';
import { match } from 'ts-pattern';
import { useRooms, useRoomsPresence } from '@/entities/room';
import { Input, ScrollArea } from '@/shared/ui';
import { groupRooms } from '../../../model';
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
  const presence = useRoomsPresence();

  const [query, setQuery] = useState('');

  const sections = groupRooms(rooms, presence, query);

  return (
    <>
      <div className={s.search}>
        <div className={s.searchField}>
          <Search className={s.searchIcon} />
          <Input
            className={s.searchInput}
            placeholder="Search rooms..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>

      <ScrollArea className={s.scroll}>
        <div className={s.list}>
          {match({ isLoading, isEmpty, nothingFound: isEmptyList(sections) })
            .with({ isLoading: true }, () => <Loader2 className={s.loaderIcon} />)
            .with({ isEmpty: true }, () => <p className={s.emptyHint}>No rooms yet</p>)
            .with({ nothingFound: true }, () => <p className={s.emptyHint}>Nothing found</p>)
            .otherwise(() =>
              sections.map((section, index) => (
                <div key={section.key}>
                  <SectionLabel offset={index > 0}>{section.label}</SectionLabel>

                  {section.rooms.map((room) => (
                    <ChannelsRoomItem key={room.id} room={room} />
                  ))}
                </div>
              )),
            )}
        </div>
      </ScrollArea>
    </>
  );
};
