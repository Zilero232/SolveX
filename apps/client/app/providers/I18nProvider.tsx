'use client';

import { NextIntlClientProvider } from 'next-intl';
import { useLocale } from '@/entities/locale';
import en from '@/shared/i18n/locales/en.json';
import ru from '@/shared/i18n/locales/ru.json';
import { AppSplash } from '@/shared/ui';
import type { ReactNode } from 'react';
import type { Locale } from '@/shared/i18n';

// Both dictionaries are bundled — they are small, and a static SPA build
// (output: 'export') has no server to lazy-load them from anyway.
const MESSAGES: Record<Locale, typeof en> = { en, ru };

// Bridges the persisted UI language and next-intl. The locale lives in a
// localStorage entry (see useLocale), unreadable during the static pre-render —
// so the app tree is withheld behind AppSplash until the language is known,
// then rendered once in the correct locale. Switching language afterwards
// re-renders everything instantly, without a reload or a route change.
export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const { locale, isReady } = useLocale();

  if (!isReady) return <AppSplash />;

  return (
    <NextIntlClientProvider locale={locale} messages={MESSAGES[locale]}>
      {children}
    </NextIntlClientProvider>
  );
};
