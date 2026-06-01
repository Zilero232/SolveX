'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { GoogleAuthButton } from '@/features/auth/google';
import { SignInForm } from '@/features/auth/sign-in';
import { SignUpForm } from '@/features/auth/sign-up';
import { usePointerParallax } from '../lib';
import { authPageStyles as s } from './AuthPage.styles';
import { AuthBrandPanel } from './components';

export const AuthPage = () => {
  const t = useTranslations('auth');
  const tCommon = useTranslations('common');

  const [isSignup, toggleSignup] = useBoolean(false);

  const bgRef = usePointerParallax<HTMLDivElement>();

  return (
    <div className={s.root}>
      <div ref={bgRef} className="auth-bg">
        <div className="auth-grid" />
        <div className="auth-aurora" />
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
      </div>

      <div className={s.shell}>
        <AuthBrandPanel />

        <div className={s.panel}>
          <span className={s.mobileMark}>
            <Sparkles className="size-6" />
          </span>

          <div className={s.header}>
            <h1 className={s.title}>{t(isSignup ? 'signUp' : 'signIn')}</h1>
            <p className={s.subtitle}>{t(isSignup ? 'subtitleSignUp' : 'subtitleSignIn')}</p>
          </div>

          <div key={isSignup ? 'signup' : 'signin'} className={s.form}>
            {isSignup ? <SignUpForm /> : <SignInForm />}
          </div>

          <div className={s.divider}>
            <span className={s.dividerLine} />
            <span className={s.dividerText}>{tCommon('or')}</span>
            <span className={s.dividerLine} />
          </div>

          <GoogleAuthButton />

          <p className={s.toggle}>
            {t(isSignup ? 'hasAccount' : 'noAccount')}{' '}
            <button className={s.toggleButton} type="button" onClick={() => toggleSignup()}>
              {t(isSignup ? 'signIn' : 'signUp')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
