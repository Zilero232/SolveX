'use client';

import { useMemo } from 'react';
import { trayMenuContext, useCloseOnWindowEvent, useTraySetup } from '@/features/system-tray';
import type { ReactNode } from 'react';

export const TrayMenuProvider = ({ children }: { children: ReactNode }) => {
  const tray = useTraySetup();

  useCloseOnWindowEvent();

  // Bypass the reactuse Provider — it reads initialValue once and our `tray`
  // arrives async. instance.Provider takes a reactive `value` prop.
  const contextValue = useMemo(() => ({ value: tray, set: () => {} }), [tray]);

  return (
    <trayMenuContext.instance.Provider value={contextValue}>
      {children}
    </trayMenuContext.instance.Provider>
  );
};
