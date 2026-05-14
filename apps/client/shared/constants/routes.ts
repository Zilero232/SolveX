export const ROUTES = {
  root: '/',
  auth: '/auth',
  lobby: '/lobby',
  room: '/room',
} as const;

export const buildRoomHref = (roomId: string) =>
  `${ROUTES.room}?id=${encodeURIComponent(roomId)}`;
