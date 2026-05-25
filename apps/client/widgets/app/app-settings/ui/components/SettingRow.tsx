'use client';

import { appSettingsStyles as s } from '../AppSettingsButton.styles';
import type { ReactNode } from 'react';

type SettingRowProps = {
  label: string;
  hint?: string;
  control: ReactNode;
  // When true the control is placed below the label instead of beside it.
  stacked?: boolean;
};

export const SettingRow = ({ label, hint, control, stacked = false }: SettingRowProps) => (
  <div className={stacked ? s.stackedRow : s.row}>
    <div className={s.rowText}>
      <span className={s.rowLabel}>{label}</span>
      {hint && <span className={s.rowHint}>{hint}</span>}
    </div>

    {control}
  </div>
);
