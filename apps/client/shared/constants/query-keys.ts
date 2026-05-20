export const QUERY_KEYS = {
  desktopRelease: () => ['desktop-release'] as const,
  livekitToken: (roomName: string | null) => ['livekit-token', roomName] as const,
  room: (id: string | null) => ['room', id] as const,
  rooms: () => ['rooms'] as const,
  session: () => ['session'] as const,
};
