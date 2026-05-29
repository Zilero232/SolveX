export const SHORTCUT_ACTIONS = {
  muteToggle: 'muteToggle',
  pttHold: 'pttHold',
} as const;

export type ShortcutActionId = (typeof SHORTCUT_ACTIONS)[keyof typeof SHORTCUT_ACTIONS];
