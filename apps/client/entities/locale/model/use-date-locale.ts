'use client';

import { enGB, ru } from 'date-fns/locale';
import { useLocale } from './use-locale';
import type { Locale as DateFnsLocale } from 'date-fns';
import type { Locale as AppLocale } from '@/shared/i18n';

// Maps the app's UI locale to a date-fns locale object, so date-fns `format`
// renders month/weekday names in the active language.
const DATE_FNS_LOCALES: Record<AppLocale, DateFnsLocale> = {
  en: enGB,
  ru,
};

// Returns the date-fns locale matching the current UI language. Pass it as the
// `locale` option to date-fns `format` / `formatDistance` etc.
export const useDateLocale = (): DateFnsLocale => {
  const { locale } = useLocale();

  return DATE_FNS_LOCALES[locale];
};
