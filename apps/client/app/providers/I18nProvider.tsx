'use client';

import { NextIntlClientProvider } from 'next-intl';
import { useLocale } from '@/entities/app/locale';
import en from '@/shared/i18n/locales/en.json';
import ru from '@/shared/i18n/locales/ru.json';
import { AppSplash } from '@/shared/ui';
import type { ReactNode } from 'react';
import type { Locale } from '@/shared/i18n';

const MESSAGES: Record<Locale, typeof en> = { en, ru };

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const { locale, isReady } = useLocale();

  if (!isReady) return <AppSplash />;

  return (
    <NextIntlClientProvider locale={locale} messages={MESSAGES[locale]}>
      {children}
    </NextIntlClientProvider>
  );
};
