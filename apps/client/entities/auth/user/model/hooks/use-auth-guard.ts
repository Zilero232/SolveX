'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { match } from 'ts-pattern';
import { ROUTES } from '@/shared/constants';
import { useCurrentUser } from './use-current-user';

type AuthRequirement = 'auth' | 'guest';

type UseAuthGuardOptions = {
  require: AuthRequirement;
  redirectTo?: string;
};

export const useAuthGuard = ({
  require,
  redirectTo,
}: UseAuthGuardOptions): { isReady: boolean } => {
  const router = useRouter();

  const { isLoading, isAuthenticated } = useCurrentUser();

  const target = match({ require, isLoading, isAuthenticated })
    .with({ isLoading: true }, () => null)
    .with({ require: 'auth', isAuthenticated: false }, () => redirectTo ?? ROUTES.auth)
    .with({ require: 'guest', isAuthenticated: true }, () => redirectTo ?? ROUTES.lobby)
    .otherwise(() => null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: redirect must fire only on target change; router is a stable ref
  useEffect(() => {
    if (target) router.replace(target);
  }, [target]);

  return { isReady: !isLoading && !target };
};
