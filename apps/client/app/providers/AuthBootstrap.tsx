'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useCurrentUser } from '@/entities/auth/user';
import { queryClient, supabase } from '@/shared/api';
import { QUERY_KEYS, ROUTES } from '@/shared/constants';
import { AppSplash } from '@/shared/ui';
import type { ReactNode } from 'react';

export const AuthBootstrap = ({ children }: { children: ReactNode }) => {
  const t = useTranslations('splash');
  const router = useRouter();

  const { isLoading } = useCurrentUser();

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION') return;

      queryClient.setQueryData(QUERY_KEYS.session(), session);

      if (event === 'SIGNED_OUT') {
        queryClient.clear();

        router.replace(ROUTES.auth);
      }
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, [router]);

  if (isLoading) return <AppSplash message={t('signingIn')} />;

  return children;
};
