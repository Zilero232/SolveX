'use client';

import { ShortcutClearButton, ShortcutComboButton } from './components';
import { shortcutRowStyles as s } from './ShortcutRow.styles';
import type { ShortcutRowProps } from './ShortcutRow.types';

export const ShortcutRow = ({
  label,
  display,
  recording,
  showConflictHint,
  clearVisible,
  onRecord,
  onClear,
}: ShortcutRowProps) => {
  return (
    <div className={s.root}>
      <span className={s.label}>{label}</span>

      <div className={s.controls}>
        <ShortcutComboButton
          display={display}
          label={label}
          recording={recording}
          showConflictHint={showConflictHint}
          onClick={onRecord}
        />

        <ShortcutClearButton visible={clearVisible} onClick={onClear} />
      </div>
    </div>
  );
};
