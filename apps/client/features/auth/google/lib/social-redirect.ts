import { isTauri } from '@tauri-apps/api/core';
import { env } from '@/shared/config';
import { ROUTES } from '@/shared/constants';

const TAURI_AUTH_TARGET = 'chatovo://auth';

const finalTarget = (): string => {
  if (isTauri()) return TAURI_AUTH_TARGET;

  return `${window.location.origin}${ROUTES.auth}`;
};

export const socialCallbackURL = (): string => {
  const apiBase = env.NEXT_PUBLIC_API_URL.replace(/\/$/, '');
  const redirect = encodeURIComponent(finalTarget());

  return `${apiBase}/auth/social-done?redirect=${redirect}`;
};
