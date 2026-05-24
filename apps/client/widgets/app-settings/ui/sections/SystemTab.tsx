'use client';

import { useTranslations } from 'next-intl';
import { Switch } from '@/shared/ui';
import { useAppSettings } from '../../model';
import { appSettingsStyles as s } from '../AppSettingsButton.styles';
import { SettingRow } from '../components/SettingRow';

export const SystemTab = () => {
  const t = useTranslations('settings.system');
  const { settings, setGroup } = useAppSettings();

  const { tray } = settings.system;

  return (
    <div className={s.tabPanel}>
      <SettingRow
        label={t('closeToTray')}
        hint={t('closeToTrayHint')}
        control={
          <Switch
            checked={tray.closeToTray}
            onCheckedChange={(value) =>
              setGroup('system', { tray: { ...tray, closeToTray: value } })
            }
          />
        }
      />
    </div>
  );
};
