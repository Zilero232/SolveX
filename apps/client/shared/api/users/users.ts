import { api, readErrorMessage } from '../http';
import type { UserProfile } from '@chatovo/schemas';

export const getUserProfile = async (id: string): Promise<UserProfile> => {
  try {
    const res = await api.users[':id'].profile.$get({ param: { id } });

    if (!res.ok) {
      const message = await readErrorMessage(res);

      throw new Error(message ?? `Failed to get user profile: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    if (error instanceof Error) throw error;

    throw new Error('Failed to get user profile');
  }
};

export type UpdateProfilePayload = {
  name: string;
  profileUrl: string;
  bannerColor: string | null;
  bio: string;
  avatar?: File | null;
};

export const updateUserProfile = async (payload: UpdateProfilePayload): Promise<UserProfile> => {
  const res = await api.users.profile.$post({
    form: {
      name: payload.name,
      profileUrl: payload.profileUrl,
      bannerColor: payload.bannerColor ?? '',
      bio: payload.bio,
      ...(payload.avatar instanceof File ? { avatar: payload.avatar } : {}),
      ...(payload.avatar === null ? { removeAvatar: 'true' } : {}),
    },
  });

  if (!res.ok) {
    const message = await readErrorMessage(res);

    throw new Error(message ?? `Failed to update profile: ${res.status}`);
  }

  return await res.json();
};
