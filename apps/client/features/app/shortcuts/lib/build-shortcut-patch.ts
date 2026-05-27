import type { ShortcutActionId, ShortcutSettings } from '@/entities/app/shortcut';

// Resolves a recorded hotkey into a settings patch. If another action already
// holds the same combo, it gets cleared in the same patch so two actions never
// share a binding silently.
export const buildShortcutPatch = (
  actionId: ShortcutActionId,
  hotkey: string,
  current: ShortcutSettings,
): Partial<ShortcutSettings> => {
  const patch: Partial<ShortcutSettings> = { [actionId]: hotkey };

  // Find another action holding this hotkey and clear it.
  for (const id in current) {
    const otherId = id as ShortcutActionId;

    if (otherId !== actionId && current[otherId] === hotkey) {
      patch[otherId] = null;
      break;
    }
  }

  return patch;
};

// True when the hotkey is already bound to any of our own actions — the bridge
// holds the OS registration, so an OS probe would falsely report "already
// registered" against ourselves.
export const isOwnedByUs = (hotkey: string, current: ShortcutSettings): boolean => {
  for (const id in current) {
    if (current[id as ShortcutActionId] === hotkey) return true;
  }

  return false;
};
