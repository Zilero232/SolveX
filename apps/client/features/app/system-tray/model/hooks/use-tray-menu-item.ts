'use client';

import { useTrayMenu } from '../tray-menu-context';
import type { TrayItems } from '../../lib/build-tray-menu';

export const useTrayMenuItem = <K extends keyof TrayItems>(key: K): TrayItems[K] | null => {
  const tray = useTrayMenu();

  return tray?.items[key] ?? null;
};
