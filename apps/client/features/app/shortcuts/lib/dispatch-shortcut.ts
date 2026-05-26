import { match } from 'ts-pattern';
import { ACTION_EVENTS } from '@/shared/constants';
import type { ShortcutActionId } from '@/widgets/app/app-settings/model/types';

type KeyState = 'Pressed' | 'Released';

// Translates a Tauri hotkey event into the project's custom DOM event so
// feature slices (voice room, etc.) can listen without coupling to Tauri.
export const dispatchShortcut = (actionId: ShortcutActionId, state: KeyState) => {
  return (
    match({ actionId, state })
      .with({ actionId: 'pttHold' }, ({ state: s }) => {
        window.dispatchEvent(
          new CustomEvent(ACTION_EVENTS.pttHold, {
            detail: { phase: s === 'Pressed' ? 'pressed' : 'released' },
          }),
        );
      })
      // Toggle-style actions react only on key-down; Released would fire twice.
      .with({ state: 'Pressed' }, ({ actionId: id }) => {
        window.dispatchEvent(new CustomEvent(ACTION_EVENTS[id]));
      })
      .otherwise(() => {})
  );
};
