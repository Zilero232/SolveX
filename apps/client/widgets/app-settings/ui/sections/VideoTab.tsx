'use client';

import { Switch } from '@/shared/ui';
import { useAppSettings } from '../../model';
import { appSettingsStyles as s } from '../AppSettingsButton.styles';
import { DeviceSelect } from '../components/DeviceSelect';
import { SettingRow } from '../components/SettingRow';

export const VideoTab = () => {
  const { settings, setGroup } = useAppSettings();

  const video = settings.video;

  return (
    <div className={s.tabPanel}>
      <SettingRow
        stacked
        control={<DeviceSelect kind="videoinput" />}
        hint="The camera used when you turn on video."
        label="Camera"
      />

      <SettingRow
        control={
          <Switch
            checked={video.mirrorVideo}
            onCheckedChange={(value) => setGroup('video', { mirrorVideo: value })}
          />
        }
        hint="Flips your own preview. Other participants always see you unmirrored."
        label="Mirror my video"
      />
    </div>
  );
};
