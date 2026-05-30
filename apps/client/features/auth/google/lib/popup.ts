import { supabase } from '@/shared/api';
import { openCenteredPopup } from '@/shared/lib';

const POPUP_TIMEOUT_MS = 120_000;
const POPUP_POLL_MS = 500;
const POPUP_WIDTH = 480;
const POPUP_HEIGHT = 640;

export const openPopup = (): Window =>
  openCenteredPopup('about:blank', {
    width: POPUP_WIDTH,
    height: POPUP_HEIGHT,
    name: 'oauth-google',
  });

export const waitForSignIn = (popup: Window) => {
  return new Promise<void>((resolve, reject) => {
    const cleanup = () => {
      clearTimeout(timer);
      clearInterval(poll);

      subscription.unsubscribe();
      popup.close();
    };

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
      reject(new Error('Google sign-in was cancelled'));
    }, POPUP_POLL_MS);
  });
};
