import type { ShortcutActionId } from '../config';

// Tauri hotkey string ('Ctrl+Shift+M', 'F8') or null when the user has not
// assigned anything to the action.
export type ShortcutBinding = string | null;

export type ShortcutSettings = Record<ShortcutActionId, ShortcutBinding>;
