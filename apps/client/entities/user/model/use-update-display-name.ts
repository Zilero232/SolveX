'use client';

import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { queryClient, supabase } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';
import type { Session } from '@supabase/supabase-js';

// Same shape as the sign-up name field; messages are i18n keys (see useFieldError).
export const displayNameSchema = z.object({
  name: z.string().trim().min(2, 'validation.nameMin').max(32, 'validation.nameMax'),
});

export type DisplayNameValues = z.infer<typeof displayNameSchema>;

// Updates the signed-in user's display name in Supabase user_metadata, then
// patches the cached session so useCurrentUser reflects the new name at once.
export const useUpdateDisplayName = () =>
  useMutation({
    mutationFn: async ({ name }: DisplayNameValues) => {
      const { data, error } = await supabase.auth.updateUser({
        data: { display_name: name },
      });

      if (error) throw error;

      // updateUser returns the fresh user but not a session — merge the user
      // into the cached session so the new name propagates immediately.
      queryClient.setQueryData<Session | null>(QUERY_KEYS.session(), (current) =>
        current ? { ...current, user: data.user } : current,
      );

      return data.user;
    },
  });
