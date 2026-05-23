'use client';

import { isTauri } from '@tauri-apps/api/core';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { useEffect, useState } from 'react';

export const useWindowControls = () => {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    if (!isTauri()) return;

    const win = getCurrentWindow();
    let unlisten: (() => void) | undefined;

    const setup = async () => {
      try {
        setIsMaximized(await win.isMaximized());

        unlisten = await win.onResized(async () => {
          setIsMaximized(await win.isMaximized());
        });
      } catch (err) {
        console.error('Window controls setup failed', err);
      }
    };

    setup();

    return () => {
      unlisten?.();
    };
  }, []);

  const minimize = async () => {
    try {
      await getCurrentWindow().minimize();
    } catch (err) {
      console.error('Window minimize failed', err);
    }
  };

  const toggleMaximize = async () => {
    try {
      await getCurrentWindow().toggleMaximize();
    } catch (err) {
      console.error('Window toggleMaximize failed', err);
    }
  };

  const close = async () => {
    try {
      await getCurrentWindow().close();
    } catch (err) {
      console.error('Window close failed', err);
    }
  };

  return { isMaximized, minimize, toggleMaximize, close };
};
