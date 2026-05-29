'use client';

import { createStore } from '@siberiacancode/reactuse';
import type { ConflictsState } from './conflicts.types';

export const conflictsStoreApi = createStore<ConflictsState>(() => {
  return { items: new Set<string>() };
});
