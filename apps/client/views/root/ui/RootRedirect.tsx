'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useCurrentUser } from '@/entities/user';
import { ROUTES } from '@/shared/constants';

export const RootRedirect = () => {
  const router = useRouter();

  const { session, isLoading } = useCurrentUser();

  // biome-ignore lint/correctness/useExhaustiveDependencies: redirect must fire only on auth-state change; router is a stable ref
  useEffect(() => {
    if (isLoading) return;

    router.replace(session ? ROUTES.lobby : ROUTES.auth);
  }, [isLoading, session]);

  return null;
};
