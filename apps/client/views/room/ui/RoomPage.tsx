'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { match } from 'ts-pattern';

import { usePublicRoomToken, useRoomById, useRoomTokenMutation } from '@/entities/room';
import { ROUTES } from '@/shared/constants';
import { VoiceRoom } from '@/widgets/voice-room';

import { RoomConnecting, RoomLoadingFallback, RoomNotFound, RoomPasswordForm } from './components';
import type { RoomState } from './RoomPage.types';

export const RoomPage = () => {
  const router = useRouter();
  const params = useSearchParams();

  const tokenMutation = useRoomTokenMutation();

  const roomId = params.get('id');

  // data dep: roomId → roomById
  const roomById = useRoomById(roomId);
  const room = roomById.data;
  const displayName = room?.name ?? roomId ?? '';

  // data dep: roomId, room → publicToken
  const publicToken = usePublicRoomToken(roomId, !!room && !room.isPrivate);

  // biome-ignore lint/correctness/useExhaustiveDependencies: redirect must fire only on roomId change; router is a stable ref
  useEffect(() => {
    if (!roomId) router.replace(ROUTES.lobby);
  }, [roomId]);

  const publicTokenFailed = publicToken.isError;

  // biome-ignore lint/correctness/useExhaustiveDependencies: redirect must fire only when the public-room token fetch fails; router is a stable ref
  useEffect(() => {
    if (publicTokenFailed) router.replace(ROUTES.lobby);
  }, [publicTokenFailed]);

  const state = ((): RoomState => {
    if (!roomId) return { kind: 'no-id' };

    if (roomById.isLoading) return { kind: 'loading' };

    if (!room) return { kind: 'not-found' };

    if (room.isPrivate && !tokenMutation.data) {
      return {
        kind: 'password',
        displayName,
        error: tokenMutation.isError ? tokenMutation.error.message : undefined,
        isSubmitting: tokenMutation.isPending,
        onSubmit: async (password) => {
          await tokenMutation.mutateAsync({ roomId, password });
        },
        roomId,
      };
    }

    const tokenData = room.isPrivate ? tokenMutation.data : publicToken.data;

    if (!tokenData) return { kind: 'connecting', displayName };

    return {
      kind: 'active',
      displayName,
      roomId,
      token: tokenData.token,
      url: tokenData.url,
      onConnectFailure: () => {
        if (room.isPrivate) tokenMutation.reset();

        router.replace(ROUTES.lobby);
      },
      onLeave: () => router.replace(ROUTES.lobby),
    };
  })();

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
    .with({ kind: 'active' }, ({ displayName, onConnectFailure, onLeave, roomId, token, url }) => (
      <VoiceRoom
        key={roomId}
        roomName={displayName}
        serverUrl={url}
        token={token}
        onConnectFailure={(reason) => {
          toast.error('Failed to join room', { description: `LiveKit: ${reason}` });
          onConnectFailure();
        }}
        onLeave={onLeave}
      />
    ))
    .exhaustive();
};
