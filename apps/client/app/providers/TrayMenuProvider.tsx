'use client';

import { trayMenuContext, useCloseOnWindowEvent, useTraySetup } from '@/features/app/system-tray';
import type { ReactNode } from 'react';

export const TrayMenuProvider = ({ children }: { children: ReactNode }) => {
  const tray = useTraySetup();

  useCloseOnWindowEvent();

  // Bypass the reactuse Provider — it reads initialValue once and our `tray`
  // arrives async. instance.Provider takes a reactive `value` prop.
  // reactCompiler memoizes this object against `tray`.
  const contextValue = { value: tray, set: () => {} };

  return (
    <trayMenuContext.instance.Provider value={contextValue}>
      {children}
    </trayMenuContext.instance.Provider>
  );
};
