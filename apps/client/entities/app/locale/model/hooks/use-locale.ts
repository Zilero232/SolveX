'use client';

import { useLocalStorage, useMount } from '@siberiacancode/reactuse';
import { useState } from 'react';
import { STORAGE_KEYS } from '@/shared/constants';
import { DEFAULT_LOCALE, type Locale, resolveLocale } from '@/shared/i18n';

type UseLocale = {
  locale: Locale;
  isReady: boolean;
  setLocale: (locale: Locale) => void;
};

export const useLocale = (): UseLocale => {
  const { value, set } = useLocalStorage<Locale>(STORAGE_KEYS.locale, DEFAULT_LOCALE);

  const [isReady, setIsReady] = useState(false);

  useMount(() => setIsReady(true));

  return { isReady, locale: resolveLocale(value), setLocale: set };
};
