import { env } from '@/shared/config';
import { getFreshAccessToken } from '../auth';

export const buildPresenceStreamUrl = async (): Promise<string> => {
  const token = await getFreshAccessToken();
  const base = env.NEXT_PUBLIC_API_URL.replace(/\/$/, '');

  return `${base}/livekit/presence?token=${encodeURIComponent(token)}`;
};
