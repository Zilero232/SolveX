'use client';

import { useTranslations } from 'next-intl';
import { Switch } from '@/shared/ui';
import { type AudioSettings, useAppSettings } from '../../model';
import { appSettingsStyles as s } from '../AppSettingsButton.styles';
import { DeviceSelect } from '../components/DeviceSelect';
import { MicTest } from '../components/MicTest';
import { SettingRow } from '../components/SettingRow';

export const AudioTab = () => {
  const t = useTranslations('settings.audio');
  const tDevices = useTranslations('settings.devices');

  const { settings, setGroup } = useAppSettings();

  const audio = settings.audio;

  // Only persist here — this dialog opens from the sidebar, outside LiveKitRoom,
  // so it has no room to apply to. useDeviceSync, which runs inside the room,
  // watches the store and re-captures the mic track when these flags change.
  const setFlag = (key: keyof AudioSettings, value: boolean) => {
    setGroup('audio', { [key]: value });
  };

  return (
    <div className={s.tabPanel}>
      <SettingRow
        stacked
        control={<DeviceSelect kind="audioinput" />}
        hint={t('microphoneHint')}
        label={t('microphone')}
      />

      <SettingRow
        stacked
        control={<DeviceSelect emptyLabel={tDevices('systemDefault')} kind="audiooutput" />}
        hint={t('speakersHint')}
        label={t('speakers')}
      />

      <SettingRow
        stacked
        control={<MicTest audio={audio} deviceId={settings.devices.audioInput} />}
        hint={t('testMicHint')}
        label={t('testMic')}
      />

      <SettingRow
        control={
          <Switch
            checked={audio.noiseSuppression}
            onCheckedChange={(value) => setFlag('noiseSuppression', value)}
          />
        }
        hint={t('noiseSuppressionHint')}
        label={t('noiseSuppression')}
      />

      <SettingRow
        control={
          <Switch
            checked={audio.echoCancellation}
            onCheckedChange={(value) => setFlag('echoCancellation', value)}
          />
        }
        hint={t('echoCancellationHint')}
        label={t('echoCancellation')}
      />

      <SettingRow
        control={
          <Switch
            checked={audio.autoGainControl}
            onCheckedChange={(value) => setFlag('autoGainControl', value)}
          />
        }
        hint={t('autoGainControlHint')}
        label={t('autoGainControl')}
      />

      <SettingRow
        control={
          <Switch
            checked={audio.voiceIsolation}
            onCheckedChange={(value) => setFlag('voiceIsolation', value)}
          />
        }
        hint={t('voiceIsolationHint')}
        label={t('voiceIsolation')}
      />
    </div>
  );
};
