'use client';

import { Clock, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { isEmpty } from 'remeda';
import { useRecentRooms, useRooms, useRoomsPresence } from '@/entities/room/room';
import { buildRoomHref } from '@/shared/constants';
import { recentRoomsStyles as s } from './RecentRooms.styles';
import type { RecentRoomsProps } from './RecentRooms.types';

export const RecentRooms = ({ onNavigate }: RecentRoomsProps = {}) => {
  const t = useTranslations('lobby.recent');
  const router = useRouter();

  const { recent } = useRecentRooms();
  const { rooms } = useRooms();
  const presence = useRoomsPresence();

  const entries = recent
    .map((entry) => rooms.find((room) => room.id === entry.id))
    .filter((room) => room !== undefined);

  if (isEmpty(entries)) return null;

  return (
    <div className={s.root}>
      <h4 className={s.heading}>
        <Clock className={s.headingIcon} />
        {t('heading')}
      </h4>

      <div className={s.list}>
        {entries.map((room) => {
          const live = (presence[room.id]?.length ?? 0) > 0;

          return (
            <button
              key={room.id}
              className={s.item}
              type="button"
              onClick={() => {
                router.push(buildRoomHref(room.id));
                onNavigate?.();
              }}
            >
              <span className={live ? s.dotLive : s.dot} />
              <span className={s.name}>{room.name}</span>
              {room.isPrivate && <Lock className={s.lockIcon} />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
