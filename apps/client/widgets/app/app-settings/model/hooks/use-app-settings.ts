'use client';

import { useLocalStorage } from '@siberiacancode/reactuse';
import { mergeDeep } from 'remeda';
import { STORAGE_KEYS } from '@/shared/constants';
import { DEFAULT_APP_SETTINGS } from '../../config/config';
import type { AppSettings, UseAppSettings } from '../types';

export const useAppSettings = (): UseAppSettings => {
  const { value, set } = useLocalStorage<AppSettings>(
    STORAGE_KEYS.appSettings,
    DEFAULT_APP_SETTINGS,
  );

  // Deep-merge over defaults so a field added in a later release is never
  // `undefined`. reactCompiler memoizes the result against `value`.
  const settings: AppSettings = mergeDeep(DEFAULT_APP_SETTINGS, value ?? {});

  const setGroup: UseAppSettings['setGroup'] = (group, patch) => {
    set({ ...settings, [group]: { ...settings[group], ...patch } });
  };

  const toggleSound: UseAppSettings['toggleSound'] = (category) => {
    setGroup('sounds', {
      enabled: { ...settings.sounds.enabled, [category]: !settings.sounds.enabled[category] },
    });
  };

  return { settings, setGroup, toggleSound };
};
