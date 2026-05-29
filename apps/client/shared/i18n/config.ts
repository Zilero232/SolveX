export const LOCALES = ['en', 'ru'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  ru: 'Русский',
};

export const resolveLocale = (value: string | undefined): Locale => {
  return LOCALES.includes(value as Locale) ? (value as Locale) : DEFAULT_LOCALE;
};
