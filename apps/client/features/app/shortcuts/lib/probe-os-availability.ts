import { register, unregister } from '@tauri-apps/plugin-global-shortcut';

// Probes whether the OS will let us register an accelerator by briefly claiming
// and releasing it. Returns true when free, false when another process holds it.
export const probeOsAvailability = async (accelerator: string): Promise<boolean> => {
  try {
    await register(accelerator, () => {});
    await unregister(accelerator);

    return true;
  } catch {
    return false;
  }
};
