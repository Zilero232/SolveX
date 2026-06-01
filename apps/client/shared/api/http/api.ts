import { hc } from 'hono/client';
import { env } from '@/shared/config';
import { getAuthToken } from '../auth';
import type { App } from '@chatovo/server';

export const api = hc<App>(env.NEXT_PUBLIC_API_URL, {
  headers(): Record<string, string> {
    const token = getAuthToken();

    return token ? { Authorization: `Bearer ${token}` } : {};
  },
});
