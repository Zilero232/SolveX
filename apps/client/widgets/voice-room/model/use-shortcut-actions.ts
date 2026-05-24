'use client';

import { useLocalParticipant } from '@livekit/components-react';
import { target, useEventListener } from '@siberiacancode/reactuse';
import { isTauri } from '@tauri-apps/api/core';
import { isNullish } from 'remeda';
import { ACTION_EVENTS, type PttEventDetail } from '@/shared/constants';
import { useAppSettings } from '@/widgets/app-settings';

export const useShortcutActions = () => {
  const { localParticipant } = useLocalParticipant();
  const { settings } = useAppSettings();

  const mode = settings.audio.activationMode;
  const enabled = isTauri() && !isNullish(localParticipant);

  // Custom event names aren't in WindowEventMap, so the handler arg is widened
  // to Event via cast — both paths read only what they need off it.
  useEventListener(
    target(window),
    ACTION_EVENTS.muteToggle as keyof WindowEventMap,
    async () => {
      if (mode === 'pushToTalk') return;
      try {
        await localParticipant.setMicrophoneEnabled(!localParticipant.isMicrophoneEnabled);
      } catch (err) {
        console.error('shortcut mute.toggle failed', err);
      }
    },
    { enabled },
  );

  useEventListener(
    target(window),
    ACTION_EVENTS.pttHold as keyof WindowEventMap,
    async (event) => {
      const { detail } = event as unknown as CustomEvent<PttEventDetail>;
      try {
        await localParticipant.setMicrophoneEnabled(detail.phase === 'pressed');
      } catch (err) {
        console.error('shortcut ptt.hold failed', err);
      }
    },
    { enabled },
  );
};
