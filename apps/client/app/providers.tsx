'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { setLogLevel } from 'livekit-client';
import { LeaveSoundProvider, RoomsPresenceProvider } from '@/entities/room/room';
import { queryClient } from '@/shared/api';
import { Toaster, TooltipProvider } from '@/shared/ui';
import { TitleBar } from '@/widgets/app/title-bar';
import {
  AuthProvider,
  I18nProvider,
  ShortcutsProvider,
  TrayMenuProvider,
  UpdateProvider,
} from './providers/index';
import type { ReactNode } from 'react';

setLogLevel('error');

export const Providers = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <TooltipProvider>
        <div className="flex h-full flex-col">
          <TitleBar />

          <div className="min-h-0 flex-1">
            <TrayMenuProvider>
              <ShortcutsProvider>
                <UpdateProvider>
                  <AuthProvider>
                    <RoomsPresenceProvider>
                      <LeaveSoundProvider>{children}</LeaveSoundProvider>
                    </RoomsPresenceProvider>
                  </AuthProvider>
                </UpdateProvider>
              </ShortcutsProvider>
            </TrayMenuProvider>
          </div>
        </div>
      </TooltipProvider>

      <Toaster />

      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools buttonPosition="bottom-right" />
      )}
    </I18nProvider>
  </QueryClientProvider>
);
