'use client';

import { useLocalParticipant } from '@livekit/components-react';
import { useAsyncEffect } from '@siberiacancode/reactuse';
import { isNullish } from 'remeda';
import { useAppSettings } from '@/widgets/app/app-settings';
import { toggleMicStream } from '../../lib/toggle-mic-stream';

export const useMicActivationMode = () => {
  const { settings } = useAppSettings();
  const { localParticipant } = useLocalParticipant();

  const mode = settings.audio.activationMode;

  useAsyncEffect(async () => {
    if (isNullish(localParticipant)) return;
    if (mode !== 'pushToTalk') return;

    // PTT mode keeps the publication unmuted (so the LiveKit track-state stays
    // a clean "user wants to be heard" flag) but bans the underlying media
    // stream so nothing actually goes out until PTT key is pressed.
    try {
      await localParticipant.setMicrophoneEnabled(true);

      toggleMicStream(localParticipant, false);
    } catch (err) {
      console.error('mic activation: PTT init failed', err);
    }
  }, [mode, localParticipant]);
};
