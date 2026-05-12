export const QUERY_KEYS = {
  livekitToken: (roomName: string | null) => ['livekit-token', roomName] as const,
  rooms: () => ['rooms'] as const,
};
