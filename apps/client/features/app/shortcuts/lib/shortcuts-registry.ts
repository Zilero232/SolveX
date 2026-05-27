// Bridges user hotkey settings into Tauri's OS-level global-shortcut plugin.
//
// Each sync diffs the wanted hotkeys against the ones currently active in the
// OS, then drops what's no longer needed and (re-)registers what is.
//
// Why this isn't a flat register/unregister:
//   1. Two actions can share one hotkey (mute + ptt on Ctrl+M) → group + fan out.
//   2. Another OS app may already hold the combo → record so UI can show it.

import { register, unregister, unregisterAll } from '@tauri-apps/plugin-global-shortcut';
import { difference, entries, filter, groupBy, isNonNullish, map, mapValues, pipe } from 'remeda';
import { conflictsActions } from '../model/stores/conflicts';
import { dispatchShortcut } from './dispatch-shortcut';
import type { ShortcutActionId } from '@/entities/app/shortcut';

type ActionToHotkey = Partial<Record<ShortcutActionId, string | null>>;

// Module-level so it survives HMR — a hot-reloaded effect reconciles against prior state.
const activeHotkeys = new Set<string>();

export const syncShortcuts = async (actionToHotkey: ActionToHotkey) => {
  // Group actions by the hotkey they share:
  //   { mute: 'Ctrl+M', ptt: 'Ctrl+M', foo: null }
  //     → { 'Ctrl+M': ['mute', 'ptt'] }
  const actionsByHotkey = pipe(
    entries(actionToHotkey),
    filter(([, hotkey]) => isNonNullish(hotkey)),
    groupBy(([, hotkey]) => hotkey as string),
    mapValues((rows) => map(rows, ([action]) => action)),
  );

  const wantedHotkeys = Object.keys(actionsByHotkey);

  // Drop hotkeys that are no longer wanted.
  for (const hotkey of difference([...activeHotkeys], wantedHotkeys)) {
    try {
      await unregister(hotkey);
    } catch {
      // already gone — fine
    }

    activeHotkeys.delete(hotkey);
  }

  conflictsActions.keep(wantedHotkeys);

  // Register every wanted hotkey. Existing ones are unregistered first so the
  // callback always reflects the latest action list.
  for (const hotkey of wantedHotkeys) {
    try {
      await unregister(hotkey);
    } catch {
      // already gone — fine
    }

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
        // External app holds the combo; UI reads this to show a tooltip.
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
