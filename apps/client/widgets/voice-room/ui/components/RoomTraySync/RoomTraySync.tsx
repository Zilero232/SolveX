'use client';

import { useLocalParticipant } from '@livekit/components-react';
import { isTauri } from '@tauri-apps/api/core';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { useEffect } from 'react';
import { isNullish } from 'remeda';
import { useTrayMenuItem } from '@/features/system-tray';
import { TAURI_EVENTS } from '@/shared/constants';
import { useSubscription } from '@/shared/lib';

export const RoomTraySync = () => {
  const { localParticipant, isMicrophoneEnabled } = useLocalParticipant();
  const muteItem = useTrayMenuItem('mute');

  useEffect(() => {
    if (isNullish(muteItem)) return;

    muteItem.setChecked(!isMicrophoneEnabled).catch((err) => {
      console.error('tray mute setChecked failed', err);
    });
  }, [muteItem, isMicrophoneEnabled]);

  useSubscription(
    () =>
      getCurrentWindow().listen(TAURI_EVENTS.trayMuteToggle, async () => {
        try {
          await localParticipant.setMicrophoneEnabled(!localParticipant.isMicrophoneEnabled);
        } catch (err) {
          console.error('tray mute toggle failed', err);
        }
      }),
    [localParticipant],
    isTauri() && !isNullish(localParticipant),
  );

  return null;
};
