import type { Room } from '@/shared/api';

export interface ChannelsListProps {
  activeRoom: string | null;
  displayName: string;
  initial: string;
  isAdmin: boolean;
  isLoading: boolean;
  rooms: Room[];
  onDeleteRoom: (room: Room) => void;
  onSelectLobby: () => void;
  onSelectRoom: (room: Room) => void;
}
