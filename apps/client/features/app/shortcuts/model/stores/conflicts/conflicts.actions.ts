import { conflictsStoreApi } from './conflicts.store';

const add = (hotkey: string) => {
  const current = conflictsStoreApi.get().items;

  if (current.has(hotkey)) return;

  conflictsStoreApi.set({ items: new Set(current).add(hotkey) });
};

const remove = (hotkey: string) => {
  const current = conflictsStoreApi.get().items;

  if (!current.has(hotkey)) return;

  const next = new Set(current);
  next.delete(hotkey);

  conflictsStoreApi.set({ items: next });
};

const keep = (hotkeys: Iterable<string>) => {
  const keepSet = new Set(hotkeys);
  const next = new Set<string>();

  let changed = false;

  const current = conflictsStoreApi.get().items;

  for (const hotkey of current) {
    if (keepSet.has(hotkey)) {
      next.add(hotkey);
    } else {
      changed = true;
    }
  }

  if (!changed) return;

  conflictsStoreApi.set({ items: next });
};

export const conflictsActions = {
  add,
  remove,
  keep,
};
