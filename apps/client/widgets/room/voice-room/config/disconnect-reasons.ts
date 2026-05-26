import { DisconnectReason } from 'livekit-client';

// LiveKit disconnect reasons that indicate the room couldn't be entered (vs.
// an explicit leave). Used to differentiate connect-failure → onConnectFailure
// from a normal session end → onLeave.
export const FAILURE_REASONS = new Set<DisconnectReason>([
  DisconnectReason.JOIN_FAILURE,
  DisconnectReason.SIGNAL_CLOSE,
  DisconnectReason.SERVER_SHUTDOWN,
  DisconnectReason.STATE_MISMATCH,
]);
