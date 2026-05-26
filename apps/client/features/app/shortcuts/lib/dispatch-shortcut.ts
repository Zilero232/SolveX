import { match } from 'ts-pattern';
import { appBus } from '@/shared/lib';
import type { ShortcutActionId } from '@/entities/app/shortcut';

type KeyState = 'Pressed' | 'Released';

// Translates a Tauri hotkey event into a typed app-bus push so feature slices
// (voice room, etc.) can subscribe without coupling to Tauri.
export const dispatchShortcut = (actionId: ShortcutActionId, state: KeyState) => {
  return match({ actionId, state })
    .with({ actionId: 'pttHold' }, ({ state: s }) => {
      // Raw key edge — `useShortcutActions` decides whether to promote it to a
      // `pttHold` (actual transmission) or block it on the mute gate.
      appBus.push('pttKey', { phase: s === 'Pressed' ? 'pressed' : 'released' });
    })
    .with({ actionId: 'muteToggle', state: 'Pressed' }, () => {
      appBus.push('muteToggle', undefined);
    })
    .otherwise(() => {});
};
