'use client';

import { useRoomContext } from '@livekit/components-react';
import { useEffect, useState } from 'react';

const POLL_INTERVAL_MS = 2_000;

/**
 * Reads the current round-trip time (ping, in ms) to the LiveKit SFU.
 *
 * LiveKit's `useConnectionQuality` only exposes a coarse enum — it has no
 * millisecond figure. The real RTT lives in the WebRTC layer, so this polls
 * the peer connection's `getStats()` for the active candidate pair every
 * couple of seconds.
 *
 * Returns `null` until the first sample arrives (or while disconnected).
 */
export const useConnectionRtt = (): number | null => {
  const [rtt, setRtt] = useState<number | null>(null);
  
  const room = useRoomContext();

  useEffect(() => {
    let cancelled = false;

    const sample = async () => {
      // The publisher transport exists once connected; its candidate pair
      // carries the same transport RTT as the subscriber.
      const publisher = room.engine.pcManager?.publisher;

      if (!publisher) return;

      const stats = await publisher.getStats();

      if (cancelled) return;

      for (const report of stats.values()) {
        // The succeeded candidate pair is the live transport; its
        // currentRoundTripTime is in seconds.
        if (
          report.type === 'candidate-pair' &&
          report.state === 'succeeded' &&
          typeof report.currentRoundTripTime === 'number'
        ) {
          return setRtt(Math.round(report.currentRoundTripTime * 1_000));
        }
      }
    };

    void sample();

    const timer = setInterval(() => void sample(), POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      
      clearInterval(timer);
    };
  }, [room]);

  return rtt;
};
