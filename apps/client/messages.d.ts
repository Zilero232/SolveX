import type messages from './shared/i18n/locales/en.json';

// Makes next-intl's `useTranslations` keys type-checked against the English
// dictionary — an unknown key, or a missing one in a translation, is a
// compile error. `en.json` is the source of truth for the message shape.
declare module 'next-intl' {
  // biome-ignore lint/style/useConsistentTypeDefinitions: module augmentation requires an interface
  interface AppConfig {
    Messages: typeof messages;
  }
}
