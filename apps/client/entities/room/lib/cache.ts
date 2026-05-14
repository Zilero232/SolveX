import { buildRoomStorageKey } from '@/shared/constants';

export interface RoomTokenCache {
  token: string;
  url: string;
}

export const readRoomTokenCache = (roomId: string): RoomTokenCache | null => {
  const raw = sessionStorage.getItem(buildRoomStorageKey(roomId));

  if (!raw) return null;

  try {
    return JSON.parse(raw) as RoomTokenCache;
  } catch {
    return null;
  }
};

export const writeRoomTokenCache = (roomId: string, value: RoomTokenCache) => {
  sessionStorage.setItem(buildRoomStorageKey(roomId), JSON.stringify(value));
};

export const clearRoomTokenCache = (roomId: string) => {
  sessionStorage.removeItem(buildRoomStorageKey(roomId));
};
