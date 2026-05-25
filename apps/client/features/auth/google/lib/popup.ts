import { supabase } from '@/shared/api';
import { POPUP_FEATURES, POPUP_POLL_MS, POPUP_TIMEOUT_MS } from './config';
import { GoogleSignInCancelled } from './errors';

export const openPopup = (): Window => {
  const popup = window.open('about:blank', 'oauth-google', POPUP_FEATURES);

  if (!popup || popup.closed) {
    throw new Error('Popup blocked — allow popups for this site');
  }

  return popup;
};

export const waitForSignIn = (popup: Window) => {
  return new Promise<void>((resolve, reject) => {
    const cleanup = () => {
      clearTimeout(timer);
      clearInterval(poll);
      subscription.unsubscribe();
      popup.close();
    };

    // Subscribe before the popup navigates, so a fast SIGNED_IN can't be missed.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event !== 'SIGNED_IN') return;

      cleanup();
      resolve();
    });

    const timer = setTimeout(() => {
      cleanup();
      reject(new Error('Google sign-in timed out'));
    }, POPUP_TIMEOUT_MS);

    const poll = setInterval(() => {
      if (!popup.closed) return;

      cleanup();
      reject(new GoogleSignInCancelled());
    }, POPUP_POLL_MS);
  });
};
