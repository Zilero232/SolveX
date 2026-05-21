import { env } from '@/shared/config';
import { getFreshAccessToken } from '../auth';

/**
 * Builds the SSE endpoint URL for the rooms-presence stream.
 *
 * EventSource cannot send an Authorization header, so the access token is
 * passed as a query param — the server validates it the same way.
 */
export const buildPresenceStreamUrl = async (): Promise<string> => {
  const token = await getFreshAccessToken();
  const base = env.NEXT_PUBLIC_API_URL.replace(/\/$/, '');

  return `${base}/livekit/presence?token=${encodeURIComponent(token)}`;
};
