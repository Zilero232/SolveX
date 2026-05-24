'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { setLogLevel } from 'livekit-client';
import { LeaveSoundProvider, RoomsPresenceProvider } from '@/entities/room';
import { UpdateBootstrap } from '@/features/check-app-update';
import { queryClient } from '@/shared/api';
import { TitleBar } from '@/widgets/title-bar';
import { AuthBootstrap, I18nProvider, TrayMenuProvider } from './providers/index';
import type { ReactNode } from 'react';

// LiveKit's client logs connection/track lifecycle to the console at info level
// by default — silence everything below errors. Runs once at app startup.
setLogLevel('error');

// The app-wide provider stack. I18nProvider is outermost so every other
// provider and the whole tree can use translations; AuthBootstrap is innermost
// so the splash it shows is already localized.
export const Providers = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <div className="flex h-full flex-col">
        <TitleBar />

        <div className="min-h-0 flex-1">
          <TrayMenuProvider>
            <UpdateBootstrap>
              <RoomsPresenceProvider>
                <LeaveSoundProvider>
                  <AuthBootstrap>{children}</AuthBootstrap>
                </LeaveSoundProvider>
              </RoomsPresenceProvider>
            </UpdateBootstrap>
          </TrayMenuProvider>
        </div>
      </div>

      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools buttonPosition="bottom-right" />
      )}
    </I18nProvider>
  </QueryClientProvider>
);
