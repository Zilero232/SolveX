const MODIFIER_KEYS = new Set(['Control', 'Shift', 'Alt', 'AltGraph', 'Meta', 'OS']);

export const isPureModifier = (key: string) => MODIFIER_KEYS.has(key);

const NAMED_CODES: Record<string, string> = {
  Space: 'Space',
  Enter: 'Enter',
  Escape: 'Escape',
  Backspace: 'Backspace',
  Tab: 'Tab',
  Minus: '-',
  Equal: '=',
  BracketLeft: '[',
  BracketRight: ']',
  Backslash: '\\',
  Semicolon: ';',
  Quote: "'",
  Comma: ',',
  Period: '.',
  Slash: '/',
  Backquote: '`',
};

const codeToKey = (code: string): string | null => {
  if (code.startsWith('Key')) return code.slice(3);
  if (code.startsWith('Digit')) return code.slice(5);
  if (/^F\d{1,2}$/.test(code)) return code;
  if (code.startsWith('Arrow')) return code.slice(5);
  return NAMED_CODES[code] ?? null;
};

export const formatAccelerator = (e: KeyboardEvent): string | null => {
  const key = codeToKey(e.code);
  if (key === null) return null;

  const parts: string[] = [];
  if (e.ctrlKey) parts.push('Ctrl');
  if (e.shiftKey) parts.push('Shift');
  if (e.altKey) parts.push('Alt');
  if (e.metaKey) parts.push('Meta');
  parts.push(key);

  return parts.join('+');
};

export const prettyAccelerator = (accelerator: string) => accelerator.split('+').join(' + ');

const MODIFIER_NAMES = new Set(['Ctrl', 'Shift', 'Alt', 'Meta']);

export const hasModifier = (accelerator: string) =>
  accelerator.split('+').some((part) => MODIFIER_NAMES.has(part));

export const isFunctionKey = (accelerator: string) => /^F\d{1,2}$/.test(accelerator);
