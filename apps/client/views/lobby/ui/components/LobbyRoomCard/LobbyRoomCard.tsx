'use client';

import { Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useRoomParticipants } from '@/entities/room';
import { buildRoomHref } from '@/shared/constants';
import { getInitials } from '@/shared/lib';
import { Avatar, AvatarFallback } from '@/shared/ui';
import { lobbyRoomCardStyles as s } from './LobbyRoomCard.styles';
import type { LobbyRoomCardProps } from './LobbyRoomCard.types';

// How many participant avatars to render before collapsing into a "+N" chip.
const MAX_AVATARS = 4;

export const LobbyRoomCard = ({ room }: LobbyRoomCardProps) => {
  const t = useTranslations('lobby.card');
  const router = useRouter();
  const participants = useRoomParticipants(room.id);

  const isLive = participants.length > 0;
  const shown = participants.slice(0, MAX_AVATARS);
  const overflow = participants.length - shown.length;

  return (
    <button className={s.root} type="button" onClick={() => router.push(buildRoomHref(room.id))}>
      <div className={s.header}>
        <span className={s.name}>
          {room.name}
          {room.isPrivate && <Lock className={s.privateIcon} />}
        </span>

        {isLive ? (
          <span className={s.liveBadge}>
            <span className={s.liveDot} />
            {t('live')}
          </span>
        ) : (
          <span className={s.idleBadge}>{t('empty')}</span>
        )}
      </div>

      {isLive ? (
        <div className={s.participants}>
          <div className={s.avatars}>
            {shown.map((participant) => (
              <Avatar key={participant.identity} className={s.avatar}>
                <AvatarFallback className={s.avatarFallback}>
                  {getInitials(participant.name)}
                </AvatarFallback>
              </Avatar>
            ))}
            {overflow > 0 && <span className={s.overflow}>+{overflow}</span>}
          </div>
          <span className={s.countLabel}>{t('people', { count: participants.length })}</span>
        </div>
      ) : (
        <span className={s.emptyHint}>{t('emptyHint')}</span>
      )}
    </button>
  );
};
