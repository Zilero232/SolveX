'use client';

import { useShortcutsBridge } from '@/features/app/shortcuts';
import type { ReactNode } from 'react';

export const ShortcutsProvider = ({ children }: { children: ReactNode }) => {
  useShortcutsBridge();

  return <>{children}</>;
};
