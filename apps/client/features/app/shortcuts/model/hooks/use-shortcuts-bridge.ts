'use client';

import { isTauri } from '@tauri-apps/api/core';
import { useEffect } from 'react';
import { useAppSettings } from '@/widgets/app/app-settings';
import { syncShortcuts, teardownShortcuts } from '../../lib/shortcuts-registry';

export const useShortcutsBridge = () => {
  const { settings } = useAppSettings();

  useEffect(() => {
    if (!isTauri()) return;

    syncShortcuts(settings.shortcuts);
  }, [settings.shortcuts]);

  useEffect(() => {
    if (!isTauri()) return;

    return () => {
      teardownShortcuts();
    };
  }, []);
};
