'use client';

import { useCurrentUser } from '@/entities/auth/user';
import { LanguageSwitcher } from '@/widgets/app/language-switcher';
import { channelsHeaderStyles as s } from './ChannelsHeader.styles';

type ChannelsHeaderProps = {
  compact?: boolean;
};

export const ChannelsHeader = ({ compact = false }: ChannelsHeaderProps = {}) => {
  const { isAdmin } = useCurrentUser();

  if (compact) {
    if (!isAdmin) return null;

    return (
      <div className={s.root}>
        <span className={s.adminBadge}>admin</span>
      </div>
    );
  }

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
