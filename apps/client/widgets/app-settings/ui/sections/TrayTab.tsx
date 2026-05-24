'use client';

import { useTranslations } from 'next-intl';
import { Switch } from '@/shared/ui';
import { useAppSettings } from '../../model';
import { appSettingsStyles as s } from '../AppSettingsButton.styles';
import { SettingRow } from '../components/SettingRow';

export const TrayTab = () => {
  const t = useTranslations('settings.tray');
  const { settings, setGroup } = useAppSettings();

  const tray = settings.tray;

  return (
    <div className={s.tabPanel}>
      <SettingRow
        label={t('closeToTray')}
        hint={t('closeToTrayHint')}
        control={
          <Switch
            checked={tray.closeToTray}
            onCheckedChange={(value) => setGroup('tray', { closeToTray: value })}
          />
        }
      />
    </div>
  );
};
