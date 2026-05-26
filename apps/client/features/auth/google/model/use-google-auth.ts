import { useMutation } from '@tanstack/react-query';
import { isTauri } from '@tauri-apps/api/core';
import { supabase } from '@/shared/api';
import { ROUTES } from '@/shared/constants';
import { DEEP_LINK_CALLBACK } from '../lib/config';
import { signInWithGoogleViaDeepLink } from '../lib/deep-link';
import { openPopup, waitForSignIn } from '../lib/popup';

const startOAuth = (redirectTo: string) => {
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo, skipBrowserRedirect: true },
  });
};

const signInViaPopup = async () => {
  const popup = openPopup();

  // Subscribe before the popup navigates — avoids a SIGNED_IN race.
  const signedIn = waitForSignIn(popup);

  const { data, error } = await startOAuth(`${window.location.origin}${ROUTES.auth}`);

  if (error || !data.url) {
    popup.close();
    throw error ?? new Error('Failed to start Google sign-in');
  }

  popup.location.href = data.url;

  return signedIn;
};

const signInViaSystemBrowser = async () => {
  const { data, error } = await startOAuth(DEEP_LINK_CALLBACK);

  if (error || !data.url) {
    throw error ?? new Error('Failed to start Google sign-in');
  }

  return signInWithGoogleViaDeepLink(data.url);
};

export const useGoogleAuth = () => {
  return useMutation({
    mutationFn: () => (isTauri() ? signInViaSystemBrowser() : signInViaPopup()),
  });
};
