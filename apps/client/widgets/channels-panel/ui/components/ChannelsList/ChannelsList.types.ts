import type { Room } from '@solvex/schemas/rooms';

export interface ChannelsListProps {
  activeRoomId: string | null;
  displayName: string;
  initial: string;
  isAdmin: boolean;
  isLoading: boolean;
  rooms: Room[];
  onDeleteRoom: (room: Room) => void;
  onSelectRoom: (room: Room) => void;
}
