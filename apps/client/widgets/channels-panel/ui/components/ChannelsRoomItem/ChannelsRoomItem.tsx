'use client';

import { Lock, Trash2, Volume2 } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/shared/ui/context-menu';

import { channelsRoomItemStyles as s } from './ChannelsRoomItem.styles';
import type { ChannelsRoomItemProps } from './ChannelsRoomItem.types';

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
        <button type="button" onClick={onClick} className={s.trigger({ active: isActive })}>
          <span className={s.triggerLabel}>
            <Volume2 className={s.icon({ active: isActive })} />
            {room.name}
            {room.is_private ? <Lock className={s.privateIcon} /> : null}
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
