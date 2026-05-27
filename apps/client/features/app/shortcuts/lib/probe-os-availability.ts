import { register, unregister } from '@tauri-apps/plugin-global-shortcut';

// Probes whether the OS will let us register a hotkey by briefly claiming
// and releasing it. Returns true when free, false when another process holds it.
export const probeOsAvailability = async (hotkey: string): Promise<boolean> => {
  try {
    await register(hotkey, () => {});
    await unregister(hotkey);

    return true;
  } catch {
    return false;
  }
};
