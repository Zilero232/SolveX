'use client';

import { createContextHook } from '@siberiacancode/reactuse';
import { useCurrentUser } from '@/entities/auth/user';
import { useRoomsPresenceStream } from './use-rooms-presence-stream';
import type { ReactNode } from 'react';

const { Provider, use } = createContextHook(useRoomsPresenceStream);

export const RoomsPresenceProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useCurrentUser();

  return <Provider params={[isAuthenticated]}>{children}</Provider>;
};

export const useRoomsPresence = () => {
  const value = use();

  if (!value) throw new Error('useRoomsPresence must be used within RoomsPresenceProvider');

  return value;
};
