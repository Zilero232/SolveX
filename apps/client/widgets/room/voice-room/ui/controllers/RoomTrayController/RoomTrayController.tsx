'use client';

import { useLocalParticipant } from '@livekit/components-react';
import { isTauri } from '@tauri-apps/api/core';
import { useEffect } from 'react';
import { isNullish } from 'remeda';
import { useTrayMenuItem } from '@/features/app/system-tray';
import { appBus, toggleMicStream } from '@/shared/lib';
import { useAppSettings } from '@/widgets/app/app-settings';

export const RoomTrayController = () => {
  const { localParticipant, isMicrophoneEnabled } = useLocalParticipant();
  const muteItem = useTrayMenuItem('mute');
  const { settings } = useAppSettings();

  const isPtt = settings.audio.activationMode === 'pushToTalk';
  const active = isTauri() && !isNullish(localParticipant);

  appBus.useSubscribe('trayMuteToggle', async () => {
    if (!active) return;

    try {
      const next = !localParticipant.isMicrophoneEnabled;
      await localParticipant.setMicrophoneEnabled(next);

      if (next) appBus.push('micActivated', undefined);
      if (isPtt && next) {
        toggleMicStream(localParticipant, false);
      }
    } catch (err) {
      console.error('tray mute toggle failed', err);
    }
  });

  useEffect(() => {
    if (isNullish(muteItem)) return;

    const next = isPtt ? false : !isMicrophoneEnabled;

    (async () => {
      try {
        await muteItem.setChecked(next);
      } catch (err) {
        console.error('tray mute setChecked failed', err);
      }
    })();
  }, [muteItem, isMicrophoneEnabled, isPtt]);

  return null;
};
