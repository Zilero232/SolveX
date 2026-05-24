'use client';

import { isTauri } from '@tauri-apps/api/core';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { useRef } from 'react';
import { hideMainWindow, useSubscription } from '@/shared/lib';
import { useAppSettings } from '@/widgets/app-settings';

export const useCloseOnWindowEvent = () => {
  const { settings } = useAppSettings();

  const closeToTrayRef = useRef(settings.tray.closeToTray);
  closeToTrayRef.current = settings.tray.closeToTray;

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
