'use client';

import { useRoomContext } from '@livekit/components-react';
import { useEffect, useState } from 'react';

const POLL_INTERVAL_MS = 2_000;

export const useConnectionRtt = (): number | null => {
  const [rtt, setRtt] = useState<number | null>(null);

  const room = useRoomContext();

  useEffect(() => {
    let cancelled = false;

    const sample = async () => {
      const publisher = room.engine?.pcManager?.publisher;

      if (!publisher) return;

      const stats = await publisher.getStats();

      if (cancelled) return;

      for (const report of stats.values()) {
        if (
          report.type === 'candidate-pair' &&
          report.state === 'succeeded' &&
          typeof report.currentRoundTripTime === 'number'
        ) {
          return setRtt(Math.round(report.currentRoundTripTime * 1_000));
        }
      }
    };

    sample();

    const timer = setInterval(() => {
      sample();
    }, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;

      clearInterval(timer);
    };
  }, [room]);

  return rtt;
};
