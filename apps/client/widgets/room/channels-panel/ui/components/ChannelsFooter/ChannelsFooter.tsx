'use client';

import { UserAvatar, UserName, useCurrentUser } from '@/entities/auth/user';
import { AppSettingsButton } from '@/widgets/app/app-settings';
import { channelsFooterStyles as s } from './ChannelsFooter.styles';

export const ChannelsFooter = () => {
  const { avatarUrl, displayName, verified } = useCurrentUser();

  return (
    <div className={s.root}>
      <UserAvatar
        name={displayName}
        src={avatarUrl}
        className={s.avatar}
        fallbackClassName={s.fallback}
      />
      <div className={s.info}>
        <UserName name={displayName} verified={verified} className={s.name} />
        <span className={s.status}>online</span>
      </div>

      <AppSettingsButton />
    </div>
  );
};
