'use client';

import { isTauri } from '@tauri-apps/api/core';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { buildTrayMenu } from '../../lib/build-tray-menu';
import { setupTray } from '../../lib/setup-tray';
import type { Menu } from '@tauri-apps/api/menu';
import type { TrayItems } from '../../lib/build-tray-menu';

export type TrayMenuValue = { menu: Menu; items: TrayItems };

export const useTraySetup = (): TrayMenuValue | null => {
  const t = useTranslations('tray');
  const [value, setValue] = useState<TrayMenuValue | null>(null);

  useEffect(() => {
    if (!isTauri()) return;

    let cancelled = false;
    let dispose: (() => Promise<void>) | null = null;

    const mount = async () => {
      try {
        const built = await buildTrayMenu({
          header: t('header'),
          mute: t('mute'),
          checkUpdates: t('checkUpdates'),
          quit: t('quit'),
        });

        const { dispose: disposeTray } = await setupTray({
          tooltip: t('tooltip'),
          menu: built.menu,
        });

        if (cancelled) {
          return await disposeTray();
        }

        dispose = disposeTray;

        setValue(built);
      } catch (err) {
        console.error('Tray setup failed', err);
      }
    };

    mount();

    return () => {
      cancelled = true;

      setValue(null);

      void (async () => {
        try {
          await dispose?.();
        } catch {}
      })();
    };
  }, [t]);

  return value;
};
