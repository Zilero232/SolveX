export const ROUTES = {
  lobby: '/',
  auth: '/auth',
  room: '/room',
} as const;

export const buildRoomHref = (roomId: string) => {
  return `${ROUTES.room}?id=${encodeURIComponent(roomId)}`;
};
