'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect } from 'react';

import { useAuthStore } from '@/entities/user';
import { ROUTES } from '@/shared/constants';
import { ChannelsPanel } from '@/widgets/channels-panel';
import { ServerRail } from '@/widgets/server-rail';

import type { AuthedShellProps } from './AuthedShell.types';

import { authedShellStyles as s } from './AuthedShell.styles';

export const AuthedShell = ({ children }: AuthedShellProps) => {
  const router = useRouter();

  const session = useAuthStore((state) => state.session);

  const [channelsOpened, toggleChannels] = useBoolean(true);

  useEffect(() => {
    if (!session) router.replace(ROUTES.auth);
  }, [session, router]);

  if (!session) return null;

  return (
    <div className={s.root}>
      <ServerRail channelsOpened={channelsOpened} onToggleChannels={() => toggleChannels()} />

      {channelsOpened ? (
        <Suspense fallback={null}>
          <ChannelsPanel />
        </Suspense>
      ) : null}

      <div className={s.content}>{children}</div>
    </div>
  );
};
