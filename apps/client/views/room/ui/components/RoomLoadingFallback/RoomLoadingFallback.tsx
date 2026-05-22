'use client';

import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { roomLoadingFallbackStyles as s } from './RoomLoadingFallback.styles';

export const RoomLoadingFallback = () => {
  const t = useTranslations('room');

  return (
    <div className={s.root}>
      <div className={s.box}>
        <Loader2 className={s.icon} />
        <p className={s.text}>{t('loading')}</p>
      </div>
    </div>
  );
};
