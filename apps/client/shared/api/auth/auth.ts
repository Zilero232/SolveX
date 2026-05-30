import { supabase } from '../supabase';

const SKEW_SEC = 30;

export const getFreshAccessToken = async (): Promise<string> => {
  const { data, error } = await supabase.auth.getSession();

  if (error) throw error;

  const session = data.session;

  if (!session) throw new Error('Not authenticated');

  const expiresAt = session.expires_at ?? 0;
  const nowSec = Math.floor(Date.now() / 1000);

  if (expiresAt - SKEW_SEC > nowSec) return session.access_token;

  const refreshed = await supabase.auth.refreshSession(session);

  if (refreshed.error) throw refreshed.error;

  if (!refreshed.data.session) throw new Error('Session refresh failed');

  return refreshed.data.session.access_token;
};
