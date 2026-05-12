import type { LocalUserChoices } from '@livekit/components-core';
import type { DisconnectReason } from 'livekit-client';

export type VoiceRoomProps = {
  token: string;
  serverUrl: string;
  roomName: string;
  userChoices: LocalUserChoices;
  onLeave: () => void;
  onConnectFailure: (reason: DisconnectReason) => void;
};
