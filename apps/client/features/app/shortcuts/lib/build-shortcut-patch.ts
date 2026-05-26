import { entries, values } from 'remeda';
import type { ShortcutActionId, ShortcutSettings } from '@/entities/app/shortcut';

// Resolves a recorded accelerator into a settings patch. If another action
// already holds the same combo, it gets cleared in the same patch so two
// actions never share a binding silently.
export const buildShortcutPatch = (
  actionId: ShortcutActionId,
  accelerator: string,
  current: ShortcutSettings,
): Partial<ShortcutSettings> => {
  const stolenFrom = entries(current).find(
    ([id, value]) => id !== actionId && value === accelerator,
  )?.[0];

  const patch: Partial<ShortcutSettings> = { [actionId]: accelerator };

  if (stolenFrom) patch[stolenFrom] = null;

  return patch;
};

// True when the accelerator is already bound to any of our own actions —
// the bridge holds the OS registration, so an OS probe would falsely report
// "already registered" against ourselves.
export const isOwnedByUs = (accelerator: string, current: ShortcutSettings): boolean => {
  return values(current).includes(accelerator);
};
