'use client';

import { AudioLines } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { lobbyEmptyStyles as s } from './LobbyEmpty.styles';

// Shown when no rooms exist yet — nudges the user toward the create button.
export const LobbyEmpty = () => {
  const t = useTranslations('lobby.empty');

  return (
    <div className={s.root}>
      <div className={s.iconBox}>
        <AudioLines className={s.icon} />
      </div>
      <p className={s.title}>{t('title')}</p>
      <p className={s.text}>{t('text')}</p>
    </div>
  );
};
