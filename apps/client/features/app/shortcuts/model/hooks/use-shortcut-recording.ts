'use client';

import { target, useBoolean, useEventListener } from '@siberiacancode/reactuse';
import { isTauri } from '@tauri-apps/api/core';
import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { formatHotkey, hasModifier, isPureModifier } from '@/shared/lib';
import { buildShortcutPatch, isOwnedByUs } from '../../lib/build-shortcut-patch';
import { probeOsAvailability } from '../../lib/probe-os-availability';
import { syncShortcuts, teardownShortcuts } from '../../lib/shortcuts-registry';
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

/**
 * UI flow for "press a key combo to bind it".
 *
 * OS hotkeys must be torn down during recording — otherwise the OS fires its
 * own handler (e.g. WM_HOTKEY on Windows) and the browser never sees the
 * keydown, so an already-bound combo couldn't be re-recorded.
 *
 *   start  → unregister all our OS hotkeys + listen for keydown
 *   commit → save the new combo; the bridge effect re-registers everything
 *   cancel → restore OS hotkeys from current settings
 */
export const useShortcutRecording = ({ actionId, allBindings, onPatch }: Options): Result => {
  const t = useTranslations('settings.shortcuts');
  const [recording, toggleRecording] = useBoolean(false);

  // Latest bindings — captured by unmount cleanup which can't depend on the
  // prop (re-running the cleanup on every change would race the bridge).
  const bindingsRef = useRef(allBindings);
  bindingsRef.current = allBindings;

  // True while OS hotkeys are torn down — guards against double-restore.
  const isTornDownRef = useRef(false);

  const start = () => {
    toggleRecording(true);

    if (isTauri()) {
      isTornDownRef.current = true;
      
      teardownShortcuts();
    }
  };

  const cancel = () => {
    toggleRecording(false);

    if (isTauri() && isTornDownRef.current) {
      isTornDownRef.current = false;

      syncShortcuts(bindingsRef.current);
    }
  };

  // Unmount safety net — if the user closes the dialog mid-recording, restore.
  useEffect(() => {
    return () => {
      if (isTauri() && isTornDownRef.current) syncShortcuts(bindingsRef.current);
    };
  }, []);

  useEventListener(
    target(window),
    'keydown',
    async (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.key === 'Escape') return cancel();

      // Only a modifier was pressed — keep waiting for the main key.
      if (isPureModifier(e.key)) return;

      const hotkey = formatHotkey(e);
      if (!hotkey) return;

      if (!hasModifier(hotkey)) {
        toast.error(t('errors.needsModifier'));

        return cancel();
      }

      // Own existing binding — bridge had it before teardown, no probe needed.
      const free = isOwnedByUs(hotkey, allBindings) || (await probeOsAvailability(hotkey));

      if (!free) {
        toast.error(t('errors.systemTaken'));

        return cancel();
      }

      toggleRecording(false);

      isTornDownRef.current = false;

      onPatch(buildShortcutPatch(actionId, hotkey, allBindings));
    },
    { enabled: recording, capture: true },
  );

  return { recording, start };
};
