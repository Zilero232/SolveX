'use client';

import { isTauri } from '@tauri-apps/api/core';
import { register, unregisterAll } from '@tauri-apps/plugin-global-shortcut';
import { useEffect } from 'react';
import { entries, isNullish } from 'remeda';
import { match } from 'ts-pattern';
import { ACTION_EVENTS } from '@/shared/constants';
import { useAppSettings } from '@/widgets/app/app-settings';
import type { ShortcutActionId } from '@/widgets/app/app-settings/model/types';

const dispatch = (actionId: ShortcutActionId, state: 'Pressed' | 'Released') =>
  match({ actionId, state })
    .with({ actionId: 'pttHold' }, ({ state: s }) => {
      window.dispatchEvent(
        new CustomEvent(ACTION_EVENTS.pttHold, {
          detail: { phase: s === 'Pressed' ? 'pressed' : 'released' },
        }),
      );
    })
    // Toggle-style actions react only on key-down; Released would fire them twice.
    .with({ state: 'Pressed' }, ({ actionId: id }) => {
      window.dispatchEvent(new CustomEvent(ACTION_EVENTS[id]));
    })
    .otherwise(() => {});

export const useShortcutsBridge = () => {
  const { settings } = useAppSettings();

  const bindings = settings.shortcuts;

  useEffect(() => {
    if (!isTauri()) return;

    let cancelled = false;

    const apply = async () => {
      try {
        await unregisterAll();
      } catch (err) {
        console.error('shortcuts: unregisterAll failed', err);
        return;
      }

      if (cancelled) return;

      await Promise.all(
        entries(bindings).map(async ([actionId, accelerator]) => {
          if (isNullish(accelerator)) return;
          try {
            await register(accelerator, (event) => dispatch(actionId, event.state));
          } catch (err) {
            console.error(`shortcuts: register failed for ${actionId} (${accelerator})`, err);
          }
        }),
      );
    };

    apply();

    return () => {
      cancelled = true;
      (async () => {
        try {
          await unregisterAll();
        } catch (err) {
          console.error('shortcuts: cleanup unregisterAll failed', err);
        }
      })();
    };
  }, [bindings]);
};
