import { defaultWindowIcon } from '@tauri-apps/api/app';
import { TrayIcon } from '@tauri-apps/api/tray';
import { toggleMainWindow } from '@/shared/lib';
import { TRAY_ID } from '../config/menu-ids';
import type { Menu } from '@tauri-apps/api/menu';

type SetupTrayArgs = {
  tooltip: string;
  menu: Menu;
};

type SetupTrayResult = {
  dispose: () => Promise<void>;
};

export const setupTray = async ({ tooltip, menu }: SetupTrayArgs): Promise<SetupTrayResult> => {
  const existing = await TrayIcon.getById(TRAY_ID);

  if (existing) await existing.close();

  const icon = await defaultWindowIcon();

  const tray = await TrayIcon.new({
    id: TRAY_ID,
    icon: icon ?? undefined,
    tooltip,
    menu,
    menuOnLeftClick: false,
    action: (event) => {
      if (event.type === 'Click' && event.button === 'Left' && event.buttonState === 'Up') {
        toggleMainWindow().catch(() => {});
      }
    },
  });

  return {
    dispose: () => tray.close().then(() => undefined),
  };
};
