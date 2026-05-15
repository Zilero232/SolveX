import type { Room } from '@solvex/schemas/rooms';

export interface ChannelsRoomItemProps {
  displayName: string;
  initial: string;
  isActive: boolean;
  isAdmin: boolean;
  room: Room;
  onClick: () => void;
  onDelete: (room: Room) => void;
}
