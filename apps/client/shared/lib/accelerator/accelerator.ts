import { details, toString as eventToAccelerator, setOptions } from 'keyboard-event-to-string';

// Tauri accepts both 'Ctrl+M' and 'Ctrl+KeyM'. The library emits 'Ctrl+KeyM'
// which Tauri parses fine — no extra mapping needed.
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

export const formatAccelerator = (e: KeyboardEvent): string | null => {
  const info = details(e);

  return info.hasKey ? eventToAccelerator(e) : null;
};

export const prettyAccelerator = (accelerator: string): string => {
  return accelerator.split('+').join(' + ');
};

const MODIFIER_TOKENS = new Set(['Ctrl', 'Shift', 'Alt', 'Meta']);

export const hasModifier = (accelerator: string): boolean => {
  return accelerator.split('+').some((part) => MODIFIER_TOKENS.has(part));
};

export const isFunctionKey = (accelerator: string): boolean => {
  return /^F\d{1,2}$/.test(accelerator);
};
