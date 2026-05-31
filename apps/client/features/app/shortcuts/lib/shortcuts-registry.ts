import { register, unregister, unregisterAll } from '@tauri-apps/plugin-global-shortcut';
import { difference, entries, filter, groupBy, isNonNullish, map, mapValues, pipe } from 'remeda';
import { conflictsActions } from '../model/stores';
import { dispatchShortcut } from './dispatch-shortcut';
import type { ShortcutActionId } from '@/entities/app/shortcut';

type ActionToHotkey = Partial<Record<ShortcutActionId, string | null>>;

const activeHotkeys = new Set<string>();

export const syncShortcuts = async (actionToHotkey: ActionToHotkey) => {
  const actionsByHotkey = pipe(
    entries(actionToHotkey),
    filter(([, hotkey]) => isNonNullish(hotkey)),
    groupBy(([, hotkey]) => hotkey as string),
    mapValues((rows) => map(rows, ([action]) => action)),
  );

  const wantedHotkeys = Object.keys(actionsByHotkey);

  for (const hotkey of difference([...activeHotkeys], wantedHotkeys)) {
    try {
      await unregister(hotkey);
    } catch {}

    activeHotkeys.delete(hotkey);
  }

  conflictsActions.keep(wantedHotkeys);

  for (const hotkey of wantedHotkeys) {
    try {
      await unregister(hotkey);
    } catch {}

    try {
      const actions = actionsByHotkey[hotkey];

      await register(hotkey, ({ state }) => {
        for (const action of actions) dispatchShortcut(action, state);
      });

      activeHotkeys.add(hotkey);
      conflictsActions.remove(hotkey);
    } catch (err) {
      const msg = String(err instanceof Error ? err.message : err);

      if (msg.includes('already registered')) {
        conflictsActions.add(hotkey);
        continue;
      }

      console.error(`shortcuts: register failed (${hotkey})`, err);
    }
  }
};

export const teardownShortcuts = async () => {
  try {
    await unregisterAll();
  } catch (err) {
    console.error('shortcuts: cleanup failed', err);
  }

  activeHotkeys.clear();
};
