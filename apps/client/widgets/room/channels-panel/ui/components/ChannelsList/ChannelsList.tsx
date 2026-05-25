'use client';

import { Loader2, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { isEmpty as isEmptyList } from 'remeda';
import { match } from 'ts-pattern';
import { groupRooms, useRooms, useRoomsPresence } from '@/entities/room/room';
import { Input, ScrollArea } from '@/shared/ui';
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
  const t = useTranslations('channels');
  const tSections = useTranslations('room.sections');

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
            placeholder={t('searchPlaceholder')}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>

      <ScrollArea className={s.scroll}>
        <div className={s.list}>
          {match({ isLoading, isEmpty, nothingFound: isEmptyList(sections) })
            .with({ isLoading: true }, () => <Loader2 className={s.loaderIcon} />)
            .with({ isEmpty: true }, () => <p className={s.emptyHint}>{t('noRoomsYet')}</p>)
            .with({ nothingFound: true }, () => <p className={s.emptyHint}>{t('nothingFound')}</p>)
            .otherwise(() =>
              sections.map((section, index) => (
                <div key={section.key}>
                  <SectionLabel offset={index > 0}>{tSections(section.key)}</SectionLabel>

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
