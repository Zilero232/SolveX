'use client';

import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { subscribeAuth, useCurrentUser } from '@/entities/auth/user';
import { AppSplash } from '@/shared/ui';
import type { ReactNode } from 'react';

export const AuthBootstrap = ({ children }: { children: ReactNode }) => {
  const t = useTranslations('splash');
  const { isLoading } = useCurrentUser();

  useEffect(() => {
    return subscribeAuth();
  }, []);

  if (isLoading) return <AppSplash message={t('signingIn')} />;

  return children;
};
