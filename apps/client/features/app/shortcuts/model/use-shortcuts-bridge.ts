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

// Module-level queue serializes register/unregister calls across effect
// double-fires (React StrictMode, fast settings changes). Without it,
// effect#2's register can race against cleanup#1's unregister and throw
// "HotKey already registered" for accelerators we still own.
let queue: Promise<unknown> = Promise.resolve();

const enqueue = <T>(task: () => Promise<T>): Promise<T> => {
  const next = queue.then(task, task);
  queue = next.catch(() => {});
  return next;
};

export const useShortcutsBridge = () => {
  const { settings } = useAppSettings();

  const bindings = settings.shortcuts;

  useEffect(() => {
    if (!isTauri()) return;

    let cancelled = false;

    enqueue(async () => {
      try {
        await unregisterAll();
      } catch (err) {
        console.error('shortcuts: unregisterAll failed', err);
        return;
      }

      if (cancelled) return;

      // Dedupe by accelerator — plugin rejects the same accelerator
      // registered twice. When two actions share a binding, fan-out happens
      // in the dispatch callback instead.
      const byAccelerator = new Map<string, ShortcutActionId[]>();
      for (const [actionId, accelerator] of entries(bindings)) {
        if (isNullish(accelerator)) continue;
        const list = byAccelerator.get(accelerator) ?? [];
        list.push(actionId);
        byAccelerator.set(accelerator, list);
      }

      for (const [accelerator, actionIds] of byAccelerator) {
        if (cancelled) return;
        try {
          await register(accelerator, (event) => {
            for (const id of actionIds) dispatch(id, event.state);
          });
        } catch (err) {
          console.error(
            `shortcuts: register failed for ${actionIds.join('+')} (${accelerator})`,
            err,
          );
        }
      }
    });

    return () => {
      cancelled = true;
      enqueue(async () => {
        try {
          await unregisterAll();
        } catch (err) {
          console.error('shortcuts: cleanup unregisterAll failed', err);
        }
      });
    };
  }, [bindings]);
};
