import type { AppSettings, DeviceSettings } from '../model/types';

export const KIND_TO_SLOT: Record<MediaDeviceKind, keyof DeviceSettings> = {
  audioinput: 'audioInput',
  audiooutput: 'audioOutput',
  videoinput: 'videoInput',
};

// Seed values for a first-time user, and the fallback every persisted object
// is merged over so a setting added in a later release is never `undefined`.
export const DEFAULT_APP_SETTINGS: AppSettings = {
  audio: {
    noiseSuppression: true,
    echoCancellation: true,
    autoGainControl: true,
    // Experimental and unevenly supported across browsers — opt-in only.
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
    pttHold: 'Alt+L',
  },
};
