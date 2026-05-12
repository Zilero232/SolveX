import type { Room } from '@/shared/api';

export type ChannelsRoomItemProps = {
  room: Room;
  isActive: boolean;
  displayName: string;
  initial: string;
  isAdmin: boolean;
  onClick: () => void;
  onDelete: (room: Room) => void;
};
