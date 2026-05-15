'use client';

import type { ChannelsHeaderProps } from './ChannelsHeader.types';

import { channelsHeaderStyles as s } from './ChannelsHeader.styles';

export const ChannelsHeader = ({ isAdmin }: ChannelsHeaderProps) => (
  <div className={s.root}>
    <span className={s.title}>SolveX</span>
    {isAdmin ? <span className={s.adminBadge}>admin</span> : null}
  </div>
);
