'use client';

import { isTauri } from '@tauri-apps/api/core';
import { relaunch } from '@tauri-apps/plugin-process';
import { check } from '@tauri-apps/plugin-updater';
import { useEffect, useState } from 'react';
import { clamp } from 'remeda';
import { match } from 'ts-pattern';
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

  useEffect(() => {
    if (!isTauri()) return;

    let cancelled = false;

    const run = async () => {
      try {
        const result = await raceWithTimeout(check(), APP_UPDATE_CONFIG.checkTimeoutMs);

        if (cancelled) return;

        if (!result.ok || !result.value) {
          return setStatus('unavailable');
        }

        setUpdate(result.value);
        setStatus('available');
      } catch (err) {
        console.error('Update check failed', err);

        if (!cancelled) setStatus('unavailable');
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, []);

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
