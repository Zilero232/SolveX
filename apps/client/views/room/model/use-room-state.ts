'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { usePublicRoomToken, useRooms, useRoomTokenMutation } from '@/entities/room';
import { ROUTES } from '@/shared/constants';

export type RoomState =
  | {
      kind: 'active';
      displayName: string;
      onConnectFailure: () => void;
      onLeave: () => void;
      roomId: string;
      token: string;
      url: string;
    }
  | { kind: 'connecting'; displayName: string }
  | { kind: 'loading' }
  | { kind: 'no-id' }
  | { kind: 'not-found' }
  | {
      kind: 'password';
      displayName: string;
      error: string | undefined;
      isSubmitting: boolean;
      onSubmit: (password: string) => Promise<void>;
      roomId: string;
    };

export const useRoomState = (): RoomState => {
  const router = useRouter();
  const params = useSearchParams();

  const rooms = useRooms();
  const tokenMutation = useRoomTokenMutation();

  const roomId = params.get('id');
  const room = rooms.data?.find((r) => r.id === roomId);
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

  if (!roomId) return { kind: 'no-id' };

  if (!room && rooms.isLoading) return { kind: 'loading' };

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

  if (!tokenData) {
    return { kind: 'connecting', displayName };
  }

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
};
