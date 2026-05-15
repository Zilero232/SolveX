'use client';

import { CreateRoomForm } from '@/features/create-room';
import { ScrollArea } from '@/shared/ui';

import { LobbyCard } from './components/LobbyCard';
import { lobbyPageStyles as s } from './LobbyPage.styles';

export const LobbyPage = () => (
  <ScrollArea className={s.root}>
    <div className={s.container}>
      <div className={s.header}>
        <h2 className={s.title}>Lobby</h2>
        <p className={s.subtitle}>Pick a voice room on the left or create a new one below</p>
      </div>

      <div className={s.grid}>
        <LobbyCard description="Creates a new voice room" title="Create a room">
          <CreateRoomForm />
        </LobbyCard>
      </div>
    </div>
  </ScrollArea>
);
