import { useMutation } from '@tanstack/react-query';
import { isTauri } from '@tauri-apps/api/core';
import { openUrl } from '@tauri-apps/plugin-opener';
import { authClient } from '@/shared/api';
import { ROUTES } from '@/shared/constants';
import { socialCallbackURL } from '../../lib/social-redirect';

export const useGoogleAuth = () => {
  return useMutation({
    mutationFn: async () => {
      const desktop = isTauri();

      const { data, error } = await authClient.signIn.social({
        provider: 'google',
        disableRedirect: desktop,
        callbackURL: socialCallbackURL(),
        errorCallbackURL: `${window.location.origin}${ROUTES.auth}`,
      });

      if (error) throw new Error(error.message ?? 'Google sign-in failed');

      if (desktop && data?.url) await openUrl(data.url);
    },
  });
};
