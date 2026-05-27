// Single source of truth for user-bindable actions. Add new entries here when
// expanding the shortcut surface — the bridge, settings UI, dispatcher and
// types all derive from this map.
export const SHORTCUT_ACTIONS = {
  muteToggle: 'muteToggle',
  pttHold: 'pttHold',
} as const;

export type ShortcutActionId = (typeof SHORTCUT_ACTIONS)[keyof typeof SHORTCUT_ACTIONS];
