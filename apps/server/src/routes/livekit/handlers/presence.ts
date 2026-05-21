import { streamSSE } from 'hono/streaming';
import { verifyAccessToken } from '../../../lib/auth';
import { getSnapshot, subscribe } from '../presence';
import type { Handler } from 'hono';
import type { Env } from '../../shared/types';

// Keepalive cadence. A diagnostic run with no ping confirmed the stream is
// dropped after ~15-20s of silence (idle timeout). Ping at 8s — well inside
// that window, with room to spare if a single ping is lost.
const PING_INTERVAL_MS = 8_000;

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
    let closed = false;
    let unsubscribe = () => {};
    let ping: ReturnType<typeof setInterval> | undefined;

    // Tear down once: drop the subscription, stop the keepalive.
    const teardown = () => {
      if (closed) return;

      closed = true;
      clearInterval(ping);
      unsubscribe();
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

    const sendSnapshot = (snapshot: unknown) =>
      enqueue(() => stream.writeSSE({ event: 'snapshot', data: JSON.stringify(snapshot) }));

    // Push the current state immediately so the client renders without waiting.
    await sendSnapshot(getSnapshot());

    unsubscribe = subscribe((snapshot) => {
      void sendSnapshot(snapshot);
    });

    // Keep the connection alive: a silent stream is dropped by the idle
    // timeout within ~15-20s. A bare SSE comment (`: ...`) counts as traffic
    // but is ignored by EventSource, so the client never sees a stray event.
    ping = setInterval(() => {
      void enqueue(async () => {
        await stream.write(': keepalive\n\n');
      });
    }, PING_INTERVAL_MS);

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
