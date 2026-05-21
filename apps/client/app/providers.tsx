'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { setLogLevel } from 'livekit-client';
import { useEffect } from 'react';
import { RoomsPresenceProvider } from '@/entities/room';
import { subscribeAuth, useCurrentUser } from '@/entities/user';
import { AppUpdater } from '@/features/check-app-update';
import { queryClient } from '@/shared/api';
import type { ReactNode } from 'react';

// LiveKit's client logs connection/track lifecycle to the console at info level
// by default — silence everything below errors. Runs once at app startup.
setLogLevel('error');

const BootSplash = () => (
  <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
    Loading...
  </div>
);

const AuthBootstrap = ({ children }: { children: ReactNode }) => {
  const { isLoading } = useCurrentUser();

  useEffect(() => {
    return subscribeAuth();
  }, []);

  return isLoading ? <BootSplash /> : children;
};

export const Providers = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <AppUpdater />
    <RoomsPresenceProvider>
      <AuthBootstrap>{children}</AuthBootstrap>
    </RoomsPresenceProvider>
    {process.env.NODE_ENV === 'development' && <ReactQueryDevtools buttonPosition="bottom-right" />}
  </QueryClientProvider>
);
