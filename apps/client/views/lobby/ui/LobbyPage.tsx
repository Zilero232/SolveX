'use client';

import { useCurrentUser } from '@/entities/user';
import { CreateRoomForm } from '@/features/create-room';
import { ScrollArea } from '@/shared/ui/scroll-area';

import { LobbyCard } from './components/LobbyCard';
import { lobbyPageStyles as s } from './LobbyPage.styles';

export const LobbyPage = () => {
  const { isAdmin } = useCurrentUser();

  return (
    <ScrollArea className={s.root}>
      <div className={s.container}>
        <div className={s.header}>
          <h2 className={s.title}>Lobby</h2>
          <p className={s.subtitle}>
            Pick a voice room on the left
            {isAdmin ? ' or create a new one below' : ' — ask admin to create one'}
          </p>
        </div>

        {isAdmin ? (
          <div className={s.grid}>
            <LobbyCard description="Creates a new voice room" title="Create a room">
              <CreateRoomForm />
            </LobbyCard>
          </div>
        ) : null}
      </div>
    </ScrollArea>
  );
};
