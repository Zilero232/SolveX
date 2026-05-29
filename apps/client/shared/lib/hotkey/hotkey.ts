import { details, toString as eventToHotkey, setOptions } from 'keyboard-event-to-string';

setOptions({
  cmd: 'Meta',
  ctrl: 'Ctrl',
  alt: 'Alt',
  shift: 'Shift',
  joinWith: '+',
  hideKey: 'never',
});

const PURE_MODIFIER_KEYS = new Set(['Control', 'Shift', 'Alt', 'AltGraph', 'Meta', 'OS']);

export const isPureModifier = (key: string): boolean => {
  return PURE_MODIFIER_KEYS.has(key);
};

export const formatHotkey = (e: KeyboardEvent): string | null => {
  const info = details(e);

  return info.hasKey ? eventToHotkey(e) : null;
};

export const prettyHotkey = (hotkey: string): string => {
  return hotkey.split('+').join(' + ');
};

const MODIFIER_TOKENS = new Set(['Ctrl', 'Shift', 'Alt', 'Meta']);

export const hasModifier = (hotkey: string): boolean => {
  return hotkey.split('+').some((part) => MODIFIER_TOKENS.has(part));
};
