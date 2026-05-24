'use client';

import { useShortcutsBridge } from '@/features/shortcuts';
import type { ReactNode } from 'react';

export const ShortcutsProvider = ({ children }: { children: ReactNode }) => {
  useShortcutsBridge();

  return <>{children}</>;
};
