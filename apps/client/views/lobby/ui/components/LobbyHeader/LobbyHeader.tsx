'use client';

import { Radio, Sparkles, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCurrentUser } from '@/entities/auth/user';
import { useLobbyOnline, useRooms, useRoomsPresence } from '@/entities/room/room';
import { env } from '@/shared/config';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui';
import { lobbyHeaderStyles as s } from './LobbyHeader.styles';

export const LobbyHeader = () => {
  const t = useTranslations('lobby');
  const tStats = useTranslations('lobby.stats');

  const { displayName } = useCurrentUser();
  const { rooms } = useRooms();
  const presence = useRoomsPresence();
  const lobbyOnline = useLobbyOnline();

  const liveRooms = rooms.filter((room) => (presence[room.id]?.length ?? 0) > 0).length;

  return (
    <div className={s.root}>
      <div aria-hidden className={s.glow} />
      <div aria-hidden className={s.glowAlt} />

      <div className={s.inner}>
        <div className={s.topRow}>
          <div className={s.text}>
            <h2 className={s.title}>{t('welcome', { name: displayName })}</h2>
            <p className={s.subtitle}>{t('subtitle')}</p>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <button className={s.versionPill} type="button">
                <Sparkles className={s.versionIcon} />
                <span className={s.versionText}>v{env.NEXT_PUBLIC_APP_VERSION}</span>
              </button>
            </TooltipTrigger>
            <TooltipContent>{t('appVersion')}</TooltipContent>
          </Tooltip>
        </div>

        <div className={s.stats}>
          <div className={s.stat}>
            <Users className={s.statIconMuted} />
            <span className={s.statValue}>{rooms.length}</span>
            <span className={s.statLabel}>{tStats('rooms')}</span>
          </div>

          <span aria-hidden className={s.statDivider} />

          <div className={s.stat}>
            <Radio className={liveRooms > 0 ? s.statIconLive : s.statIconMuted} />
            <span className={s.statValue}>{liveRooms}</span>
            <span className={s.statLabel}>{tStats('live')}</span>
          </div>

          <span aria-hidden className={s.statDivider} />

          <div className={s.stat}>
            <span className={s.statPulse} />
            <span className={s.statValue}>{lobbyOnline}</span>
            <span className={s.statLabel}>{tStats('online')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
