export const QUERY_KEYS = {
  chatMessages: (roomId: string) => ['chat-messages', roomId] as const,
  release: () => ['release'] as const,
  livekitToken: (roomName: string | null) => ['livekit-token', roomName] as const,
  roomParticipants: (roomId: string) => ['room-participants', roomId] as const,
  room: (id: string | null) => ['room', id] as const,
  rooms: () => ['rooms'] as const,
  session: () => ['session'] as const,
  userProfile: (id: string) => ['user-profile', id] as const,
};
