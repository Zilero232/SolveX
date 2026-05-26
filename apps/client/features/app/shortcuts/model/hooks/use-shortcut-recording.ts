'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRecordShortcut } from '@/shared/hooks';
import { hasModifier, isFunctionKey } from '@/shared/lib';
import { buildShortcutPatch, isOwnedByUs } from '../../lib/build-shortcut-patch';
import { probeOsAvailability } from '../../lib/probe-os-availability';
import type { ShortcutActionId, ShortcutSettings } from '@/entities/app/shortcut';

type Options = {
  actionId: ShortcutActionId;
  allBindings: ShortcutSettings;
  onPatch: (patch: Partial<ShortcutSettings>) => void;
};

type Result = {
  recording: boolean;
  start: () => void;
};

// Owns the "press a key combo" UI flow: enter recording, validate, probe the
// OS for conflicts, then emit a settings patch back to the parent.
export const useShortcutRecording = ({ actionId, allBindings, onPatch }: Options): Result => {
  const t = useTranslations('settings.shortcuts');
  const [recording, setRecording] = useState(false);

  useRecordShortcut({
    enabled: recording,
    onCancel: () => setRecording(false),
    onCommit: async (accelerator) => {
      if (!hasModifier(accelerator) && !isFunctionKey(accelerator)) {
        toast.error(t('errors.needsModifier'));
        setRecording(false);

        return;
      }

      const free =
        isOwnedByUs(accelerator, allBindings) || (await probeOsAvailability(accelerator));

      if (!free) {
        toast.error(t('errors.systemTaken'));
        setRecording(false);

        return;
      }

      onPatch(buildShortcutPatch(actionId, accelerator, allBindings));
      setRecording(false);
    },
  });

  return {
    recording,
    start: () => setRecording(true),
  };
};
