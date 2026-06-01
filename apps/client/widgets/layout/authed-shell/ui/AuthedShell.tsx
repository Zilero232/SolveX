'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { Suspense } from 'react';
import { useAuthGuard } from '@/entities/auth/user';
import { AppSidebar } from '@/widgets/app/app-sidebar';
import { MobileNav } from '@/widgets/layout/mobile-nav';
import { ChannelsPanel } from '@/widgets/room/channels-panel';
import { authedShellStyles as s } from './AuthedShell.styles';
import type { AuthedShellProps } from './AuthedShell.types';

export const AuthedShell = ({ children }: AuthedShellProps) => {
  const { isReady } = useAuthGuard({ require: 'auth' });

  const [channelsOpened, toggleChannels] = useBoolean(true);
  const [mobileNavOpen, toggleMobileNav] = useBoolean(false);

  if (!isReady) return null;

  return (
    <div className={s.root}>
      <MobileNav open={mobileNavOpen} onOpenChange={toggleMobileNav} />

      <div className={s.desktopOnly}>
        <AppSidebar channelsOpened={channelsOpened} onToggleChannels={() => toggleChannels()} />
      </div>

      {channelsOpened && (
        <div className={s.desktopOnly}>
          <Suspense fallback={null}>
            <ChannelsPanel />
          </Suspense>
        </div>
      )}

      <div className={s.content}>{children}</div>
    </div>
  );
};
