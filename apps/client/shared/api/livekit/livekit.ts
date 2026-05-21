import { api } from '../http';
import type { TokenRequest, TokenResponse } from '@chatovo/schemas/livekit';

export const fetchLiveKitToken = async (body: TokenRequest): Promise<TokenResponse> => {
  const res = await api.livekit.token.$post({ json: body });

  if (!res.ok) {
    const err = (await res.json().catch(() => null)) as { error?: string } | null;

    throw new Error(err?.error ?? `LiveKit token failed: ${res.status}`);
  }

  return res.json();
};
