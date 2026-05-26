'use client';

import { isTauri } from '@tauri-apps/api/core';
import { platform } from '@tauri-apps/plugin-os';
import { useState } from 'react';
import type { Platform } from '@tauri-apps/plugin-os';

export const useWindowPlatform = () => {
  const [os] = useState<Platform | null>(() => (isTauri() ? platform() : null));

  return os;
};
