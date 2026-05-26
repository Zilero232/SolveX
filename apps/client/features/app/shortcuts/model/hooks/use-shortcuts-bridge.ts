'use client';

import { isTauri } from '@tauri-apps/api/core';
import { useEffect } from 'react';
import { useAppSettings } from '@/widgets/app/app-settings';
import { syncShortcuts, teardownShortcuts } from '../../lib/shortcuts-registry';

// Bridges user-defined shortcut bindings into Tauri's global-shortcut plugin.
// Mount once at the app root; runs only inside the desktop shell.
export const useShortcutsBridge = () => {
  const { settings } = useAppSettings();

  const bindings = settings.shortcuts;

  useEffect(() => {
    if (!isTauri()) return;

    const signal = { cancelled: false };

    syncShortcuts(bindings, signal);

    return () => {
      signal.cancelled = true;

      teardownShortcuts();
    };
  }, [bindings]);
};
