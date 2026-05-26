'use client';

import { useTranslations } from 'next-intl';
import type { FieldError } from 'react-hook-form';

// A plain (key: string) => string translator — drops next-intl's literal-key
// typing, which can't be satisfied by a runtime namespace and runtime keys.
type LooseTranslator = (key: string) => string;

// react-hook-form types `error.message` as a plain string, but our zod schemas
// store i18n keys there (see the auth schemas). This bridges the two: given a
// field error, it returns the translated message, or undefined when the field
// is valid. The namespace is the schema's key prefix, e.g. 'auth'.
//
// The keys are known by construction but typed only as strings; a wrong key is
// still caught at runtime as a missing-message error.
export const useFieldError = (namespace: string) => {
  const t = useTranslations() as unknown as LooseTranslator;

  return (error: FieldError | undefined): string | undefined => {
    if (!error?.message) return undefined;

    return t(`${namespace}.${error.message}`);
  };
};
