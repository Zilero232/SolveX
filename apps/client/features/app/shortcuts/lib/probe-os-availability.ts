import { register, unregister } from '@tauri-apps/plugin-global-shortcut';

export const probeOsAvailability = async (hotkey: string): Promise<boolean> => {
  try {
    await register(hotkey, () => {});
    await unregister(hotkey);

    return true;
  } catch {
    return false;
  }
};
