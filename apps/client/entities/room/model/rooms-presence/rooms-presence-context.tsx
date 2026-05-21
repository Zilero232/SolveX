'use client';

import { createContextHook } from '@siberiacancode/reactuse';
import { useCurrentUser } from '@/entities/user';
import { useRoomsPresenceStream } from './use-rooms-presence-stream';
import type { ReactNode } from 'react';

const { Provider, use } = createContextHook(useRoomsPresenceStream);

/**
 * Provides the live rooms-presence map to the whole app via a single SSE
 * stream. The stream opens only for authenticated users.
 */
export const RoomsPresenceProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useCurrentUser();

  return <Provider params={[isAuthenticated]}>{children}</Provider>;
};

/** Live participant map for every active LiveKit room, keyed by roomId. */
export const useRoomsPresence = () => {
  const value = use();

  if (!value) throw new Error('useRoomsPresence must be used within RoomsPresenceProvider');

  return value;
};
