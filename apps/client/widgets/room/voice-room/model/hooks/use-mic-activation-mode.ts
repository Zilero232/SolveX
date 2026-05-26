'use client';

import { useLocalParticipant } from '@livekit/components-react';
import { useAsyncEffect } from '@siberiacancode/reactuse';
import { isNullish } from 'remeda';
import { useAppSettings } from '@/widgets/app/app-settings';

export const useMicActivationMode = () => {
  const { settings } = useAppSettings();
  const { localParticipant } = useLocalParticipant();

  const mode = settings.audio.activationMode;

  useAsyncEffect(async () => {
    if (isNullish(localParticipant)) return;
    if (mode !== 'pushToTalk') return;

    try {
      await localParticipant.setMicrophoneEnabled(false);
    } catch (err) {
      console.error('mic activation: force-off in PTT failed', err);
    }
  }, [mode, localParticipant]);
};
