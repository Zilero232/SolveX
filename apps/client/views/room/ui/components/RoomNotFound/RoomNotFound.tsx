'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ROUTES } from '@/shared/constants';
import { Button } from '@/shared/ui';
import { roomNotFoundStyles as s } from './RoomNotFound.styles';

export const RoomNotFound = () => {
  const t = useTranslations('room');
  const router = useRouter();

  return (
    <div className={s.root}>
      <div className={s.box}>
        <p className={s.text}>{t('notFound')}</p>
        <Button onClick={() => router.replace(ROUTES.lobby)}>{t('backToLobby')}</Button>
      </div>
    </div>
  );
};
