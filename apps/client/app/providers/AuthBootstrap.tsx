'use client';

import { useEffect } from 'react';
import { subscribeAuth, useCurrentUser } from '@/entities/user';
import { AppSplash } from '@/shared/ui';
import type { ReactNode } from 'react';

// Holds the app behind the splash until the auth session is restored, and
// keeps it subscribed to auth state changes for the session's lifetime.
export const AuthBootstrap = ({ children }: { children: ReactNode }) => {
  const { isLoading } = useCurrentUser();

  useEffect(() => {
    return subscribeAuth();
  }, []);

  if (isLoading) return <AppSplash />;

  return children;
};
