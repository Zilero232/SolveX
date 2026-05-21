import { isEmpty, sortBy } from 'remeda';
import type { RoomsParticipantsSnapshot } from '@chatovo/schemas/livekit';
import type { Room } from '@chatovo/schemas/rooms';

type RoomsPresenceMap = RoomsParticipantsSnapshot['rooms'];

export type RoomSection = {
  key: 'private' | 'public';
  label: string;
  rooms: Room[];
};

const participantCount = (presence: RoomsPresenceMap, roomId: string) =>
  presence[roomId]?.length ?? 0;

// Empty sections are dropped so a search result never leaves dangling headers.
export const groupRooms = (
  rooms: Room[],
  presence: RoomsPresenceMap,
  query: string,
): RoomSection[] => {
  const normalized = query.trim().toLowerCase();

  const matched = normalized
    ? rooms.filter((room) => room.name.toLowerCase().includes(normalized))
    : rooms;

  const order = (list: Room[]) =>
    sortBy(
      list,
      [(room) => participantCount(presence, room.id), 'desc'],
      [(room) => room.name.toLowerCase(), 'asc'],
    );

  return (
    [
      {
        key: 'private',
        label: 'Private',
        rooms: order(matched.filter((room) => room.isPrivate)),
      },
      {
        key: 'public',
        label: 'Voice rooms',
        rooms: order(matched.filter((room) => !room.isPrivate)),
      },
    ] satisfies RoomSection[]
  ).filter((section) => !isEmpty(section.rooms));
};
