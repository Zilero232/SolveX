'use client';

import { useMaybeRoomContext } from '@livekit/components-react';
import { Switch } from '@/shared/ui';
import type { AppSettings } from '../../model';
import { appSettingsStyles as s } from '../AppSettingsButton.styles';
import { DeviceSelect } from '../components/DeviceSelect';
import { SettingRow } from '../components/SettingRow';

type AudioSettingsProps = {
  settings: AppSettings;
  setSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
};

// Audio processing flags that require re-capturing the mic track.
type ProcessingKey = 'noiseSuppression' | 'echoCancellation' | 'autoGainControl';

export const AudioSettings = ({ settings, setSetting }: AudioSettingsProps) => {
  // The dialog opens from the sidebar footer, so a room may not exist yet.
  const room = useMaybeRoomContext();

  // Re-publish the mic track with new capture constraints. Only acts when a
  // room exists and the mic is live — otherwise the next unmute applies them.
  const applyProcessing = (next: Pick<AppSettings, ProcessingKey>) => {
    const local = room?.localParticipant;
    if (!local?.isMicrophoneEnabled) return;

    void local.setMicrophoneEnabled(true, {
      noiseSuppression: next.noiseSuppression,
      echoCancellation: next.echoCancellation,
      autoGainControl: next.autoGainControl,
    });
  };

  const setProcessingFlag = (key: ProcessingKey, value: boolean) => {
    setSetting(key, value);

    applyProcessing({
      noiseSuppression: settings.noiseSuppression,
      echoCancellation: settings.echoCancellation,
      autoGainControl: settings.autoGainControl,
      [key]: value,
    });
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
        control={
          <Switch
            checked={settings.noiseSuppression}
            onCheckedChange={(value) => setProcessingFlag('noiseSuppression', value)}
          />
        }
        hint="Filters out steady background noise."
        label="Noise suppression"
      />

      <SettingRow
        control={
          <Switch
            checked={settings.echoCancellation}
            onCheckedChange={(value) => setProcessingFlag('echoCancellation', value)}
          />
        }
        hint="Removes echo from your speakers."
        label="Echo cancellation"
      />

      <SettingRow
        control={
          <Switch
            checked={settings.autoGainControl}
            onCheckedChange={(value) => setProcessingFlag('autoGainControl', value)}
          />
        }
        hint="Evens out your microphone loudness. Turn off for music."
        label="Auto gain control"
      />
    </div>
  );
};
