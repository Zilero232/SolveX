import type { Room } from '@/shared/api';

export interface ChannelsRoomItemProps {
  displayName: string;
  initial: string;
  isActive: boolean;
  isAdmin: boolean;
  room: Room;
  onClick: () => void;
  onDelete: (room: Room) => void;
}
