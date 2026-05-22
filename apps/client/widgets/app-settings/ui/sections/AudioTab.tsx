'use client';

import { Switch } from '@/shared/ui';
import { type AudioSettings, useAppSettings } from '../../model';
import { appSettingsStyles as s } from '../AppSettingsButton.styles';
import { DeviceSelect } from '../components/DeviceSelect';
import { MicTest } from '../components/MicTest';
import { SettingRow } from '../components/SettingRow';

export const AudioTab = () => {
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
        hint="The microphone used to capture your voice."
        label="Microphone"
      />

      <SettingRow
        stacked
        control={<DeviceSelect emptyLabel="System default" kind="audiooutput" />}
        hint="Where room audio is played back."
        label="Speakers"
      />

      <SettingRow
        stacked
        control={<MicTest audio={audio} deviceId={settings.devices.audioInput} />}
        hint="Speak to see the level; press to hear yourself."
        label="Test microphone"
      />

      <SettingRow
        control={
          <Switch
            checked={audio.noiseSuppression}
            onCheckedChange={(value) => setFlag('noiseSuppression', value)}
          />
        }
        hint="Filters out steady background noise."
        label="Noise suppression"
      />

      <SettingRow
        control={
          <Switch
            checked={audio.echoCancellation}
            onCheckedChange={(value) => setFlag('echoCancellation', value)}
          />
        }
        hint="Removes echo from your speakers."
        label="Echo cancellation"
      />

      <SettingRow
        control={
          <Switch
            checked={audio.autoGainControl}
            onCheckedChange={(value) => setFlag('autoGainControl', value)}
          />
        }
        hint="Evens out your microphone loudness. Turn off for music."
        label="Auto gain control"
      />

      <SettingRow
        control={
          <Switch
            checked={audio.voiceIsolation}
            onCheckedChange={(value) => setFlag('voiceIsolation', value)}
          />
        }
        hint="Experimental — stronger voice isolation. Browser support varies."
        label="Voice isolation"
      />
    </div>
  );
};
