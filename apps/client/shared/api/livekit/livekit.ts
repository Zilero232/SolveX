import { api, readErrorMessage } from '../http';
import type { PresenceStateRequest, TokenRequest, TokenResponse } from '@chatovo/schemas';

export const fetchLiveKitToken = async (body: TokenRequest): Promise<TokenResponse> => {
  try {
    const res = await api.livekit.token.$post({ json: body });

    if (!res.ok) {
      const message = await readErrorMessage(res);

      throw new Error(message ?? `LiveKit token failed: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    if (error instanceof Error) throw error;

    throw new Error('LiveKit token failed');
  }
};

export const reportPresenceState = async (body: PresenceStateRequest): Promise<void> => {
  try {
    const res = await api.livekit['presence-state'].$post({ json: body });

    if (!res.ok) {
      const message = await readErrorMessage(res);

      throw new Error(message ?? `presence-state failed: ${res.status}`);
    }
  } catch (error) {
    if (error instanceof Error) throw error;

    throw new Error('presence-state failed');
  }
};
