import { match } from 'ts-pattern';
import { appBus } from '@/shared/lib';
import type { ShortcutActionId } from '@/entities/app/shortcut';

type KeyState = 'Pressed' | 'Released';

export const dispatchShortcut = (actionId: ShortcutActionId, state: KeyState) => {
  return match({ actionId, state })
    .with({ actionId: 'pttHold' }, ({ state: s }) => {
      appBus.push('pttKey', { phase: s === 'Pressed' ? 'pressed' : 'released' });
    })
    .with({ actionId: 'muteToggle', state: 'Pressed' }, () => {
      appBus.push('muteToggle', undefined);
    })
    .otherwise(() => {});
};
