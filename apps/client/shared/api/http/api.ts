import { hc } from 'hono/client';
import { env } from '@/shared/config';
import { getFreshAccessToken } from '../auth';
import type { App } from '@chatovo/server';

export const api = hc<App>(env.NEXT_PUBLIC_API_URL, {
  async headers() {
    const token = await getFreshAccessToken();

    return { Authorization: `Bearer ${token}` };
  },
});
