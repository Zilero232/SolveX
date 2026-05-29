import type { AppSettings, DeviceSettings } from '../model/types';

export const KIND_TO_SLOT: Record<MediaDeviceKind, keyof DeviceSettings> = {
  audioinput: 'audioInput',
  audiooutput: 'audioOutput',
  videoinput: 'videoInput',
};

export const DEFAULT_APP_SETTINGS: AppSettings = {
  audio: {
    noiseSuppression: true,
    echoCancellation: true,
    autoGainControl: true,
    voiceIsolation: false,
    activationMode: 'voiceActivity',
  },
  video: {
    mirrorVideo: false,
  },
  devices: {
    audioInput: '',
    audioOutput: '',
    videoInput: '',
  },
  sounds: {
    volume: 0.5,
    enabled: {
      join: true,
      leave: true,
      mute: true,
      reconnect: true,
      message: true,
    },
  },
  system: {
    tray: {
      closeToTray: true,
    },
  },
  shortcuts: {
    muteToggle: 'Ctrl+Shift+M',
    deafenToggle: 'Ctrl+Shift+D',
    pttHold: 'Alt+L',
  },
};
