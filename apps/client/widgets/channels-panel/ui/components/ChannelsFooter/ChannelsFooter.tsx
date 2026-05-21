'use client';

import { useCurrentUser } from '@/entities/user';
import { Avatar, AvatarFallback } from '@/shared/ui';
import { channelsFooterStyles as s } from './ChannelsFooter.styles';

export const ChannelsFooter = () => {
  const { displayName, initial } = useCurrentUser();

  return (
    <div className={s.root}>
      <Avatar className={s.avatar}>
        <AvatarFallback className={s.fallback}>{initial}</AvatarFallback>
      </Avatar>
      <div className={s.info}>
        <span className={s.name}>{displayName}</span>
        <span className={s.status}>online</span>
      </div>
    </div>
  );
};
