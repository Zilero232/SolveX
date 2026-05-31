'use client';

import { useTranslations } from 'next-intl';
import { Switch } from '@/shared/ui';
import { useAppSettings } from '../../model/hooks';
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
        label={t('camera')}
        hint={t('cameraHint')}
        control={<DeviceSelect kind="videoinput" />}
        stacked
      />

      <SettingRow
        label={t('mirror')}
        hint={t('mirrorHint')}
        control={
          <Switch
            checked={video.mirrorVideo}
            onCheckedChange={(value) => setGroup('video', { mirrorVideo: value })}
          />
        }
      />
    </div>
  );
};
