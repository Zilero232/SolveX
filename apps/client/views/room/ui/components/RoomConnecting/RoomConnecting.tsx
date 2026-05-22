'use client';

import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { roomConnectingStyles as s } from './RoomConnecting.styles';
import type { RoomConnectingProps } from './RoomConnecting.types';

export const RoomConnecting = ({ displayName }: RoomConnectingProps) => {
  const t = useTranslations('room');

  return (
    <div className={s.root}>
      <div className={s.box}>
        <Loader2 className={s.icon} />
        <p className={s.text}>{t('connecting', { name: displayName })}</p>
      </div>
    </div>
  );
};
