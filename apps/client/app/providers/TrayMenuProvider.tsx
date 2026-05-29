'use client';

import { trayMenuContext, useCloseOnWindowEvent, useTraySetup } from '@/features/app/system-tray';
import type { ReactNode } from 'react';

export const TrayMenuProvider = ({ children }: { children: ReactNode }) => {
  const tray = useTraySetup();

  useCloseOnWindowEvent();

  const contextValue = { value: tray, set: () => {} };

  return (
    <trayMenuContext.instance.Provider value={contextValue}>
      {children}
    </trayMenuContext.instance.Provider>
  );
};
