import { isEmpty, sortBy } from 'remeda';
import type { RoomsParticipantsSnapshot } from '@chatovo/schemas/livekit';
import type { Room } from '@chatovo/schemas/rooms';

type RoomsPresenceMap = RoomsParticipantsSnapshot['rooms'];

// `key` doubles as the i18n key for the section heading (room.sections.*) —
// the heading text is resolved by the consuming component, not stored here.
export type RoomSection = {
  key: 'private' | 'public';
  rooms: Room[];
};

const participantCount = (presence: RoomsPresenceMap, roomId: string) =>
  presence[roomId]?.length ?? 0;

// Filters rooms by a search query and orders them: busiest first (by live
// participant count), then alphabetical. The shared room ordering used wherever
// rooms are listed — the lobby grid and the channels sidebar.
export const filterAndOrderRooms = (
  rooms: Room[],
  presence: RoomsPresenceMap,
  query: string,
): Room[] => {
  const normalized = query.trim().toLowerCase();

  const matched = normalized
    ? rooms.filter((room) => room.name.toLowerCase().includes(normalized))
    : rooms;

  return sortBy(
    matched,
    [(room) => participantCount(presence, room.id), 'desc'],
    [(room) => room.name.toLowerCase(), 'asc'],
  );
};

// Splits the filtered, ordered rooms into Public and Private sections. Empty
// sections are dropped so a search result never leaves a dangling header.
export const groupRooms = (
  rooms: Room[],
  presence: RoomsPresenceMap,
  query: string,
): RoomSection[] => {
  const ordered = filterAndOrderRooms(rooms, presence, query);

  return (
    [
      { key: 'private', rooms: ordered.filter((room) => room.isPrivate) },
      { key: 'public', rooms: ordered.filter((room) => !room.isPrivate) },
    ] satisfies RoomSection[]
  ).filter((section) => !isEmpty(section.rooms));
};
