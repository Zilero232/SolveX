import { supabaseAdmin } from './supabase';

export type UserRole = 'admin' | 'user';

type VerifiedUser = {
  userId: string;
  email?: string;
  role: UserRole;
};

/** Reads a user's role from their Supabase `app_metadata`, defaulting to `user`. */
export const readRole = (metadata: Record<string, unknown> | undefined): UserRole =>
  metadata?.role === 'admin' ? 'admin' : 'user';

/**
 * Verifies a Supabase access token and returns the user, or `null` if the
 * token is missing or invalid. Shared by the bearer-header middleware and the
 * SSE route (which authorizes via a query param instead).
 */
export const verifyAccessToken = async (
  token: string | undefined,
): Promise<VerifiedUser | null> => {
  if (!token) return null;

  const { data, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !data.user) return null;

  return {
    userId: data.user.id,
    email: data.user.email,
    role: readRole(data.user.app_metadata),
  };
};
