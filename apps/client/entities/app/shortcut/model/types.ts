// Stable IDs for user-bindable actions. Add new entries here when expanding
// the shortcut surface; the bridge and consumers stay generic.
export type ShortcutActionId = 'muteToggle' | 'pttHold';

// Tauri accelerator string ('Ctrl+Shift+M', 'F8') or null when the user has
// not assigned anything to the action.
export type ShortcutBinding = string | null;

export type ShortcutSettings = Record<ShortcutActionId, ShortcutBinding>;
