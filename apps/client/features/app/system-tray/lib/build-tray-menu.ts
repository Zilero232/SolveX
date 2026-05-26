import { CheckMenuItem, Menu, MenuItem, PredefinedMenuItem } from '@tauri-apps/api/menu';
import { exit } from '@tauri-apps/plugin-process';
import { appBus, showMainWindow } from '@/shared/lib';
import { TRAY_MENU_ID } from '../config/menu-ids';

type TrayMenuLabels = {
  header: string;
  mute: string;
  checkUpdates: string;
  quit: string;
};

export const buildTrayMenu = async (labels: TrayMenuLabels) => {
  const header = await MenuItem.new({
    id: TRAY_MENU_ID.header,
    text: labels.header,
    enabled: false,
  });

  const mute = await CheckMenuItem.new({
    id: TRAY_MENU_ID.mute,
    text: labels.mute,
    checked: false,
    enabled: true,
    action: () => {
      appBus.push('trayMuteToggle', undefined);
    },
  });

  const checkUpdates = await MenuItem.new({
    id: TRAY_MENU_ID.checkUpdates,
    text: labels.checkUpdates,
    action: () => {
      appBus.push('recheckUpdate', undefined);

      showMainWindow().catch(() => {});
    },
  });

  const quit = await MenuItem.new({
    id: TRAY_MENU_ID.quit,
    text: labels.quit,
    action: () => {
      exit(0).catch(() => {});
    },
  });

  const separator = () => PredefinedMenuItem.new({ item: 'Separator' });

  const items = { header, mute, checkUpdates, quit } as const;

  const menu = await Menu.new({
    items: [
      header,
      await separator(),
      mute,
      await separator(),
      checkUpdates,
      await separator(),
      quit,
    ],
  });

  return { menu, items };
};

export type TrayItems = Awaited<ReturnType<typeof buildTrayMenu>>['items'];
