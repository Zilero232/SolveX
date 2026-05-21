import { streamSSE } from 'hono/streaming';
import { verifyAccessToken } from '../../../lib/auth';
import { getSnapshot, subscribe } from '../presence';
import type { Handler } from 'hono';
import type { Env } from '../../shared/types';

/**
 * Streams live room presence to the client over Server-Sent Events.
 *
 * EventSource cannot send custom headers, so this route authorizes via a
 * `token` query param instead of the shared bearer-header middleware.
 */
export const presenceHandler: Handler<Env> = async (c) => {
  const user = await verifyAccessToken(c.req.query('token'));

  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  return streamSSE(c, async (stream) => {
    // Push the current state immediately so the client renders without waiting.
    await stream.writeSSE({ event: 'snapshot', data: JSON.stringify(getSnapshot()) });

    const unsubscribe = subscribe((snapshot) => {
      stream.writeSSE({ event: 'snapshot', data: JSON.stringify(snapshot) });
    });

    // Keep the connection alive through proxies that drop idle streams.
    const ping = setInterval(() => {
      stream.writeSSE({ event: 'ping', data: '' });
    }, 25_000);

    // streamSSE resolves the callback = closes the stream; block until the
    // client disconnects, then release the subscription and keepalive timer.
    await new Promise<void>((resolve) => {
      stream.onAbort(() => {
        clearInterval(ping);
        unsubscribe();
        resolve();
      });
    });
  });
};
