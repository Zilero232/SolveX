'use client';

import { useEffect, useState } from 'react';
import { buildPresenceStreamUrl } from '@/shared/api';
import type { RoomsParticipantsSnapshot } from '@chatovo/schemas/livekit';

const EMPTY: RoomsParticipantsSnapshot['rooms'] = {};

/**
 * Subscribes to the server's rooms-presence SSE stream and returns the live
 * participant map for every active LiveKit room.
 *
 * One connection serves the whole app. The stream only opens when `enabled`
 * is true (an authenticated session exists) — the SSE endpoint needs a token.
 */
export const useRoomsPresenceStream = (enabled: boolean) => {
  const [rooms, setRooms] = useState<RoomsParticipantsSnapshot['rooms']>(EMPTY);

  useEffect(() => {
    if (!enabled) {
      setRooms(EMPTY);

      return;
    }

    let source: EventSource | null = null;
    let cancelled = false;
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined;

    const connect = async () => {
      try {
        // The token is short-lived; fetch a fresh one on every (re)connect so a
        // reconnect after a long drop doesn't replay an expired URL.
        const url = await buildPresenceStreamUrl();

        if (cancelled) return;

        source = new EventSource(url);

        source.addEventListener('snapshot', (event) => {
          try {
            const snapshot = JSON.parse(event.data) as RoomsParticipantsSnapshot;

            setRooms(snapshot.rooms);
          } catch {
            // Ignore malformed frames; the next snapshot replaces state wholesale.
          }
        });

        // EventSource fires `error` on every transient hiccup, including while
        // it is still CONNECTING and retrying on its own. Only step in when the
        // connection is truly CLOSED — then EventSource has given up, so we
        // reconnect manually with a freshly minted token. Reacting to every
        // `error` would kill a still-healthy stream and spawn duplicates.
        source.addEventListener('error', () => {
          if (cancelled || source?.readyState !== EventSource.CLOSED) return;

          source.close();
          source = null;
          clearTimeout(reconnectTimer);
          reconnectTimer = setTimeout(connect, 3_000);
        });
      } catch {
        // No valid session — leave the participant map empty.
      }
    };

    connect();

    return () => {
      cancelled = true;
      clearTimeout(reconnectTimer);
      source?.close();
    };
  }, [enabled]);

  return rooms;
};
