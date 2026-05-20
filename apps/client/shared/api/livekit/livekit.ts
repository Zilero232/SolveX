import type {
  RoomParticipantsResponse,
  TokenRequest,
  TokenResponse,
} from '@chatovo/schemas/livekit';

import { api } from '../http';

export const fetchLiveKitToken = async (body: TokenRequest): Promise<TokenResponse> => {
  const res = await api.livekit.token.$post({ json: body });

  if (!res.ok) {
    const err = (await res.json().catch(() => null)) as { error?: string } | null;

    throw new Error(err?.error ?? `LiveKit token failed: ${res.status}`);
  }

  return res.json();
};

export const fetchRoomParticipants = async (roomId: string): Promise<RoomParticipantsResponse> => {
  const res = await api.livekit.rooms[':roomId'].participants.$get({ param: { roomId } });

  if (!res.ok) {
    throw new Error(`Failed to load participants: ${res.status}`);
  }

  return res.json();
};
