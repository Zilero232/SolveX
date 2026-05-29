'use client';

import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { queryClient, supabase, updateUserProfile } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';
import type { Session } from '@supabase/supabase-js';

export const profileSchema = z.object({
  name: z.string().trim().min(2, 'validation.nameMin').max(32, 'validation.nameMax'),
  profileUrl: z.union([z.literal(''), z.url('validation.urlInvalid')]),
  bannerColor: z.string().nullable(),
  bio: z.string().max(280, 'validation.bioMax'),
});

export type ProfileValues = z.infer<typeof profileSchema>;

export type UpdateProfileInput = ProfileValues & {
  avatar?: File | null;
};

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: async ({ name, profileUrl, bannerColor, bio, avatar }: UpdateProfileInput) => {
      const profile = await updateUserProfile({ name, profileUrl, bannerColor, bio, avatar });

      const { data } = await supabase.auth.refreshSession();

      if (data.session) {
        queryClient.setQueryData<Session | null>(QUERY_KEYS.session(), data.session);
      }

      queryClient.setQueryData(QUERY_KEYS.userProfile(profile.id), profile);

      return profile;
    },
  });
};
