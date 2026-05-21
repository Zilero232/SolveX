'use client';

import { useLocalStorage } from '@siberiacancode/reactuse';
import { defaultTo } from 'remeda';
import { STORAGE_KEYS } from '@/shared/constants';

// Categories of voice-room lifecycle sounds the user can toggle independently.
export type SoundCategory = 'join' | 'leave' | 'mute' | 'reconnect' | 'message';

export type AppSettings = {
  // Audio capture processing — re-applied to a live mic track when in a room.
  noiseSuppression: boolean;
  echoCancellation: boolean;
  autoGainControl: boolean;
  // Mirror the local camera preview (cosmetic, applies to self only).
  mirrorVideo: boolean;
  // Master multiplier (0..1) for room lifecycle sounds.
  soundsVolume: number;
  // Per-category enable flags for room lifecycle sounds.
  sounds: Record<SoundCategory, boolean>;
};

export const DEFAULT_APP_SETTINGS: AppSettings = {
  noiseSuppression: true,
  echoCancellation: true,
  autoGainControl: true,
  mirrorVideo: true,
  soundsVolume: 1,
  sounds: {
    join: true,
    leave: true,
    mute: true,
    reconnect: true,
    message: true,
  },
};

type UseAppSettings = {
  settings: AppSettings;
  setSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  toggleSound: (category: SoundCategory) => void;
};

export const useAppSettings = (): UseAppSettings => {
  // One shared entry; reactuse keeps every consumer (dialog + sound hook) in
  // sync, so a toggle in the dialog reaches useVoiceRoomSounds immediately.
  const { value, set } = useLocalStorage<AppSettings>(
    STORAGE_KEYS.appSettings,
    DEFAULT_APP_SETTINGS,
  );

  // Merge over defaults so a settings shape added in a later release does not
  // read as `undefined` for users with an older persisted object.
  const stored = defaultTo(value, DEFAULT_APP_SETTINGS);
  const settings: AppSettings = {
    ...DEFAULT_APP_SETTINGS,
    ...stored,
    sounds: { ...DEFAULT_APP_SETTINGS.sounds, ...stored.sounds },
  };

  const setSetting: UseAppSettings['setSetting'] = (key, value) => {
    set({ ...settings, [key]: value });
  };

  const toggleSound: UseAppSettings['toggleSound'] = (category) => {
    set({
      ...settings,
      sounds: { ...settings.sounds, [category]: !settings.sounds[category] },
    });
  };

  return { settings, setSetting, toggleSound };
};
