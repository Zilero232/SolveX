'use client';

import { useState } from 'react';

type AvatarValue = File | null | undefined;

export const useAvatarDraft = (storedUrl: string | null) => {
  const [value, setValue] = useState<AvatarValue>(undefined);
  const [preview, setPreview] = useState<string | null>(null);

  const changed = value !== undefined;
  const shownSrc = changed ? preview : storedUrl;

  const clearPreview = () => {
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);

      return null;
    });
  };

  const pick = (file: File) => {
    clearPreview();
    setValue(file);
    setPreview(URL.createObjectURL(file));
  };

  const remove = () => {
    clearPreview();
    setValue(null);
  };

  const reset = () => {
    clearPreview();
    setValue(undefined);
  };

  return { value, changed, shownSrc, pick, remove, reset };
};
