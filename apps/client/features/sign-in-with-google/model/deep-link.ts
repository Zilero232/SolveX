import { onOpenUrl } from '@tauri-apps/plugin-deep-link';
import { openUrl } from '@tauri-apps/plugin-opener';
import { supabase } from '@/shared/api';
import { DEEP_LINK_SCHEME, DEEP_LINK_TIMEOUT_MS } from './config';
import { GoogleSignInCancelled } from './errors';

const AUTH_CALLBACK_PREFIX = `${DEEP_LINK_SCHEME}://auth/`;

const parseTokensFromCallback = (url: string) => {
  const { hash, searchParams } = new URL(url);

  const hashParams = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash);

  const error = hashParams.get('error') ?? searchParams.get('error');

  if (error) {
    const description =
      hashParams.get('error_description') ?? searchParams.get('error_description') ?? error;

    throw new Error(description);
  }

  const accessToken = hashParams.get('access_token');
  const refreshToken = hashParams.get('refresh_token');

  if (!accessToken || !refreshToken) {
    throw new Error('OAuth callback did not include session tokens');
  }

  return { accessToken, refreshToken };
};

const waitForAuthCallback = async (): Promise<string> => {
  let resolveUrl: (url: string) => void;
  let rejectTimeout: (err: Error) => void;

  const urlPromise = new Promise<string>((resolve, reject) => {
    resolveUrl = resolve;
    rejectTimeout = reject;
  });

  const unlisten = await onOpenUrl((urls) => {
    const url = urls.find((u) => u.startsWith(AUTH_CALLBACK_PREFIX));

    if (url) resolveUrl(url);
  });

  const timeout = setTimeout(() => {
    rejectTimeout(new GoogleSignInCancelled());
  }, DEEP_LINK_TIMEOUT_MS);

  try {
    return await urlPromise;
  } finally {
    clearTimeout(timeout);
    unlisten();
  }
};

const applySession = async (callbackUrl: string) => {
  const { accessToken, refreshToken } = parseTokensFromCallback(callbackUrl);

  const { error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (error) throw error;
};

export const signInWithGoogleViaDeepLink = async (authorizeUrl: string) => {
  const callback = waitForAuthCallback();

  await openUrl(authorizeUrl);

  const callbackUrl = await callback;

  await applySession(callbackUrl);
};
