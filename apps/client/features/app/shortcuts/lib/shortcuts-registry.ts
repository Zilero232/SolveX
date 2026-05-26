// Bridges user shortcut settings into Tauri's OS-level global-shortcut plugin.
//
//   registered = combos this module currently holds in the OS
//   desired    = combos the user's settings ask for
//
// Each sync = diff + apply: drop (registered − desired), then add (desired − registered).
//
// Extra machinery beyond a flat register/unregister exists because:
//   1. The plugin rejects parallel calls on one accelerator → single promise queue.
//   2. Two actions can share one accelerator (mute + ptt on Ctrl+M) → group, fan out in callback.
//   3. Another OS app may already hold the combo → record in a store so the UI can show it.

import { register, unregister, unregisterAll } from '@tauri-apps/plugin-global-shortcut';
import { entries, isNullish } from 'remeda';
import { conflictsActions } from '../model/stores/conflicts';
import { dispatchShortcut } from './dispatch-shortcut';
import type { ShortcutActionId } from '@/entities/app/shortcut';

type Bindings = Partial<Record<ShortcutActionId, string | null>>;
type SyncSignal = { cancelled: boolean };
type AccelToActions = Map<string, ShortcutActionId[]>;

// Module-level so it survives HMR — a hot-reloaded effect reconciles against prior state.
const registered = new Set<string>();

// ───────── promise queue ─────────
// Every public call goes through `enqueue`. Tasks run strictly one after another,
// even if a previous one rejected.

let queue: Promise<unknown> = Promise.resolve();

const enqueue = <T>(task: () => Promise<T>): Promise<T> => {
  const next = queue.then(task, task);
  queue = next.catch(() => {});

  return next;
};

// ───────── primitives ─────────

const isAlreadyRegisteredError = (err: unknown): boolean => {
  // Tauri rejects with a plain string from Rust, not an Error instance.
  const msg =
    typeof err === 'string' ? err : err instanceof Error ? err.message : String(err ?? '');

  return msg.includes('already registered');
};

const drop = async (accelerator: string) => {
  try {
    await unregister(accelerator);
  } catch {
    // Nothing was registered — fine.
  }

  registered.delete(accelerator);
};

const add = async (accelerator: string, actionIds: ShortcutActionId[]) => {
  await drop(accelerator);

  try {
    await register(accelerator, (event) => {
      for (const id of actionIds) {
        dispatchShortcut(id, event.state);
      }
    });

    registered.add(accelerator);
    conflictsActions.remove(accelerator);
  } catch (err) {
    if (isAlreadyRegisteredError(err)) {
      // External app holds the combo; UI reads this store to show a tooltip.
      conflictsActions.add(accelerator);

      return;
    }

    console.error(`shortcuts: register failed (${accelerator})`, err);
  }
};

// ───────── diff + apply ─────────

// Two actions can share one accelerator → register once, fan out in callback.
const groupByAccelerator = (bindings: Bindings): AccelToActions => {
  const result: AccelToActions = new Map();

  for (const [actionId, accelerator] of entries(bindings)) {
    if (isNullish(accelerator)) continue;

    const list = result.get(accelerator) ?? [];
    list.push(actionId);
    result.set(accelerator, list);
  }

  return result;
};

const runSync = async (bindings: Bindings, signal: SyncSignal) => {
  const desired = groupByAccelerator(bindings);

  for (const accelerator of registered) {
    if (signal.cancelled) return;
    if (desired.has(accelerator)) continue;

    await drop(accelerator);
  }

  conflictsActions.keep(desired.keys());

  for (const [accelerator, actionIds] of desired) {
    if (signal.cancelled) return;

    await add(accelerator, actionIds);
  }
};

const runTeardown = async () => {
  try {
    await unregisterAll();
  } catch (err) {
    console.error('shortcuts: cleanup failed', err);
  }

  registered.clear();
};

// ───────── public API ─────────

// Reconciles OS-level registration with the given bindings. Idempotent.
// `signal` lets a React effect bail out mid-sync on unmount.
export const syncShortcuts = (bindings: Bindings, signal: SyncSignal) => {
  return enqueue(() => {
    return runSync(bindings, signal);
  });
};

export const teardownShortcuts = () => {
  return enqueue(runTeardown);
};
