'use client';

import { UserAvatar, UserName, useCurrentUser } from '@/entities/auth/user';
import { getBannerStyle } from '../../lib/banner-style';
import { useUserProfile } from '../../model/use-user-profile';
import { AvatarZoom, ProfileVoiceBlock } from './components';
import { profileCardStyles as s } from './ProfileCard.styles';
import type { ProfileCardProps } from './ProfileCard.types';

export const ProfileCard = ({ identity, name }: ProfileCardProps) => {
  const { user } = useCurrentUser();

  const { data: profile, isLoading } = useUserProfile(identity);

  const isSelf = user?.id === identity;
  const displayName = profile?.name ?? name;

  return (
    <div className={s.root}>
      <div className={s.banner} style={getBannerStyle(profile?.bannerColor)} />

      <div className={s.body}>
        <div className={s.avatarWrap}>
          <AvatarZoom name={displayName} src={profile?.avatarUrl ?? null}>
            <UserAvatar
              className={s.avatar}
              colorize
              name={displayName}
              size="lg"
              src={profile?.avatarUrl}
            />
          </AvatarZoom>
        </div>

        <div className={s.identity}>
          <UserName
            className={s.name}
            name={displayName}
            profileUrl={profile?.profileUrl}
            size="md"
            verified={profile?.verified ?? false}
          />
        </div>

        {profile?.bio && <p className={s.bio}>{profile.bio}</p>}

        <ProfileVoiceBlock identity={identity} isSelf={isSelf} isLoading={isLoading} />
      </div>
    </div>
  );
};
