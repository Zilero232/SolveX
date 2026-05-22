'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useCurrentUser } from '@/entities/user';
import { SignInForm } from '@/features/sign-in';
import { SignInWithGoogleButton } from '@/features/sign-in-with-google';
import { SignUpForm } from '@/features/sign-up';
import { ROUTES } from '@/shared/constants';
import { authPageStyles as s } from './AuthPage.styles';

export const AuthPage = () => {
  const router = useRouter();
  const t = useTranslations('auth');
  const tCommon = useTranslations('common');

  const { session } = useCurrentUser();
  const [isSignup, toggleSignup] = useBoolean(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: redirect must fire only on session change; router is a stable ref
  useEffect(() => {
    if (session) router.replace(ROUTES.lobby);
  }, [session]);

  return (
    <div className={s.root}>
      <div className={s.card}>
        <div className={s.header}>
          <h1 className={s.title}>{t('appName')}</h1>
          <p className={s.subtitle}>{t(isSignup ? 'subtitleSignUp' : 'subtitleSignIn')}</p>
        </div>

        {isSignup ? <SignUpForm /> : <SignInForm />}

        <div className={s.divider}>
          <span className={s.dividerLine} />
          <span className={s.dividerText}>{tCommon('or')}</span>
          <span className={s.dividerLine} />
        </div>

        <SignInWithGoogleButton />

        <p className={s.toggle}>
          {t(isSignup ? 'hasAccount' : 'noAccount')}{' '}
          <button className={s.toggleButton} onClick={() => toggleSignup()} type="button">
            {t(isSignup ? 'signIn' : 'signUp')}
          </button>
        </p>
      </div>
    </div>
  );
};
