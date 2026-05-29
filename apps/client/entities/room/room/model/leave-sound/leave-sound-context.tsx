'use client';

import { createContextHook, useAudio } from '@siberiacancode/reactuse';
import type { ReactNode } from 'react';

const useLeaveSoundValue = () => {
  const { play } = useAudio('/audios/user_leave.mp3', { interrupt: true });

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
