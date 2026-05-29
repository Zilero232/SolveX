'use client';

import { useDebounceCallback, useLocalStorage } from '@siberiacancode/reactuse';
import { type Participant, RemoteParticipant } from 'livekit-client';
import { useEffect, useRef, useState } from 'react';
import { clamp, defaultTo } from 'remeda';
import { STORAGE_KEYS } from '@/shared/constants';

const MAX_VOLUME = 1;
const DEFAULT_VOLUME = 1;

const PERSIST_DELAY_MS = 300;

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

  const { value, set: setVolumes } = useLocalStorage<VolumeMap>(
    STORAGE_KEYS.participantVolumes,
    {},
  );

  const volumes = defaultTo(value, {} as VolumeMap);

  const [volume, setVolumeState] = useState(() => volumes[participant.identity] ?? DEFAULT_VOLUME);

  const volumeBeforeMute = useRef(DEFAULT_VOLUME);

  const volumesRef = useRef(volumes);
  volumesRef.current = volumes;

  const persist = useDebounceCallback((identity: string, next: number) => {
    if (next === DEFAULT_VOLUME) {
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
