'use client';

import { channelsHeaderStyles as s } from './ChannelsHeader.styles';
import type { ChannelsHeaderProps } from './ChannelsHeader.types';

export const ChannelsHeader = ({ isAdmin }: ChannelsHeaderProps) => (
  <div className={s.root}>
    <span className={s.title}>Solvex</span>
    {isAdmin ? <span className={s.adminBadge}>admin</span> : null}
  </div>
);
