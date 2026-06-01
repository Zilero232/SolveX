'use client';

import { useInterval } from '@siberiacancode/reactuse';
import { createAudioAnalyser, LocalAudioTrack } from 'livekit-client';
import { useEffect, useRef, useState } from 'react';
import type { AudioSettings } from '../types';

const LEVEL_INTERVAL_MS = 60;

type UseMicTest = {
  level: number;
  isLoopback: boolean;
  toggleLoopback: () => void;
  error: boolean;
};

type MicTestArgs = {
  deviceId: string;
  audio: AudioSettings;
};

export const useMicTest = ({ deviceId, audio }: MicTestArgs): UseMicTest => {
  const [level, setLevel] = useState(0);
  const [isLoopback, setIsLoopback] = useState(false);
  const [error, setError] = useState(false);

  const sinkRef = useRef<HTMLAudioElement | null>(null);
  if (sinkRef.current === null && typeof Audio !== 'undefined') {
    sinkRef.current = new Audio();
    sinkRef.current.muted = true;
  }

  const calcVolumeRef = useRef<(() => number) | null>(null);

  useEffect(() => {
    let track: LocalAudioTrack | undefined;
    let cleanup: (() => Promise<void>) | undefined;
    let cancelled = false;

    const constraints: MediaTrackConstraints = {
      ...audio,
      ...(deviceId && { deviceId: { exact: deviceId } }),
    };

    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: constraints });

        if (cancelled) {
          for (const t of stream.getTracks()) t.stop();

          return;
        }

        setError(false);

        track = new LocalAudioTrack(stream.getAudioTracks()[0]);

        const sink = sinkRef.current;
        if (sink) {
          sink.srcObject = stream;

          try {
            await sink.play();
          } catch {}
        }

        const analyser = createAudioAnalyser(track);
        calcVolumeRef.current = analyser.calculateVolume;
        cleanup = analyser.cleanup;
      } catch {
        if (!cancelled) setError(true);
      }
    };

    start();

    return () => {
      cancelled = true;

      calcVolumeRef.current = null;
      cleanup?.();
      track?.stop();

      const sink = sinkRef.current;
      if (sink) sink.srcObject = null;

      setLevel(0);
    };
  }, [deviceId, audio]);

  useInterval(() => {
    if (calcVolumeRef.current) setLevel(calcVolumeRef.current());
  }, LEVEL_INTERVAL_MS);

  const toggleLoopback = () => {
    setIsLoopback((on) => {
      const next = !on;

      const sink = sinkRef.current;
      if (sink) sink.muted = !next;

      return next;
    });
  };

  return { level, isLoopback, toggleLoopback, error };
};
