'use client';

import { Headphones, Lock } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { isEmpty } from 'remeda';
import { UserAvatar, UserName } from '@/entities/auth/user';
import { useRoomParticipants } from '@/entities/room/room';
import { buildRoomHref } from '@/shared/constants';
import { channelsRoomItemStyles as s } from './ChannelsRoomItem.styles';
import type { ChannelsRoomItemProps } from './ChannelsRoomItem.types';

export const ChannelsRoomItem = ({ room }: ChannelsRoomItemProps) => {
  const router = useRouter();
  const params = useSearchParams();

  const activeRoomId = params.get('id');
  const isActive = activeRoomId === room.id;

  const participants = useRoomParticipants(room.id);

  const handleClick = () => {
    return router.push(buildRoomHref(room.id));
  };

  return (
    <div>
      <button className={s.trigger({ active: isActive })} type="button" onClick={handleClick}>
        <span className={s.triggerLabel}>
          {room.name}
          {room.isPrivate && <Lock className={s.privateIcon} />}
        </span>
        {isActive ? (
          <Headphones className={s.joinedIcon} />
        ) : (
          !isEmpty(participants) && (
            <span className={s.count}>
              <span className={s.countDot} />
              {participants.length}
            </span>
          )
        )}
      </button>
      {!isEmpty(participants) && (
        <div className={s.participants}>
          {participants.map((p) => (
            <div key={p.identity} className={s.participant}>
              <UserAvatar
                name={p.name}
                src={p.avatarUrl}
                className={s.participantAvatar}
                fallbackClassName={s.participantFallback}
              />
              <UserName
                name={p.name}
                verified={p.verified}
                profileUrl={p.profileUrl}
                className={s.participantName}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
