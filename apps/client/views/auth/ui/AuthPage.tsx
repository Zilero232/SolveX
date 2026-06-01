'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { useTranslations } from 'next-intl';
import { useAuthGuard } from '@/entities/auth/user';
import { GoogleAuthButton, useOttReturn } from '@/features/auth/google';
import { SignInForm } from '@/features/auth/sign-in';
import { SignUpForm } from '@/features/auth/sign-up';
import { authPageStyles as s } from './AuthPage.styles';

export const AuthPage = () => {
  const t = useTranslations('auth');
  const tCommon = useTranslations('common');

  const { isReady } = useAuthGuard({ require: 'guest' });

  const [isSignup, toggleSignup] = useBoolean(false);

  useOttReturn();

  if (!isReady) return null;

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

        <GoogleAuthButton />

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
