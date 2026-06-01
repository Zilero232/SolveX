'use client';

import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { queryClient, updateUserProfile } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const profileSchema = z.object({
  displayName: z.string().trim().min(2, 'validation.nameMin').max(32, 'validation.nameMax'),
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
    mutationFn: async ({
      displayName,
      profileUrl,
      bannerColor,
      bio,
      avatar,
    }: UpdateProfileInput) => {
      const profile = await updateUserProfile({
        displayName,
        profileUrl,
        bannerColor,
        bio,
        avatar,
      });

      queryClient.setQueryData(QUERY_KEYS.userProfile(profile.id), profile);

      return profile;
    },
  });
};
