'use client';

import { isTauri } from '@tauri-apps/api/core';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { useRef } from 'react';
import { useSubscription } from '@/shared/hooks';
import { hideMainWindow } from '@/shared/lib';
import { useAppSettings } from '@/widgets/app/app-settings';

export const useCloseOnWindowEvent = () => {
  const { settings } = useAppSettings();

  const closeToTrayRef = useRef(settings.system.tray.closeToTray);
  closeToTrayRef.current = settings.system.tray.closeToTray;

  useSubscription(
    () =>
      getCurrentWindow().onCloseRequested((event) => {
        if (!closeToTrayRef.current) return;

        // preventDefault must run before any await: Tauri checks the flag
        // synchronously after the handler returns.
        event.preventDefault();

        hideMainWindow();
      }),
    [],
    isTauri(),
  );
};
