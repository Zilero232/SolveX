'use client';

import { conflictsStoreApi } from '../stores/conflicts';

export const useShortcutConflict = (accelerator: string | null | undefined): boolean => {
  return conflictsStoreApi.use((state) => {
    return accelerator ? state.items.has(accelerator) : false;
  });
};
