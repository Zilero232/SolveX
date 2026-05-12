'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAuthStore } from '@/entities/user';
import { ROUTES } from '@/shared/constants';

export const RootRedirect = () => {
  const router = useRouter();
  const session = useAuthStore((s) => s.session);
  const isLoading = useAuthStore((s) => s.isLoading);

  useEffect(() => {
    if (isLoading) return;

    router.replace(session ? ROUTES.lobby : ROUTES.auth);
  }, [isLoading, session, router]);

  return null;
};
