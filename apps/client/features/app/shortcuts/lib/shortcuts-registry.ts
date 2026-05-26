import { register, unregister, unregisterAll } from '@tauri-apps/plugin-global-shortcut';
import { entries, isNullish } from 'remeda';
import { conflictsActions } from '../model/stores/conflicts';
import { dispatchShortcut } from './dispatch-shortcut';
import type { ShortcutActionId } from '@/widgets/app/app-settings/model/types';

type Bindings = Partial<Record<ShortcutActionId, string | null>>;
type SyncSignal = { cancelled: boolean };

// Accelerators currently registered with the Tauri plugin. Module-level so
// the set survives HMR — a hot-reloaded effect reconciles against prior state.
const owned = new Set<string>();

// Serializes register/unregister calls so React StrictMode double-mounts and
// fast settings changes never race. Without this, a teardown could wipe a
// registration the next sync just made, or two syncs could collide on the
// same accelerator.
let tail: Promise<unknown> = Promise.resolve();

const serialize = <T>(task: () => Promise<T>): Promise<T> => {
  const next = tail.then(task, task);
  tail = next.catch(() => {});

  return next;
};

const isAlreadyRegisteredError = (err: unknown): boolean => {
  // Tauri's `invoke` rejects with a plain string payload from the Rust side,
  // not an Error instance — check both shapes.
  const msg =
    typeof err === 'string' ? err : err instanceof Error ? err.message : String(err ?? '');

  return msg.includes('already registered');
};

// Always issue an unregister call. `isRegistered` only reflects this plugin's
// JS-side bookkeeping, while OS-level hotkeys can survive HMR or app restart
// and still occupy the combo.
const safeUnregister = async (accelerator: string) => {
  try {
    await unregister(accelerator);
  } catch {
    // expected when nothing was registered for this accelerator
  }

  owned.delete(accelerator);
};

// Dedupe by accelerator — plugin rejects same combo registered twice. When
// two actions share a binding, fan-out happens inside the handler.
const groupBindings = (bindings: Bindings): Map<string, ShortcutActionId[]> => {
  const result = new Map<string, ShortcutActionId[]>();

  for (const [actionId, accelerator] of entries(bindings)) {
    if (isNullish(accelerator)) continue;

    const list = result.get(accelerator) ?? [];
    list.push(actionId);
    result.set(accelerator, list);
  }

  return result;
};

const registerOne = async (accelerator: string, actionIds: ShortcutActionId[]) => {
  await safeUnregister(accelerator);

  try {
    await register(accelerator, (event) => {
      for (const id of actionIds) {
        dispatchShortcut(id, event.state);
      }
    });
    owned.add(accelerator);
    conflictsActions.remove(accelerator);
  } catch (err) {
    if (isAlreadyRegisteredError(err)) {
      // Combo held by an external process — the OS won't yield it.
      conflictsActions.add(accelerator);

      return;
    }

    console.error(`shortcuts: register failed (${accelerator})`, err);
  }
};

const runSync = async (bindings: Bindings, signal: SyncSignal) => {
  if (signal.cancelled) return;

  const desired = groupBindings(bindings);

  for (const accelerator of owned) {
    if (signal.cancelled) return;

    if (!desired.has(accelerator)) {
      await safeUnregister(accelerator);
    }
  }

  conflictsActions.keep(desired.keys());

  for (const [accelerator, actionIds] of desired) {
    if (signal.cancelled) return;

    await registerOne(accelerator, actionIds);
  }
};

const runTeardown = async () => {
  try {
    await unregisterAll();
  } catch (err) {
    console.error('shortcuts: cleanup failed', err);
  }

  owned.clear();
};

// Reconciles OS-level registration with the given bindings. Idempotent.
// `signal` lets a React effect abort mid-sync on teardown.
export const syncShortcuts = (bindings: Bindings, signal: SyncSignal) => {
  return serialize(() => runSync(bindings, signal));
};

export const teardownShortcuts = () => {
  return serialize(runTeardown);
};
