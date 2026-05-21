'use client';

import { useEventSource } from '@siberiacancode/reactuse';
import { useEffect, useMemo, useState } from 'react';
import { buildPresenceStreamUrl } from '@/shared/api';
import type { RoomsParticipantsSnapshot } from '@chatovo/schemas/livekit';

const EMPTY: RoomsParticipantsSnapshot['rooms'] = {};

/**
 * Subscribes to the server's rooms-presence SSE stream and returns the live
 * participant map for every active LiveKit room.
 *
 * One connection serves the whole app. The stream only opens when `enabled`
 * is true (an authenticated session exists) — the SSE endpoint needs a token.
 *
 * `useEventSource` owns the connection lifecycle: opening, listening, and
 * reconnecting (`retry`). We only resolve the URL, which embeds a freshly
 * minted access token fetched asynchronously.
 */
export const useRoomsPresenceStream = (enabled: boolean) => {
  const [url, setUrl] = useState<string>();

  // The SSE URL carries a short-lived token, so resolve it before connecting.
  useEffect(() => {
    if (!enabled) {
      setUrl(undefined);

      return;
    }

    let cancelled = false;

    buildPresenceStreamUrl()
      .then((next) => {
        if (!cancelled) setUrl(next);
      })
      .catch(() => {
        // No valid session — leave the stream closed.
      });

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  // `data` carries the raw payload of the latest `snapshot` event (a string);
  // named-event frames bypass the hook's `select`, so we parse it ourselves.
  const { data } = useEventSource<string>(url ?? '', ['snapshot'], {
    immediately: Boolean(url),
    retry: true,
  });

  return useMemo<RoomsParticipantsSnapshot['rooms']>(() => {
    if (typeof data !== 'string') return EMPTY;

    try {
      return (JSON.parse(data) as RoomsParticipantsSnapshot).rooms;
    } catch {
      return EMPTY;
    }
  }, [data]);
};
