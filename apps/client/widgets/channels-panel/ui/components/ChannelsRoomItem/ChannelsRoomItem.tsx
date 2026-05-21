'use client';

import { Lock } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { isEmpty } from 'remeda';
import { useRoomParticipants } from '@/entities/room';
import { buildRoomHref } from '@/shared/constants';
import { getInitials } from '@/shared/lib';
import { Avatar, AvatarFallback } from '@/shared/ui';
import { channelsRoomItemStyles as s } from './ChannelsRoomItem.styles';
import type { ChannelsRoomItemProps } from './ChannelsRoomItem.types';

export const ChannelsRoomItem = ({ room }: ChannelsRoomItemProps) => {
  const router = useRouter();
  const params = useSearchParams();

  const activeRoomId = params.get('id');
  const isActive = activeRoomId === room.id;

  const participants = useRoomParticipants(room.id);

  const handleClick = () => router.push(buildRoomHref(room.id));

  return (
    <div>
      <button className={s.trigger({ active: isActive })} type="button" onClick={handleClick}>
        <span className={s.triggerLabel}>
          {room.name}
          {room.isPrivate && <Lock className={s.privateIcon} />}
        </span>
        {isActive ? (
          <span className={s.joinedBadge}>joined</span>
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
              <Avatar className={s.participantAvatar}>
                <AvatarFallback className={s.participantFallback}>
                  {getInitials(p.name)}
                </AvatarFallback>
              </Avatar>
              <span className={s.participantName}>{p.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
