'use client';

import { Loader2, Search } from 'lucide-react';
import { useState } from 'react';
import { isEmpty as isEmptyList, sortBy } from 'remeda';
import { match } from 'ts-pattern';
import { useRooms, useRoomsPresence } from '@/entities/room';
import { Input } from '@/shared/ui';
import { LobbyEmpty } from '../LobbyEmpty';
import { LobbyRoomCard } from '../LobbyRoomCard';
import { lobbyRoomsStyles as s } from './LobbyRooms.styles';

export const LobbyRooms = () => {
  const { rooms, isLoading, isEmpty } = useRooms();
  const presence = useRoomsPresence();

  const [query, setQuery] = useState('');

  // Busiest rooms first, then alphabetical — the lobby surfaces activity.
  const ordered = sortBy(
    rooms,
    [(room) => presence[room.id]?.length ?? 0, 'desc'],
    [(room) => room.name.toLowerCase(), 'asc'],
  );

  const normalized = query.trim().toLowerCase();
  const filtered = normalized
    ? ordered.filter((room) => room.name.toLowerCase().includes(normalized))
    : ordered;

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

      {match({ isLoading, isEmpty, nothingFound: isEmptyList(filtered) })
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
          <div className={s.grid}>
            {filtered.map((room) => (
              <LobbyRoomCard key={room.id} room={room} />
            ))}
          </div>
        ))}
    </div>
  );
};
