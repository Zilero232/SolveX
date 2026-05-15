'use client';

import type { LocalUserChoices } from '@livekit/components-core';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { useRooms, useRoomToken } from '@/entities/room';
import { useCurrentUser } from '@/entities/user';
import { ROUTES } from '@/shared/constants';

export type RoomState =
  | {
    kind: 'active';
    choices: LocalUserChoices;
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

  const { session } = useCurrentUser();

  const rooms = useRooms();
  const tokenMutation = useRoomToken();

  const roomId = params.get('id');
  const room = rooms.data?.find((r) => r.id === roomId);
  const displayName = room?.name ?? roomId ?? '';

  const { reset } = tokenMutation;

  useEffect(() => {
    reset();
  }, [roomId, reset]);

  useEffect(() => {
    if (!roomId) {
      router.replace(ROUTES.lobby);

      return;
    }

    if (
      !room ||
      room.isPrivate ||
      tokenMutation.data ||
      tokenMutation.isPending ||
      tokenMutation.isError
    ) {
      return;
    }

    tokenMutation.mutate({ roomId });
  }, [roomId, room?.id, room?.isPrivate, tokenMutation, router]);

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

  if (tokenMutation.isPending || !tokenMutation.data) {
    return { kind: 'connecting', displayName };
  }

  const choices: LocalUserChoices = {
    username: session?.user.email ?? 'guest',
    audioEnabled: true,
    videoEnabled: false,
    audioDeviceId: '',
    videoDeviceId: '',
  };

  return {
    kind: 'active',
    choices,
    displayName,
    onConnectFailure: () => {
      tokenMutation.reset();
      router.replace(ROUTES.lobby);
    },
    onLeave: () => router.replace(ROUTES.lobby),
    roomId,
    token: tokenMutation.data.token,
    url: tokenMutation.data.url,
  };
};
