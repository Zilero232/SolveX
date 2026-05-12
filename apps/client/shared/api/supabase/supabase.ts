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
      detectSessionInUrl: false,
      storageKey: STORAGE_KEYS.authSession,
    },
  },
);
