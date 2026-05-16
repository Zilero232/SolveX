export const QUERY_KEYS = {
  livekitToken: (roomName: string | null) => ['livekit-token', roomName] as const,
  room: (id: string | null) => ['room', id] as const,
  rooms: () => ['rooms'] as const,
};
