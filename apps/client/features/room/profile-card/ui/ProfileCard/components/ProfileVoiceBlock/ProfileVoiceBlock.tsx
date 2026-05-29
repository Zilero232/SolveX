'use client';

import { useTranslations } from 'next-intl';
import { isNonNullish } from 'remeda';
import { match, P } from 'ts-pattern';
import { useCurrentUser } from '@/entities/auth/user';
import { useEnterRoom } from '@/entities/room/room';
import { Button, Spinner } from '@/shared/ui';
import { useParticipantRoom } from '../../../../model/use-participant-room';
import { profileVoiceBlockStyles as s } from './ProfileVoiceBlock.styles';
import type { ProfileVoiceBlockProps } from './ProfileVoiceBlock.types';

export const ProfileVoiceBlock = ({ identity, isSelf, isLoading }: ProfileVoiceBlockProps) => {
  const t = useTranslations('profileCard');

  const { user } = useCurrentUser();

  const room = useParticipantRoom(identity);
  const myRoom = useParticipantRoom(user?.id ?? '');
  const { isPending, mutate: enterRoom } = useEnterRoom();

  const inSameRoom = isNonNullish(room) && room.roomId === myRoom?.roomId;

  return (
    <div className={s.root}>
      {match({ isLoading, isSelf, room, inSameRoom })
        .with({ isLoading: true }, () => (
          <span className={s.label}>
            <Spinner size="xs" />
          </span>
        ))
        .with({ isSelf: true }, () => (
          <>
            <span className={s.label}>{room ? t('inVoice') : t('notInVoice')}</span>
            {room && <span className={s.room}>{room.roomName}</span>}
            <span className={s.label}>{t('openSettingsHint')}</span>
          </>
        ))
        .with({ room: P.nullish }, () => <span className={s.label}>{t('notInVoice')}</span>)
        .with({ room: P.nonNullable }, ({ room: current, inSameRoom: same }) => (
          <>
            <span className={s.label}>{t('inVoice')}</span>
            <span className={s.room}>{current.roomName}</span>
            {!same && (
              <Button
                className={s.button}
                disabled={isPending}
                size="sm"
                onClick={() => enterRoom({ roomId: current.roomId })}
              >
                {t('join')}
              </Button>
            )}
          </>
        ))
        .exhaustive()}
    </div>
  );
};
