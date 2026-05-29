'use client';

import { Loader2, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { isEmpty as isEmptyList } from 'remeda';
import { match } from 'ts-pattern';
import { groupRooms, useRooms, useRoomsPresence } from '@/entities/room/room';
import { LobbyEmpty } from '../LobbyEmpty';
import { LobbyRoomCard } from '../LobbyRoomCard';
import { lobbyRoomsStyles as s } from './LobbyRooms.styles';

export const LobbyRooms = () => {
  const t = useTranslations('lobby');
  const tSections = useTranslations('room.sections');

  const { rooms, isLoading, isEmpty } = useRooms();
  const presence = useRoomsPresence();

  const [query, setQuery] = useState('');

  const sections = groupRooms(rooms, presence, query);

  return (
    <div className={s.root}>
      <div className={s.bar}>
        <h3 className={s.heading}>{t('roomsHeading')}</h3>

        <label className={s.searchField}>
          <Search className={s.searchIcon} />
          <input
            className={s.searchInput}
            placeholder={t('searchPlaceholder')}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <kbd className={s.searchShortcut}>⌘K</kbd>
        </label>
      </div>

      {match({ isLoading, isEmpty, nothingFound: isEmptyList(sections) })
        .with({ isLoading: true }, () => (
          <div className={s.loader}>
            <Loader2 className={s.loaderIcon} />
          </div>
        ))
        .with({ isEmpty: true }, () => <LobbyEmpty />)
        .with({ nothingFound: true }, () => (
          <p className={s.nothingFound}>{t('nothingFound', { query })}</p>
        ))
        .otherwise(() => (
          <div className={s.sections}>
            {sections.map((section) => (
              <section key={section.key} className={s.section}>
                <h4 className={s.sectionLabel}>{tSections(section.key)}</h4>

                <div className={s.grid}>
                  {section.rooms.map((room) => (
                    <LobbyRoomCard key={room.id} room={room} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ))}
    </div>
  );
};
