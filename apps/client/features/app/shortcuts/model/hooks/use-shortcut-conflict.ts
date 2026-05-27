'use client';

import { conflictsStoreApi } from '../stores/conflicts';

export const useShortcutConflict = (hotkey: string | null | undefined): boolean => {
  return conflictsStoreApi.use((state) => {
    return hotkey ? state.items.has(hotkey) : false;
  });
};
