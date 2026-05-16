'use client';

import { toast } from 'sonner';
import { match } from 'ts-pattern';

import { VoiceRoom } from '@/widgets/voice-room';

import { useRoomState } from '../model/use-room-state';
import { RoomConnecting, RoomLoadingFallback, RoomNotFound, RoomPasswordForm } from './components';

const styles = {
  root: 'h-full p-4',
  frame: 'flex h-full flex-col overflow-hidden rounded-lg border',
} as const;

export const RoomPage = () => {
  const state = useRoomState();

  return match(state)
    .with({ kind: 'no-id' }, () => null)
    .with({ kind: 'loading' }, () => <RoomLoadingFallback />)
    .with({ kind: 'not-found' }, () => <RoomNotFound />)
    .with({ kind: 'password' }, ({ displayName, error, isSubmitting, onSubmit }) => (
      <RoomPasswordForm
        displayName={displayName}
        error={error}
        isSubmitting={isSubmitting}
        onSubmit={onSubmit}
      />
    ))
    .with({ kind: 'connecting' }, ({ displayName }) => <RoomConnecting displayName={displayName} />)
    .with(
      { kind: 'active' },
      ({ choices, displayName, onConnectFailure, onLeave, roomId, token, url }) => (
        <div className={styles.root}>
          <div className={styles.frame}>
            <VoiceRoom
              key={roomId}
              roomName={displayName}
              serverUrl={url}
              token={token}
              userChoices={choices}
              onConnectFailure={(reason) => {
                toast.error('Failed to join room', { description: `LiveKit: ${reason}` });
                onConnectFailure();
              }}
              onLeave={onLeave}
            />
          </div>
        </div>
      ),
    )
    .exhaustive();
};
