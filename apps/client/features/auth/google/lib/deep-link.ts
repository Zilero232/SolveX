import { onOpenUrl } from '@tauri-apps/plugin-deep-link';
import { openUrl } from '@tauri-apps/plugin-opener';
import { supabase } from '@/shared/api';
import { GoogleSignInCancelled } from './errors';

const DEEP_LINK_SCHEME = 'chatovo';
const DEEP_LINK_TIMEOUT_MS = 60_000;

const AUTH_CALLBACK_PREFIX = `${DEEP_LINK_SCHEME}://auth/`;

export const DEEP_LINK_CALLBACK = `${DEEP_LINK_SCHEME}://auth/callback`;

export const signInWithGoogleViaDeepLink = async (authorizeUrl: string) => {
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

  await openUrl(authorizeUrl);

  let callbackUrl: string;

  try {
    callbackUrl = await urlPromise;
  } finally {
    clearTimeout(timeout);
    unlisten();
  }

  const { searchParams } = new URL(callbackUrl);

  const error = searchParams.get('error');

  if (error) {
    throw new Error(searchParams.get('error_description') ?? error);
  }

  const code = searchParams.get('code');

  if (!code) {
    throw new Error('OAuth callback did not include an authorization code');
  }

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) throw exchangeError;
};
