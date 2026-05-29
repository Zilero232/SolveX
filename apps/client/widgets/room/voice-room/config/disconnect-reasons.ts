import { DisconnectReason } from 'livekit-client';

export const FAILURE_REASONS = new Set<DisconnectReason>([
  DisconnectReason.JOIN_FAILURE,
  DisconnectReason.SIGNAL_CLOSE,
  DisconnectReason.SERVER_SHUTDOWN,
  DisconnectReason.STATE_MISMATCH,
]);
