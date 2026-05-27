'use client';

import { createStore } from '@siberiacancode/reactuse';
import type { ConflictsState } from './conflicts.types';

// Tracks hotkeys the OS reported as taken by another application during
// registration. UI reads via `useShortcutConflict`; the bridge writes via
// `conflictsStore.add/remove/keep`.
export const conflictsStoreApi = createStore<ConflictsState>(() => {
  return { items: new Set<string>() };
});
