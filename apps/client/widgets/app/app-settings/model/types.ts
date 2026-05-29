import type { AudioCaptureOptions } from 'livekit-client';
import type { ShortcutSettings } from '@/entities/app/shortcut';

export type SoundCategory = 'join' | 'leave' | 'mute' | 'reconnect' | 'message';

export type MicActivationMode = 'voiceActivity' | 'pushToTalk';

export type AudioSettings = {
  [K in keyof Pick<
    AudioCaptureOptions,
    'noiseSuppression' | 'echoCancellation' | 'autoGainControl' | 'voiceIsolation'
  >]-?: boolean;
} & {
  activationMode: MicActivationMode;
};

export type VideoSettings = {
  mirrorVideo: boolean;
};

export type DeviceSettings = {
  audioInput: string;
  audioOutput: string;
  videoInput: string;
};

export type SoundSettings = {
  volume: number;
  enabled: Record<SoundCategory, boolean>;
};

export type TraySettings = {
  closeToTray: boolean;
};

export type SystemSettings = {
  tray: TraySettings;
};

export type { ShortcutActionId, ShortcutBinding, ShortcutSettings } from '@/entities/app/shortcut';

export type AppSettings = {
  audio: AudioSettings;
  video: VideoSettings;
  devices: DeviceSettings;
  sounds: SoundSettings;
  system: SystemSettings;
  shortcuts: ShortcutSettings;
};

export type SettingsGroup = keyof AppSettings;

export type UseAppSettings = {
  settings: AppSettings;
  toggleSound: (category: SoundCategory) => void;
  setGroup: <G extends SettingsGroup>(group: G, patch: Partial<AppSettings[G]>) => void;
};
