import { streamSSE } from 'hono/streaming';
import { PRESENCE_PING_INTERVAL_MS } from '../../../config/livekit';
import { auth } from '../../../lib/auth';
import { addLobbyConnection, getSnapshot, removeLobbyConnection, subscribe } from '../presence';
import type { Handler } from 'hono';
import type { Env } from '../../shared/types';

// EventSource cannot send custom headers, so auth is via `token` query param.
export const presenceHandler: Handler<Env> = async (c) => {
  const token = c.req.query('token');

  if (!token) return c.json({ error: 'Unauthorized' }, 401);

  const session = await auth.api.getSession({
    headers: new Headers({ Authorization: `Bearer ${token}` }),
  });

  if (!session) return c.json({ error: 'Unauthorized' }, 401);

  const userId = session.user.id;

  addLobbyConnection(userId);

  return streamSSE(c, async (stream) => {
    let closed = false;
    let unsubscribe = () => {};
    let ping: ReturnType<typeof setInterval> | undefined;

    // Tear down once: drop the subscription, stop the keepalive.
    const teardown = () => {
      if (closed) return;

      closed = true;
      clearInterval(ping);
      unsubscribe();
      removeLobbyConnection(userId);
    };

    // Hono's SSE stream wraps a single locked WritableStream writer. Two
    // overlapping writes corrupt the chunked encoding (the browser then
    // reports ERR_INCOMPLETE_CHUNKED_ENCODING / ERR_HTTP2_PROTOCOL_ERROR).
    // Snapshots and pings can fire concurrently, so funnel every write
    // through one promise chain — each waits for the previous to finish.
    let writeChain: Promise<void> = Promise.resolve();

    const enqueue = (write: () => Promise<void>): Promise<void> => {
      writeChain = writeChain.then(async () => {
        if (closed) return;

        try {
          await write();
        } catch {
          // The client (or a proxy) dropped the connection. Stop here so we
          // don't leak a subscription that throws on every future emit().
          teardown();
        }
      });

      return writeChain;
    };

    const sendSnapshot = (snapshot: unknown) => {
      return enqueue(() => {
        return stream.writeSSE({ event: 'snapshot', data: JSON.stringify(snapshot) });
      });
    };

    // Push the current state immediately so the client renders without waiting.
    await sendSnapshot(getSnapshot());

    unsubscribe = subscribe((snapshot) => {
      sendSnapshot(snapshot);
    });

    // Keep the connection alive: a silent stream is dropped by the idle
    // timeout within ~15-20s. A bare SSE comment (`: ...`) counts as traffic
    // but is ignored by EventSource, so the client never sees a stray event.
    ping = setInterval(() => {
      enqueue(async () => {
        await stream.write(': keepalive\n\n');
      });
    }, PRESENCE_PING_INTERVAL_MS);

    // streamSSE resolves the callback = closes the stream; block until the
    // client disconnects, then release the subscription and keepalive timer.
    await new Promise<void>((resolve) => {
      stream.onAbort(() => {
        teardown();
        resolve();
      });
    });
  });
};
