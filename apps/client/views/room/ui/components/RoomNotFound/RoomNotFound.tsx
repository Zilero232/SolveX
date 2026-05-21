'use client';

import { useRouter } from 'next/navigation';
import { ROUTES } from '@/shared/constants';
import { Button } from '@/shared/ui';
import { roomNotFoundStyles as s } from './RoomNotFound.styles';

export const RoomNotFound = () => {
  const router = useRouter();

  return (
    <div className={s.root}>
      <div className={s.box}>
        <p className={s.text}>Room not found</p>
        <Button onClick={() => router.replace(ROUTES.lobby)}>Back to lobby</Button>
      </div>
    </div>
  );
};
