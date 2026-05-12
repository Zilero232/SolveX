'use client';

import { Avatar, AvatarFallback } from '@/shared/ui/avatar';

import { channelsFooterStyles as s } from './ChannelsFooter.styles';
import type { ChannelsFooterProps } from './ChannelsFooter.types';

export const ChannelsFooter = ({ displayName, initial }: ChannelsFooterProps) => (
  <div className={s.root}>
    <Avatar className={s.avatar}>
      <AvatarFallback className={s.fallback}>{initial}</AvatarFallback>
    </Avatar>
    <div className={s.info}>
      <span className={s.name}>{displayName}</span>
      <span className={s.status}>online</span>
    </div>
  </div>
);
