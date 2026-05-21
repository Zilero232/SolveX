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

    const connect = async () => {
      try {
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
      } catch {
        // No valid session — leave the participant map empty.
      }
    };

    connect();

    return () => {
      cancelled = true;
      source?.close();
    };
  }, [enabled]);

  return rooms;
};
