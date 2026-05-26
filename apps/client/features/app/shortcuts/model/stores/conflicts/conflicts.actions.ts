import { conflictsStoreApi } from './conflicts.store';

const add = (accelerator: string) => {
  const current = conflictsStoreApi.get().items;

  if (current.has(accelerator)) return;

  conflictsStoreApi.set({ items: new Set(current).add(accelerator) });
};

const remove = (accelerator: string) => {
  const current = conflictsStoreApi.get().items;

  if (!current.has(accelerator)) return;

  const next = new Set(current);
  next.delete(accelerator);

  conflictsStoreApi.set({ items: next });
};

const keep = (accelerators: Iterable<string>) => {
  const keepSet = new Set(accelerators);
  const next = new Set<string>();

  let changed = false;

  const current = conflictsStoreApi.get().items;

  for (const accel of current) {
    if (keepSet.has(accel)) {
      next.add(accel);
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
