'use client';

import { useCurrentUser } from '@/entities/user';
import { channelsHeaderStyles as s } from './ChannelsHeader.styles';

export const ChannelsHeader = () => {
  const { isAdmin } = useCurrentUser();

  return (
    <div className={s.root}>
      <span className={s.title}>Chatovo</span>
      {isAdmin && <span className={s.adminBadge}>admin</span>}
    </div>
  );
};
