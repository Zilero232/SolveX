'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { useCurrentUser } from '@/entities/user';
import { ROUTES } from '@/shared/constants';
import { ChannelsPanel } from '@/widgets/channels-panel';
import { ServerRail } from '@/widgets/server-rail';
import { authedShellStyles as s } from './AuthedShell.styles';
import type { AuthedShellProps } from './AuthedShell.types';

export const AuthedShell = ({ children }: AuthedShellProps) => {
  const router = useRouter();

  const { session } = useCurrentUser();

  const [channelsOpened, toggleChannels] = useBoolean(true);

  // biome-ignore lint/correctness/useExhaustiveDependencies: redirect must fire only on session change; router is a stable ref
  useEffect(() => {
    if (!session) router.replace(ROUTES.auth);
  }, [session]);

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
