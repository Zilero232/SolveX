'use client';

import { useCurrentUser } from '@/entities/user';
import { CreateRoomForm } from '@/features/create-room';
import { JoinRoomForm } from '@/features/join-room';
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
            Join an existing voice room or{' '}
            {isAdmin ? 'create a new one' : 'ask admin to create one'}
          </p>
        </div>
        <div className={s.grid}>
          <LobbyCard description="Enter an existing room name" title="Join a room">
            <JoinRoomForm />
          </LobbyCard>
          {true ? (
            <LobbyCard
              description="Admin only — creates room on first connect"
              title="Create a room"
            >
              <CreateRoomForm />
            </LobbyCard>
          ) : null}
        </div>
      </div>
    </ScrollArea>
  );
};
