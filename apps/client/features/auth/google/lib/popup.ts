import { supabase } from '@/shared/api';
import { POPUP_HEIGHT, POPUP_POLL_MS, POPUP_TIMEOUT_MS, POPUP_WIDTH } from './config';
import { GoogleSignInCancelled } from './errors';

const buildCenteredFeatures = (width: number, height: number): string => {
  const screenLeft = window.screenLeft ?? window.screenX ?? 0;
  const screenTop = window.screenTop ?? window.screenY ?? 0;
  const viewportWidth = window.outerWidth ?? window.innerWidth;
  const viewportHeight = window.outerHeight ?? window.innerHeight;

  const left = Math.round(screenLeft + (viewportWidth - width) / 2);
  const top = Math.round(screenTop + (viewportHeight - height) / 2);

  return `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no`;
};

export const openPopup = (): Window => {
  const features = buildCenteredFeatures(POPUP_WIDTH, POPUP_HEIGHT);
  const popup = window.open('about:blank', 'oauth-google', features);

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
