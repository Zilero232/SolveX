'use client';

import { Crown, Headphones, Lock } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { isEmpty } from 'remeda';
import { UserAvatar, UserName, useCurrentUser } from '@/entities/auth/user';
import {
  DeafenedBadge,
  MicMutedBadge,
  OwnerCrown,
  useRoomParticipants,
} from '@/entities/room/room';
import { ManageRoomMenu } from '@/features/room/manage';
import { ProfileCardTrigger } from '@/features/room/profile-card';
import { buildRoomHref } from '@/shared/constants';
import { AvatarWithBadges } from '@/shared/ui';
import { channelsRoomItemStyles as s } from './ChannelsRoomItem.styles';
import type { ChannelsRoomItemProps } from './ChannelsRoomItem.types';

export const ChannelsRoomItem = ({ room, onNavigate }: ChannelsRoomItemProps) => {
  const router = useRouter();
  const params = useSearchParams();

  const { user } = useCurrentUser();

  const activeRoomId = params.get('id');
  const isActive = activeRoomId === room.id;
  const isOwner = user?.id === room.ownerId;

  const participants = useRoomParticipants(room.id);

  const handleClick = () => {
    router.push(buildRoomHref(room.id));
    onNavigate?.();
  };

  return (
    <div>
      <div className={s.row}>
        <button
          className={s.trigger({ active: isActive, owner: isOwner })}
          type="button"
          onClick={handleClick}
        >
          <span className={s.triggerLabel}>
            {room.name}
            {room.isPrivate && <Lock className={s.privateIcon} />}
            {isOwner && <Crown className={s.ownerIcon} />}
          </span>
          {isActive && <Headphones className={s.joinedIcon} />}
        </button>
        <ManageRoomMenu className={s.manageSlot} room={room} />
      </div>
      {!isEmpty(participants) && (
        <div className={s.participants}>
          {participants.map((p) => (
            <ProfileCardTrigger key={p.identity} identity={p.identity} name={p.name}>
              <button className={s.participant} type="button">
                <AvatarWithBadges
                  topLeft={p.identity === room.ownerId ? <OwnerCrown /> : null}
                  bottomRight={p.micMuted ? <MicMutedBadge /> : null}
                  bottomLeft={p.deafened ? <DeafenedBadge /> : null}
                >
                  <UserAvatar
                    name={p.name}
                    src={p.avatarUrl}
                    className={s.participantAvatar}
                    fallbackClassName={s.participantFallback}
                  />
                </AvatarWithBadges>
                <UserName name={p.name} verified={p.verified} className={s.participantName} />
              </button>
            </ProfileCardTrigger>
          ))}
        </div>
      )}
    </div>
  );
};
