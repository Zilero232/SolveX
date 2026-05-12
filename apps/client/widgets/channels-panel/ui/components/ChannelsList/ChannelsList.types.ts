import type { Room } from '@/shared/api';

export type ChannelsListProps = {
  activeRoom: string | null;
  rooms: Room[];
  displayName: string;
  initial: string;
  isAdmin: boolean;
  isLoading: boolean;
  onSelectLobby: () => void;
  onSelectRoom: (room: Room) => void;
  onDeleteRoom: (room: Room) => void;
};
