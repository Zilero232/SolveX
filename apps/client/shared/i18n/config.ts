// Locales the app ships with. The first entry is the default / fallback.
export const LOCALES = ['en', 'ru'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

// Human-readable names for the language picker, keyed by locale.
export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  ru: 'Русский',
};

// Narrows an arbitrary string (e.g. a stale persisted value) to a known Locale,
// falling back to the default — so an unknown code never breaks the app.
export const resolveLocale = (value: string | undefined): Locale =>
  LOCALES.includes(value as Locale) ? (value as Locale) : DEFAULT_LOCALE;
