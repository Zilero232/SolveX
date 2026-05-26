import type { AudioCaptureOptions } from 'livekit-client';
import type { ShortcutSettings } from '@/entities/app/shortcut';

// Categories of voice-room lifecycle sounds the user can toggle independently.
export type SoundCategory = 'join' | 'leave' | 'mute' | 'reconnect' | 'message';

// --- Audio ---------------------------------------------------------------

// How the microphone gets unmuted. 'voiceActivity' = always live, user
// toggles mute manually. 'pushToTalk' = mic forced off, only unmutes while
// the pttHold shortcut is held.
export type MicActivationMode = 'voiceActivity' | 'pushToTalk';

// The mic capture flags we expose, sourced from LiveKit so the field names
// stay in sync with AudioCaptureOptions. LiveKit types these as ConstrainBoolean
// (a MediaTrackConstraint); a plain boolean is all a toggle needs, so they are
// narrowed and made required here. Augmented with project-specific flags
// (activation mode) that LiveKit does not own.
export type AudioSettings = {
  [K in keyof Pick<
    AudioCaptureOptions,
    'noiseSuppression' | 'echoCancellation' | 'autoGainControl' | 'voiceIsolation'
  >]-?: boolean;
} & {
  activationMode: MicActivationMode;
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

// --- System --------------------------------------------------------------

// Desktop-only behaviour for the close button and the system tray. Read on
// the web too (with defaults) so the type stays uniform; the System tab is
// only shown when running under Tauri.
export type TraySettings = {
  // When true, the window close button hides the app to the tray instead of
  // quitting. The native Quit menu item still exits regardless.
  closeToTray: boolean;
};

// System-level desktop settings. Grouped together so the System tab can grow
// (autostart, hardware acceleration, etc.) without flattening unrelated knobs.
export type SystemSettings = {
  tray: TraySettings;
};

// --- Shortcuts -----------------------------------------------------------

// Domain types live in the entity layer; re-exported here so app-settings
// consumers keep a single import surface.
export type { ShortcutActionId, ShortcutBinding, ShortcutSettings } from '@/entities/app/shortcut';

// --- Root ----------------------------------------------------------------

export type AppSettings = {
  audio: AudioSettings;
  video: VideoSettings;
  devices: DeviceSettings;
  sounds: SoundSettings;
  system: SystemSettings;
  shortcuts: ShortcutSettings;
};

// A settings group — the top-level keys of AppSettings (`audio`, `video`, ...).
export type SettingsGroup = keyof AppSettings;

export type UseAppSettings = {
  settings: AppSettings;
  toggleSound: (category: SoundCategory) => void;
  setGroup: <G extends SettingsGroup>(group: G, patch: Partial<AppSettings[G]>) => void;
};
