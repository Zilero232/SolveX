import { buildRoomStorageKey } from '@/shared/constants';

export interface RoomTokenCache {
  token: string;
  url: string;
}

export const readRoomTokenCache = (room: string): RoomTokenCache | null => {
  const raw = sessionStorage.getItem(buildRoomStorageKey(room));

  if (!raw) return null;

  try {
    return JSON.parse(raw) as RoomTokenCache;
  } catch {
    return null;
  }
};

export const writeRoomTokenCache = (room: string, value: RoomTokenCache) => {
  sessionStorage.setItem(buildRoomStorageKey(room), JSON.stringify(value));
};

export const clearRoomTokenCache = (room: string) => {
  sessionStorage.removeItem(buildRoomStorageKey(room));
};
