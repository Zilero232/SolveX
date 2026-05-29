import type { ShortcutActionId } from '../config';

export type ShortcutBinding = string | null;

export type ShortcutSettings = Record<ShortcutActionId, ShortcutBinding>;
