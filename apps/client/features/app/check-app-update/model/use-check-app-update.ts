'use client';

import { useCounter } from '@siberiacancode/reactuse';
import { isTauri } from '@tauri-apps/api/core';
import { relaunch } from '@tauri-apps/plugin-process';
import { check } from '@tauri-apps/plugin-updater';
import { useEffect, useRef, useState } from 'react';
import { clamp } from 'remeda';
import { match } from 'ts-pattern';
import { APP_EVENTS } from '@/shared/constants';
import { raceWithTimeout } from '@/shared/lib';
import { APP_UPDATE_CONFIG } from '../config/config';
import type { Update } from '@tauri-apps/plugin-updater';
import type { UpdateInfo } from './types';

export const useCheckAppUpdate = () => {
  const [update, setUpdate] = useState<Update | null>(null);
  const [status, setStatus] = useState<UpdateInfo['status']>(() =>
    isTauri() ? 'checking' : 'idle',
  );
  const [progress, setProgress] = useState(0);
  const recheckTick = useCounter(0);
  const hasCheckedOnceRef = useRef(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: recheckTick.value is the manual re-trigger; bumping it must re-run the effect
  useEffect(() => {
    if (!isTauri()) return;

    let cancelled = false;

    const run = async () => {
      // Only flash the splash on first check; later manual rechecks stay in
      // the background so the rest of the app keeps rendering.
      if (!hasCheckedOnceRef.current) setStatus('checking');

      try {
        const result = await raceWithTimeout(check(), APP_UPDATE_CONFIG.checkTimeoutMs);

        if (cancelled) return;

        hasCheckedOnceRef.current = true;

        if (!result.ok || !result.value) {
          return setStatus('unavailable');
        }

        setUpdate(result.value);
        setStatus('available');
      } catch (err) {
        console.error('Update check failed', err);

        if (!cancelled) {
          hasCheckedOnceRef.current = true;
          setStatus('unavailable');
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [recheckTick.value]);

  useEffect(() => {
    if (!isTauri()) return;

    const onRecheck = () => recheckTick.inc();

    window.addEventListener(APP_EVENTS.recheckUpdate, onRecheck);

    return () => window.removeEventListener(APP_EVENTS.recheckUpdate, onRecheck);
  }, [recheckTick.inc]);

  const install = async () => {
    if (!update) return;

    setStatus('downloading');
    setProgress(0);

    let downloaded = 0;
    let total = 0;

    try {
      await update.downloadAndInstall((event) => {
        match(event)
          .with({ event: 'Started' }, ({ data }) => {
            total = data.contentLength ?? 0;
          })
          .with({ event: 'Progress' }, ({ data }) => {
            downloaded += data.chunkLength;

            const percent = total > 0 ? Math.round((downloaded / total) * 100) : 0;

            setProgress(clamp(percent, { min: 0, max: 100 }));
          })
          .with({ event: 'Finished' }, () => {
            setStatus('installing');
            setProgress(100);
          })
          .exhaustive();
      });

      await relaunch();
    } catch (err) {
      console.error('Update install failed', err);
      setStatus('error');
    }
  };

  const dismiss = () => {
    setStatus('unavailable');
    setUpdate(null);
  };

  return {
    status,
    currentVersion: update?.currentVersion ?? null,
    version: update?.version ?? null,
    date: update?.date ?? null,
    progress,
    install,
    dismiss,
  };
};
