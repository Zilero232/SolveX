'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAuthStore } from '@/entities/user';
import { AuthByEmailForm } from '@/features/auth-by-email';
import { ROUTES } from '@/shared/constants';

import { authPageStyles as s } from './AuthPage.styles';

export const AuthPage = () => {
  const router = useRouter();

  const session = useAuthStore((s) => s.session);

  useEffect(() => {
    if (session) router.replace(ROUTES.lobby);
  }, [session, router]);

  return (
    <div className={s.root}>
      <div className={s.card}>
        <div className={s.header}>
          <h1 className={s.title}>SolveX</h1>
          <p className={s.subtitle}>Sign in to join voice rooms</p>
        </div>
        <AuthByEmailForm />
      </div>
    </div>
  );
};
