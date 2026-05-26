'use client';

import { target, useEventListener } from '@siberiacancode/reactuse';
import { formatAccelerator, isPureModifier } from '@/shared/lib/accelerator/accelerator';

type UseRecordShortcutOptions = {
  enabled: boolean;
  onCommit: (accelerator: string) => void;
  onCancel: () => void;
};

export const useRecordShortcut = ({ enabled, onCommit, onCancel }: UseRecordShortcutOptions) => {
  useEventListener(
    target(window),
    'keydown',
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.key === 'Escape') {
        onCancel();
        return;
      }

      if (isPureModifier(e.key)) return;

      const accelerator = formatAccelerator(e);
      if (accelerator === null) return;

      onCommit(accelerator);
    },
    { enabled, capture: true },
  );
};
