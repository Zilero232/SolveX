import { auth } from '../../lib/auth';
import type { Handler } from 'hono';

export const socialDoneHandler: Handler = async (c) => {
  const redirectTo = c.req.query('redirect');

  if (!redirectTo) return c.json({ error: 'Missing redirect' }, 400);

  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) return c.redirect(appendParam(redirectTo, 'error', 'session_missing'));

  const { token } = await auth.api.generateOneTimeToken({ headers: c.req.raw.headers });

  return c.redirect(appendParam(redirectTo, 'ott', token));
};

const appendParam = (url: string, key: string, value: string): string => {
  const separator = url.includes('?') ? '&' : '?';

  return `${url}${separator}${key}=${encodeURIComponent(value)}`;
};
