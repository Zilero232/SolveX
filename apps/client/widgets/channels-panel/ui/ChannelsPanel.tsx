'use client';

import { usePathname } from 'next/navigation';
import { ROUTES } from '@/shared/constants';
import { channelsPanelStyles as s } from './ChannelsPanel.styles';
import { ChannelsFooter, ChannelsHeader, ChannelsList, ChannelsLobbyBanner } from './components';

export const ChannelsPanel = () => {
  // On the lobby the rooms are already laid out on the page, so the panel's
  // list slot becomes a create-room banner instead of a duplicate list.
  const isLobby = usePathname() === ROUTES.lobby;

  return (
    <div className={s.root}>
      <ChannelsHeader />
      {isLobby ? <ChannelsLobbyBanner /> : <ChannelsList />}
      <ChannelsFooter />
    </div>
  );
};
