'use client';

import { useCurrentUser } from '@/entities/auth/user';
import { LanguageSwitcher } from '@/widgets/app/language-switcher';
import { channelsHeaderStyles as s } from './ChannelsHeader.styles';

export const ChannelsHeader = () => {
  const { isAdmin } = useCurrentUser();

  return (
    <div className={s.root}>
      <div className={s.titleGroup}>
        <span className={s.title}>Chatovo</span>
        {isAdmin && <span className={s.adminBadge}>admin</span>}
      </div>

      <LanguageSwitcher />
    </div>
  );
};
