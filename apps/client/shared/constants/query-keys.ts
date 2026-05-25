export const QUERY_KEYS = {
  release: () => ['release'] as const,
  livekitToken: (roomName: string | null) => ['livekit-token', roomName] as const,
  roomParticipants: (roomId: string) => ['room-participants', roomId] as const,
  room: (id: string | null) => ['room', id] as const,
  rooms: () => ['rooms'] as const,
  session: () => ['session'] as const,
};
