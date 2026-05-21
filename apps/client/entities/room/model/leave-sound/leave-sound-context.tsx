'use client';

import { createContextHook, useAudio } from '@siberiacancode/reactuse';
import type { ReactNode } from 'react';

// Owns the leave chime at the app root. The provider never unmounts, so the
// useAudio element survives every room/page teardown — a leave sound started
// as the user exits a room plays to the end instead of being cut off.
const useLeaveSoundValue = () => {
  const { play } = useAudio('/audios/user_leave.mp3', { interrupt: true });

  // `interrupt` pauses an in-flight clip before replaying, which rejects the
  // pending play() promise — an expected restart, so the rejection is ignored.
  return () => {
    play().catch(() => {});
  };
};

const { Provider, use } = createContextHook(useLeaveSoundValue);

export const LeaveSoundProvider = ({ children }: { children: ReactNode }) => (
  <Provider params={[]}>{children}</Provider>
);

export const useLeaveSound = () => {
  const value = use();

  if (!value) throw new Error('useLeaveSound must be used within LeaveSoundProvider');

  return value;
};
