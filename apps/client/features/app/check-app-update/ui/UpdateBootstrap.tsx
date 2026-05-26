'use client';

import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';
import { AppSplash } from '@/shared/ui';
import { useCheckAppUpdate } from '../model/use-check-app-update';
import { UpdateDialog } from './UpdateDialog';
import type { ReactNode } from 'react';

const isDev = process.env.NODE_ENV === 'development';

export const UpdateBootstrap = ({ children }: { children: ReactNode }) => {
  if (isDev) return <>{children}</>;

  return <UpdateBootstrapInner>{children}</UpdateBootstrapInner>;
};

const UpdateBootstrapInner = ({ children }: { children: ReactNode }) => {
  const t = useTranslations('update');
  const { install, dismiss, ...info } = useCheckAppUpdate();

  const { status, silent, progress } = info;

  if (silent) {
    return match(status)
      .with('checking', () => <AppSplash message={t('checking')} />)
      .with('available', () => <AppSplash message={t('checking')} />)
      .with('downloading', () => (
        <AppSplash message={t('downloading', { percent: progress })} progress={progress} />
      ))
      .with('installing', () => <AppSplash message={t('installing')} progress={100} />)
      .with('error', () => <AppSplash message={t('failed')} />)
      .with('idle', 'unavailable', () => <>{children}</>)
      .exhaustive();
  }

  return match(status)
    .with('checking', () => <AppSplash message={t('checking')} />)
    .with('available', 'downloading', 'installing', 'error', () => (
      <>
        {children}
        <UpdateDialog {...info} onDismiss={dismiss} onInstall={install} />
      </>
    ))
    .with('idle', 'unavailable', () => <>{children}</>)
    .exhaustive();
};
