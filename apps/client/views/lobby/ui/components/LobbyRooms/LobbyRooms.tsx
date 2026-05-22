'use client';

import { Loader2, Search } from 'lucide-react';
import { useState } from 'react';
import { isEmpty as isEmptyList } from 'remeda';
import { match } from 'ts-pattern';
import { groupRooms, useRooms, useRoomsPresence } from '@/entities/room';
import { Input } from '@/shared/ui';
import { LobbyEmpty } from '../LobbyEmpty';
import { LobbyRoomCard } from '../LobbyRoomCard';
import { lobbyRoomsStyles as s } from './LobbyRooms.styles';

export const LobbyRooms = () => {
  const { rooms, isLoading, isEmpty } = useRooms();
  const presence = useRoomsPresence();

  const [query, setQuery] = useState('');

  // Public / Private sections, each ordered busiest-first then alphabetical —
  // the same grouping the channels sidebar uses.
  const sections = groupRooms(rooms, presence, query);

  return (
    <div className={s.root}>
      <div className={s.bar}>
        <h3 className={s.heading}>Rooms</h3>

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

      {match({ isLoading, isEmpty, nothingFound: isEmptyList(sections) })
        .with({ isLoading: true }, () => (
          <div className={s.loader}>
            <Loader2 className={s.loaderIcon} />
          </div>
        ))
        .with({ isEmpty: true }, () => <LobbyEmpty />)
        .with({ nothingFound: true }, () => (
          <p className={s.nothingFound}>No rooms match "{query}"</p>
        ))
        .otherwise(() => (
          <div className={s.sections}>
            {sections.map((section) => (
              <section key={section.key} className={s.section}>
                <h4 className={s.sectionLabel}>{section.label}</h4>

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
