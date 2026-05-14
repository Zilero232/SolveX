import type { LocalUserChoices } from '@livekit/components-core';
import type { DisconnectReason } from 'livekit-client';

export interface VoiceRoomProps {
  roomName: string;
  serverUrl: string;
  token: string;
  userChoices: LocalUserChoices;
  onConnectFailure: (reason: DisconnectReason) => void;
  onLeave: () => void;
}
