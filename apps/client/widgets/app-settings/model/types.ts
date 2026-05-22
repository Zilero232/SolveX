import type { AudioCaptureOptions } from 'livekit-client';

// Categories of voice-room lifecycle sounds the user can toggle independently.
export type SoundCategory = 'join' | 'leave' | 'mute' | 'reconnect' | 'message';

// --- Audio ---------------------------------------------------------------

// The mic capture flags we expose, sourced from LiveKit so the field names
// stay in sync with AudioCaptureOptions. LiveKit types these as ConstrainBoolean
// (a MediaTrackConstraint); a plain boolean is all a toggle needs, so they are
// narrowed and made required here.
export type AudioSettings = {
  [K in keyof Pick<
    AudioCaptureOptions,
    'noiseSuppression' | 'echoCancellation' | 'autoGainControl' | 'voiceIsolation'
  >]-?: boolean;
};

// --- Video ---------------------------------------------------------------

export type VideoSettings = {
  // Mirror the local camera preview (cosmetic, applies to self only).
  mirrorVideo: boolean;
};

// --- Devices -------------------------------------------------------------

// Persisted device selection. Each value is a MediaDeviceInfo.deviceId, or an
// empty string meaning "follow the system default" (an absent/unplugged device
// also falls back to the default, so a stale id is harmless).
export type DeviceSettings = {
  audioInput: string;
  audioOutput: string;
  videoInput: string;
};

// --- Sounds --------------------------------------------------------------

export type SoundSettings = {
  // Master multiplier (0..1) for room lifecycle sounds.
  volume: number;
  // Per-category enable flags for room lifecycle sounds.
  enabled: Record<SoundCategory, boolean>;
};

// --- Root ----------------------------------------------------------------

export type AppSettings = {
  audio: AudioSettings;
  video: VideoSettings;
  devices: DeviceSettings;
  sounds: SoundSettings;
};

// A settings group — the top-level keys of AppSettings (`audio`, `video`, ...).
export type SettingsGroup = keyof AppSettings;

export type UseAppSettings = {
  settings: AppSettings;
  toggleSound: (category: SoundCategory) => void;
  setGroup: <G extends SettingsGroup>(group: G, patch: Partial<AppSettings[G]>) => void;
};
