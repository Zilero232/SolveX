'use client';

import { useTranslations } from 'next-intl';
import { Switch } from '@/shared/ui';
import { useAppSettings } from '../../model';
import { appSettingsStyles as s } from '../AppSettingsButton.styles';
import { DeviceSelect } from '../components/DeviceSelect';
import { SettingRow } from '../components/SettingRow';

export const VideoTab = () => {
  const t = useTranslations('settings.video');
  const { settings, setGroup } = useAppSettings();

  const video = settings.video;

  return (
    <div className={s.tabPanel}>
      <SettingRow
        stacked
        control={<DeviceSelect kind="videoinput" />}
        hint={t('cameraHint')}
        label={t('camera')}
      />

      <SettingRow
        control={
          <Switch
            checked={video.mirrorVideo}
            onCheckedChange={(value) => setGroup('video', { mirrorVideo: value })}
          />
        }
        hint={t('mirrorHint')}
        label={t('mirror')}
      />
    </div>
  );
};
