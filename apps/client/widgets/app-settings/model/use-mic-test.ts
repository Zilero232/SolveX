'use client';

import { useInterval } from '@siberiacancode/reactuse';
import { createAudioAnalyser, LocalAudioTrack } from 'livekit-client';
import { useEffect, useRef, useState } from 'react';
import type { AudioSettings } from './types';

// Polling rate of the level meter — 60ms keeps the bar lively without spamming
// React renders.
const LEVEL_INTERVAL_MS = 60;

type UseMicTest = {
  // Current mic loudness, 0..1, updated a few times a second.
  level: number;
  // Whether the captured stream is being played back to the user.
  isLoopback: boolean;
  toggleLoopback: () => void;
  // The stream failed to open (no permission, no device); meter stays at 0.
  error: boolean;
};

type MicTestArgs = {
  // Selected input device; empty string follows the system default.
  deviceId: string;
  // Capture processing flags, so the test reflects the real room settings.
  audio: AudioSettings;
};

// Opens a standalone mic stream for the settings dialog: drives a level meter
// and an optional loopback so the user can verify the microphone before a call.
// The stream is owned here and torn down on unmount, so the mic never lingers.
export const useMicTest = ({ deviceId, audio }: MicTestArgs): UseMicTest => {
  const [level, setLevel] = useState(0);
  const [isLoopback, setIsLoopback] = useState(false);
  const [error, setError] = useState(false);

  // The <audio> sink for loopback; muted unless the user enables the test.
  const sinkRef = useRef<HTMLAudioElement | null>(null);
  if (sinkRef.current === null && typeof Audio !== 'undefined') {
    sinkRef.current = new Audio();
    sinkRef.current.muted = true;
  }

  // LiveKit's analyser exposes calculateVolume(); the level interval reads it
  // through this ref and simply does nothing while it is still null.
  const calcVolumeRef = useRef<(() => number) | null>(null);

  useEffect(() => {
    let track: LocalAudioTrack | undefined;
    let cleanup: (() => Promise<void>) | undefined;
    let cancelled = false;

    const constraints: MediaTrackConstraints = {
      ...audio,
      ...(deviceId && { deviceId: { exact: deviceId } }),
    };

    navigator.mediaDevices
      .getUserMedia({ audio: constraints })
      .then((stream) => {
        if (cancelled) {
          for (const t of stream.getTracks()) t.stop();

          return;
        }

        setError(false);

        // Wrap the raw track so LiveKit's analyser can consume it.
        track = new LocalAudioTrack(stream.getAudioTracks()[0]);

        // Feed the same stream to the loopback sink; muted state gates output.
        const sink = sinkRef.current;
        if (sink) {
          sink.srcObject = stream;
          void sink.play().catch(() => {});
        }

        // createAudioAnalyser builds the Web Audio graph and the RMS maths —
        // calculateVolume() already returns a normalised 0..1 level.
        const analyser = createAudioAnalyser(track);
        calcVolumeRef.current = analyser.calculateVolume;
        cleanup = analyser.cleanup;
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;

      calcVolumeRef.current = null;
      void cleanup?.();
      void track?.stop();

      const sink = sinkRef.current;
      if (sink) sink.srcObject = null;

      setLevel(0);
    };
  }, [deviceId, audio]);

  // The meter tick — a no-op until the analyser is ready.
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
