'use client';

import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';
import { AppSplash } from '@/shared/ui';
import { useCheckAppUpdate } from '../model/use-check-app-update';
import { UpdateDialog } from './UpdateDialog';
import type { ReactNode } from 'react';

// Holds the app behind the splash while we check for updates, and gates the
// rest of the bootstrap on the user's decision. In a browser context the hook
// resolves to status:'idle' immediately, so children render straight away.
export const UpdateBootstrap = ({ children }: { children: ReactNode }) => {
  const t = useTranslations('update');
  const { install, dismiss, ...info } = useCheckAppUpdate();

  const { status } = info;

  return match(status)
    .with('checking', () => <AppSplash message={t('checking')} />)
    .with('available', 'downloading', 'installing', 'error', () => (
      <>
        <AppSplash message={t('checking')} />
        <UpdateDialog {...info} onDismiss={dismiss} onInstall={install} />
      </>
    ))
    .with('idle', 'unavailable', () => <>{children}</>)
    .exhaustive();
};
