export const ROUTES = {
  root: '/',
  auth: '/auth',
  lobby: '/lobby',
  room: '/room',
} as const;

export const buildRoomHref = (roomName: string) =>
  `${ROUTES.room}?name=${encodeURIComponent(roomName)}`;
