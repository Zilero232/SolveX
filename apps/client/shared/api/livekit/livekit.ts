import { AxiosError } from 'axios';

import { apiClient } from '../client';
import type { TokenRequest, TokenResponse } from './livekit.schema';

export const fetchLiveKitToken = async (
  body: TokenRequest,
  supabaseAccessToken: string,
): Promise<TokenResponse> => {
  try {
    const { data } = await apiClient.post<TokenResponse>('/api/livekit-token', body, {
      headers: { Authorization: `Bearer ${supabaseAccessToken}` },
    });

    return data;
  } catch (e) {
    if (e instanceof AxiosError) {
      const message = e.response?.data?.error ?? e.message;

      throw new Error(message);
    }

    throw e;
  }
};
