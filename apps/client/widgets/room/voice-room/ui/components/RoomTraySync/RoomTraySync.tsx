'use client';

import { useLocalParticipant } from '@livekit/components-react';
import { isTauri } from '@tauri-apps/api/core';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { useEffect } from 'react';
import { isNullish } from 'remeda';
import { useTrayMenuItem } from '@/features/app/system-tray';
import { TAURI_EVENTS } from '@/shared/constants';
import { useSubscription } from '@/shared/hooks';
import { useAppSettings } from '@/widgets/app/app-settings';

export const RoomTraySync = () => {
  const { localParticipant, isMicrophoneEnabled } = useLocalParticipant();
  const muteItem = useTrayMenuItem('mute');
  const { settings } = useAppSettings();

  const isPtt = settings.audio.activationMode === 'pushToTalk';

  useEffect(() => {
    if (isNullish(muteItem)) return;

    // PTT: the mic state is transient (key-hold) — keep the tray checkbox
    // pinned to unchecked instead of flickering with every press.
    const next = isPtt ? false : !isMicrophoneEnabled;

    (async () => {
      try {
        await muteItem.setChecked(next);
      } catch (err) {
        console.error('tray mute setChecked failed', err);
      }
    })();
  }, [muteItem, isMicrophoneEnabled, isPtt]);

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
    isTauri() && !isNullish(localParticipant) && !isPtt,
  );

  return null;
};
