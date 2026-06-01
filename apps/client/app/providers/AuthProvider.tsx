'use client';

import { useTranslations } from 'next-intl';
import { useCurrentUser } from '@/entities/auth/user';
import { AppSplash } from '@/shared/ui';
import type { ReactNode } from 'react';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const t = useTranslations('splash');

  const { isLoading } = useCurrentUser();

  if (isLoading) return <AppSplash message={t('signingIn')} />;

  return children;
};
