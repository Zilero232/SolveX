'use client';

import { Switch } from '@/shared/ui';
import type { AppSettings } from '../../model';
import { appSettingsStyles as s } from '../AppSettingsButton.styles';
import { DeviceSelect } from '../components/DeviceSelect';
import { SettingRow } from '../components/SettingRow';

type VideoSettingsProps = {
  settings: AppSettings;
  setSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
};

export const VideoSettings = ({ settings, setSetting }: VideoSettingsProps) => (
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
          checked={settings.mirrorVideo}
          onCheckedChange={(value) => setSetting('mirrorVideo', value)}
        />
      }
      hint="Flips your own preview. Other participants always see you unmirrored."
      label="Mirror my video"
    />
  </div>
);
