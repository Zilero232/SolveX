'use client';

import { useLocalParticipant, useRoomContext } from '@livekit/components-react';
import { isTauri } from '@tauri-apps/api/core';
import { isNullish } from 'remeda';
import { prettyHotkey, toggleMicStream } from '@/shared/lib';
import { useAppSettings } from '@/widgets/app/app-settings';
import { resolveMicVisual } from '../../lib/mic-visual';
import { useDeafen } from './use-deafen';
import { usePttActive } from './use-ptt-active';
import type { LocalParticipant } from 'livekit-client';

const isCancelled = (err: unknown): boolean => {
  return err instanceof DOMException && err.name === 'NotAllowedError';
};

export const useRoomControls = () => {
  const room = useRoomContext();
  const { localParticipant, isMicrophoneEnabled, isCameraEnabled, isScreenShareEnabled } =
    useLocalParticipant();
  const { settings } = useAppSettings();

  const { isDeafened, toggle: toggleDeafen, undeafen } = useDeafen();

  const pttState = usePttActive();
  const isPtt = settings.audio.activationMode === 'pushToTalk';

  const mic = resolveMicVisual(pttState, isMicrophoneEnabled);

  const pttBinding = settings.shortcuts.pttHold;
  const pttKey = isPtt && isTauri() && pttBinding ? prettyHotkey(pttBinding) : undefined;

  const run = (action: (participant: LocalParticipant) => Promise<unknown>) => {
    return async () => {
      if (isNullish(localParticipant)) return;

      try {
        await action(localParticipant);
      } catch (err) {
        if (isCancelled(err)) return;

        console.error('room control action failed', err);
      }
    };
  };

  const toggleMic = run(async (p) => {
    const next = !p.isMicrophoneEnabled;
    await p.setMicrophoneEnabled(next);

    if (next && isDeafened) void undeafen();
    if (isPtt && next) toggleMicStream(p, false);
  });

  return {
    mic: { ...mic, pttKey, toggle: toggleMic },
    deafen: { active: isDeafened, toggle: toggleDeafen },
    camera: {
      enabled: isCameraEnabled,
      toggle: run((p) => p.setCameraEnabled(!p.isCameraEnabled)),
    },
    screen: {
      enabled: isScreenShareEnabled,
      toggle: run((p) => p.setScreenShareEnabled(!p.isScreenShareEnabled)),
    },
    leave: () => {
      void room.disconnect();
    },
  };
};
