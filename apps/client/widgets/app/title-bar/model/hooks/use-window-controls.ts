'use client';

import { isTauri } from '@tauri-apps/api/core';
import { useEffect, useState } from 'react';
import {
  closeMainWindow,
  hideMainWindow,
  isMainWindowMaximized,
  minimizeMainWindow,
  onMainWindowResized,
  toggleMaximizeMainWindow,
} from '@/shared/lib';
import { useAppSettings } from '@/widgets/app/app-settings';

export const useWindowControls = () => {
  const { settings } = useAppSettings();

  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    if (!isTauri()) return;

    let unlisten: (() => void) | undefined;

    const setup = async () => {
      setIsMaximized(await isMainWindowMaximized());

      unlisten = await onMainWindowResized(async () => {
        setIsMaximized(await isMainWindowMaximized());
      });
    };

    setup();

    return () => {
      unlisten?.();
    };
  }, []);

  const close = async () => {
    if (settings.system.tray.closeToTray) {
      return await hideMainWindow();
    }

    await closeMainWindow();
  };

  return {
    isMaximized,
    minimize: minimizeMainWindow,
    toggleMaximize: toggleMaximizeMainWindow,
    close,
  };
};
