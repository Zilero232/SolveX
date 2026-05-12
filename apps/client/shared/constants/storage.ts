export const STORAGE_KEYS = {
  authSession: 'solvex.auth',
  roomPrefix: 'solvex.room.',
} as const;

export const buildRoomStorageKey = (roomName: string) => `${STORAGE_KEYS.roomPrefix}${roomName}`;
