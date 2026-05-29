'use client';

import { useLocalParticipant } from '@livekit/components-react';
import { isTauri } from '@tauri-apps/api/core';
import { useTranslations } from 'next-intl';
import { isNullish } from 'remeda';
import { toast } from 'sonner';
import { appBus } from '@/shared/lib';
import { useAppSettings } from '@/widgets/app/app-settings';
import { toggleMicStream } from '../../lib/toggle-mic-stream';

export const useShortcutActions = () => {
  const { localParticipant } = useLocalParticipant();
  const { settings } = useAppSettings();
  const t = useTranslations('room.shortcuts');

  const mode = settings.audio.activationMode;
  const enabled = isTauri() && !isNullish(localParticipant);

  appBus.useSubscribe('muteToggle', async () => {
    if (!enabled) return;

    try {
      const next = !localParticipant.isMicrophoneEnabled;
      await localParticipant.setMicrophoneEnabled(next);

      if (mode === 'pushToTalk' && next) {
        toggleMicStream(localParticipant, false);
      }
    } catch (err) {
      console.error('shortcut mute.toggle failed', err);
    }
  });

  appBus.useSubscribe('pttKey', (payload) => {
    if (!enabled || mode !== 'pushToTalk') return;

    if (!localParticipant.isMicrophoneEnabled) {
      if (payload.phase === 'pressed') toast.info(t('pttBlockedByMute'));
      return;
    }

    appBus.push('pttHold', payload);

    toggleMicStream(localParticipant, payload.phase === 'pressed');
  });
};
