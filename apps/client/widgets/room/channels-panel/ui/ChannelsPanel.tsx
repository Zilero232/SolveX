'use client';

import { usePathname } from 'next/navigation';
import { ROUTES } from '@/shared/constants';
import { channelsPanelStyles as s } from './ChannelsPanel.styles';
import { ChannelsFooter, ChannelsHeader, ChannelsList, ChannelsLobbyBanner } from './components';
import type { ChannelsPanelProps } from './ChannelsPanel.types';

export const ChannelsPanel = ({ variant = 'desktop', onNavigate }: ChannelsPanelProps = {}) => {
  const isLobby = usePathname() === ROUTES.lobby;

  return (
    <div className={s.root({ variant })}>
      <ChannelsHeader compact={variant === 'drawer'} />
      {isLobby ? <ChannelsLobbyBanner /> : <ChannelsList onNavigate={onNavigate} />}
      <ChannelsFooter />
    </div>
  );
};
