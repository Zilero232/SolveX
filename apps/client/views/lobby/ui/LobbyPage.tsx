'use client';

import { ScrollArea } from '@/shared/ui';
import { LobbyHeader, LobbyRooms } from './components';
import { lobbyPageStyles as s } from './LobbyPage.styles';

export const LobbyPage = () => (
  <ScrollArea className={s.root}>
    <div className={s.container}>
      <LobbyHeader />
      <LobbyRooms />
    </div>
  </ScrollArea>
);
