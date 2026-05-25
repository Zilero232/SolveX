'use client';

import { useDebounceCallback, useLocalStorage } from '@siberiacancode/reactuse';
import { type Participant, RemoteParticipant } from 'livekit-client';
import { useEffect, useRef, useState } from 'react';
import { clamp, defaultTo } from 'remeda';
import { STORAGE_KEYS } from '@/shared/constants';

// Volume range applied locally: 0 (muted) .. 2 (200%).
const MAX_VOLUME = 2;
const DEFAULT_VOLUME = 1;

// Delay before a volume change is flushed to localStorage. Dragging the
// slider fires continuously; the audio updates instantly, only the persisted
// write is debounced.
const PERSIST_DELAY_MS = 300;

// Persisted map of identity -> volume. Only non-default volumes are kept so
// the store stays small and an absent entry simply means "default loudness".
type VolumeMap = Record<string, number>;

type ParticipantVolume = {
  volume: number;
  isMuted: boolean;
  isControllable: boolean;
  toggleMute: () => void;
  setVolume: (next: number) => void;
};

const clampVolume = (value: number) => clamp(value, { min: 0, max: MAX_VOLUME });

export const useParticipantVolume = (participant: Participant): ParticipantVolume => {
  const isControllable = participant instanceof RemoteParticipant;

  // One shared localStorage entry backs every card; reactuse keeps the
  // instances in sync, so each card reads its own slice by identity.
  const { value, set: setVolumes } = useLocalStorage<VolumeMap>(
    STORAGE_KEYS.participantVolumes,
    {},
  );

  const volumes = defaultTo(value, {} as VolumeMap);

  // Live volume, seeded from the persisted value. Drives the audio and the
  // slider directly so neither lags behind the debounced storage write.
  const [volume, setVolumeState] = useState(() => volumes[participant.identity] ?? DEFAULT_VOLUME);

  // Remembers loudness from before a mute so unmute restores the prior value.
  const volumeBeforeMute = useRef(DEFAULT_VOLUME);

  // The latest map is read at flush time, not capture time, so concurrent
  // writes from other cards are not clobbered.
  const volumesRef = useRef(volumes);
  volumesRef.current = volumes;

  const persist = useDebounceCallback((identity: string, next: number) => {
    if (next === DEFAULT_VOLUME) {
      // Drop the entry at the default value — absence is the default.
      const { [identity]: _, ...rest } = volumesRef.current;

      setVolumes(rest);
    } else {
      setVolumes({ ...volumesRef.current, [identity]: next });
    }
  }, PERSIST_DELAY_MS);

  const apply = (next: number) => {
    const clamped = clampVolume(next);

    setVolumeState(clamped);
    persist(participant.identity, clamped);

    if (participant instanceof RemoteParticipant) participant.setVolume(clamped);
  };

  const setVolume = (next: number) => {
    if (next > 0) volumeBeforeMute.current = next;

    apply(next);
  };

  const toggleMute = () => {
    if (volume > 0) {
      volumeBeforeMute.current = volume;

      apply(0);
    } else {
      apply(volumeBeforeMute.current || DEFAULT_VOLUME);
    }
  };

  // The participant object is recreated on reconnect (and on rejoin) — re-apply
  // the live volume so LiveKit's audio element matches the preference.
  useEffect(() => {
    if (participant instanceof RemoteParticipant) participant.setVolume(clampVolume(volume));
  }, [participant, volume]);

  return {
    volume,
    isControllable,
    isMuted: volume === 0,
    setVolume,
    toggleMute,
  };
};
