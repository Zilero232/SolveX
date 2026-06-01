import { env } from '@/shared/config';
import { getAuthToken } from '../auth';

export const buildPresenceStreamUrl = (): string => {
  const token = getAuthToken();

  if (!token) throw new Error('Not authenticated');

  const base = env.NEXT_PUBLIC_API_URL.replace(/\/$/, '');

  return `${base}/livekit/presence?token=${encodeURIComponent(token)}`;
};
