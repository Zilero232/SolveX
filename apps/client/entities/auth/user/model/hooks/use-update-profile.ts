'use client';

import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { queryClient, supabase } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';
import type { Session } from '@supabase/supabase-js';

// Both fields live in Supabase user_metadata. An empty profileUrl clears the
// link; otherwise it must be a valid URL. Messages are i18n keys (see useFieldError).
export const profileSchema = z.object({
  name: z.string().trim().min(2, 'validation.nameMin').max(32, 'validation.nameMax'),
  profileUrl: z.union([z.literal(''), z.url('validation.urlInvalid')]),
});

export type ProfileValues = z.infer<typeof profileSchema>;

// Updates the signed-in user's display name and profile link in a single
// Supabase call, then patches the cached session so useCurrentUser reflects
// the change at once.
export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: async ({ name, profileUrl }: ProfileValues) => {
      const { data, error } = await supabase.auth.updateUser({
        data: { display_name: name, profile_url: profileUrl.trim() },
      });

      if (error) throw error;

      // updateUser returns the fresh user but not a session — merge the user
      // into the cached session so the new values propagate immediately.
      queryClient.setQueryData<Session | null>(QUERY_KEYS.session(), (current) =>
        current ? { ...current, user: data.user } : current,
      );

      return data.user;
    },
  });
};
