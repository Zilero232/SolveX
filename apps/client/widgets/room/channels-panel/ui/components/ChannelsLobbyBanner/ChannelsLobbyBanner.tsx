'use client';

import { AudioLines, Lightbulb } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { CreateRoomDialog } from '@/features/room/create';
import { Button } from '@/shared/ui';
import { RecentRooms } from '../RecentRooms';
import { channelsLobbyBannerStyles as s } from './ChannelsLobbyBanner.styles';

export const ChannelsLobbyBanner = () => {
  const t = useTranslations('channels.banner');

  return (
    <div className={s.root}>
      <div className={s.card}>
        <div className={s.iconBox}>
          <AudioLines className={s.icon} />
        </div>

        <div className={s.text}>
          <p className={s.title}>{t('title')}</p>
          <p className={s.hint}>{t('hint')}</p>
        </div>

        <CreateRoomDialog
          trigger={
            <Button className={s.cta} type="button">
              {t('createRoom')}
            </Button>
          }
        />
      </div>

      <RecentRooms />

      <div className={s.tip}>
        <Lightbulb className={s.tipIcon} />
        <span>{t('tip')}</span>
      </div>
    </div>
  );
};
