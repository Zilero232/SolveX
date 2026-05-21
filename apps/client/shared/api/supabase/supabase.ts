import { createClient } from '@supabase/supabase-js';
import { env } from '@/shared/config';
import { STORAGE_KEYS } from '@/shared/constants';

export const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      // Implicit flow: the app ships as a static Tauri bundle with no server,
      // so OAuth must complete fully client-side. The session arrives in the
      // URL hash and is picked up automatically — no PKCE code verifier needed.
      detectSessionInUrl: true,
      flowType: 'implicit',
      storageKey: STORAGE_KEYS.authSession,
    },
  },
);
