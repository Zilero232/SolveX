'use client';

import { isTauri } from '@tauri-apps/api/core';
import { useEffect } from 'react';
import { useAppSettings } from '@/widgets/app/app-settings';
import { syncShortcuts, teardownShortcuts } from '../../lib/shortcuts-registry';

// Bridges user-defined shortcut bindings into Tauri's global-shortcut plugin.
// Mount once at the app root; runs only inside the desktop shell.
export const useShortcutsBridge = () => {
  const { settings } = useAppSettings();

  // Re-sync on every bindings change. `syncShortcuts` diffs against the
  // current OS state, so this is cheap when nothing changed.
  useEffect(() => {
    if (!isTauri()) return;

    syncShortcuts(settings.shortcuts);
  }, [settings.shortcuts]);

  // Tear down once on unmount (app shutdown). Sync handles the diff between
  // rebinds, so unregistering on every change would just churn the OS.
  useEffect(() => {
    if (!isTauri()) return;

    return () => {
      teardownShortcuts();
    };
  }, []);
};
