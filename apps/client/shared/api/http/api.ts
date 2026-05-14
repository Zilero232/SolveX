import type { App } from '@solvex/server';

import { hc } from 'hono/client';

import { env } from '@/shared/config';

import { getFreshAccessToken } from '../auth';

export const api = hc<App>(env.NEXT_PUBLIC_API_URL, {
  async headers() {
    const token = await getFreshAccessToken();

    return { Authorization: `Bearer ${token}` };
  },
});
