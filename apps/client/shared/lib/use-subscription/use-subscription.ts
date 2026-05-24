'use client';

import { useEffect, useRef } from 'react';
import type { DependencyList } from 'react';

type Unsubscribe = () => void;

// Wraps the standard "async subscribe, sync unsubscribe" lifecycle pattern
// used for native event listeners (Tauri events, MediaRecorder, etc.). The
// callback returns a Promise<() => void>; we call the disposer on unmount
// even if the component unmounted while the subscribe call was still in
// flight. If `enabled` is false, the effect is a no-op.
//
// The callback is stashed in a ref so the effect's deps stay caller-controlled
// — passing a fresh closure every render does NOT re-subscribe.
export const useSubscription = (
  subscribe: () => Promise<Unsubscribe>,
  deps: DependencyList,
  enabled = true,
) => {
  const subscribeRef = useRef(subscribe);
  subscribeRef.current = subscribe;

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    let off: Unsubscribe | null = null;

    const run = async () => {
      try {
        const unsubscribe = await subscribeRef.current();

        if (cancelled) {
          unsubscribe();
          return;
        }

        off = unsubscribe;
      } catch (err) {
        console.error('useSubscription subscribe failed', err);
      }
    };

    run();

    return () => {
      cancelled = true;
      off?.();
    };
  }, [enabled, ...deps]);
};
