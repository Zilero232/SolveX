'use client';

import { useState } from 'react';
import { appBus } from '@/shared/lib';
import { useAppSettings } from '@/widgets/app/app-settings';

export type PttState = 'off' | 'idle' | 'active';

export const usePttActive = (): PttState => {
  const [held, setHeld] = useState(false);

  const { settings } = useAppSettings();

  appBus.useSubscribe('pttHold', (payload) => {
    setHeld(payload.phase === 'pressed');
  });

  if (settings.audio.activationMode !== 'pushToTalk') return 'off';

  return held ? 'active' : 'idle';
};
