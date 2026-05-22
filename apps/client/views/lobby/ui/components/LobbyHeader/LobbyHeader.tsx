'use client';

import { useTime } from '@siberiacancode/reactuse';
import { format } from 'date-fns';
import { useTranslations } from 'next-intl';
import { useDateLocale } from '@/entities/locale';
import { useCurrentUser } from '@/entities/user';
import { lobbyHeaderStyles as s } from './LobbyHeader.styles';

export const LobbyHeader = () => {
  const t = useTranslations('lobby');
  const dateLocale = useDateLocale();

  const { displayName } = useCurrentUser();

  // Live clock — useTime re-renders every second; timestamp drives the format.
  const { timestamp } = useTime();
  const now = new Date(timestamp);

  return (
    <div className={s.root}>
      <div className={s.text}>
        <h2 className={s.title}>{t('welcome', { name: displayName })}</h2>
        <p className={s.subtitle}>{t('subtitle')}</p>
      </div>

      <div className={s.clock}>
        <span className={s.time}>{format(now, 'HH:mm')}</span>
        <span className={s.date}>{format(now, 'EEEE, d MMM', { locale: dateLocale })}</span>
      </div>
    </div>
  );
};
