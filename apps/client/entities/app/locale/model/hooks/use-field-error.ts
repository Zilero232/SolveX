'use client';

import { useTranslations } from 'next-intl';
import type { FieldError } from 'react-hook-form';

type LooseTranslator = (key: string) => string;

export const useFieldError = (namespace: string) => {
  const t = useTranslations() as unknown as LooseTranslator;

  return (error: FieldError | undefined): string | undefined => {
    if (!error?.message) return undefined;

    return t(`${namespace}.${error.message}`);
  };
};
