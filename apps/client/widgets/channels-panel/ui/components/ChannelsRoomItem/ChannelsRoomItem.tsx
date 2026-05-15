'use client';

import { Lock, Trash2, Volume2 } from 'lucide-react';

import {
  Avatar,
  AvatarFallback,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/shared/ui';

import type { ChannelsRoomItemProps } from './ChannelsRoomItem.types';

import { channelsRoomItemStyles as s } from './ChannelsRoomItem.styles';

export const ChannelsRoomItem = ({
  room,
  isActive,
  displayName,
  initial,
  isAdmin,
  onClick,
  onDelete,
}: ChannelsRoomItemProps) => (
  <div>
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <button className={s.trigger({ active: isActive })} type="button" onClick={onClick}>
          <span className={s.triggerLabel}>
            <Volume2 className={s.icon({ active: isActive })} />
            {room.name}
            {room.isPrivate ? <Lock className={s.privateIcon} /> : null}
          </span>
          {isActive ? <span className={s.joinedBadge}>joined</span> : null}
        </button>
      </ContextMenuTrigger>
      {isAdmin ? (
        <ContextMenuContent>
          <ContextMenuItem variant="destructive" onSelect={() => onDelete(room)}>
            <Trash2 />
            Delete room
          </ContextMenuItem>
        </ContextMenuContent>
      ) : null}
    </ContextMenu>
    {isActive ? (
      <div className={s.participant}>
        <Avatar className={s.participantAvatar}>
          <AvatarFallback className={s.participantFallback}>{initial}</AvatarFallback>
        </Avatar>
        <span className={s.participantName}>{displayName}</span>
      </div>
    ) : null}
  </div>
);
