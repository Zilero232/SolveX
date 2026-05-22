import type { AppSettings, DeviceSettings } from './types';

// Bridges the DOM's MediaDeviceKind and our persisted DeviceSettings slots.
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
  },
  video: {
    mirrorVideo: false,
  },
  devices: {
    // Empty string = follow the system default device.
    audioInput: '',
    audioOutput: '',
    videoInput: '',
  },
  sounds: {
    volume: 1,
    enabled: {
      join: true,
      leave: true,
      mute: true,
      reconnect: true,
      message: true,
    },
  },
};
