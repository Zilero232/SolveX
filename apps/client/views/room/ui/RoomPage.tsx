'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { match, P } from 'ts-pattern';
import { useRoomById, useRoomToken } from '@/entities/room';
import { env } from '@/shared/config';
import { ROUTES } from '@/shared/constants';
import { VoiceRoom } from '@/widgets/voice-room';
import { RoomConnecting, RoomLoadingFallback, RoomNotFound, RoomPasswordForm } from './components';

export const RoomPage = () => {
  const router = useRouter();
  const params = useSearchParams();

  const roomId = params.get('id');

  const { room, isLoading, displayName, isPrivate } = useRoomById(roomId);

  // data dep: password feeds useRoomToken below
  const [password, setPassword] = useState<string>();

  const {
    data: token,
    isError: tokenFailed,
    isFetching: tokenFetching,
    error: tokenError,
    refetch: refetchToken,
  } = useRoomToken(roomId, { isPrivate, password });

  // biome-ignore lint/correctness/useExhaustiveDependencies: redirect must fire only on roomId change; router is a stable ref
  useEffect(() => {
    if (!roomId) router.replace(ROUTES.lobby);
  }, [roomId]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: redirect must fire only when a public-room token fetch fails; router is a stable ref
  useEffect(() => {
    if (!isPrivate && tokenFailed) router.replace(ROUTES.lobby);
  }, [isPrivate, tokenFailed]);

  const submitPassword = (value: string) => {
    if (value === password) {
      return refetchToken();
    }

    setPassword(value);
  };

  return match({ roomId, isLoading, room, token })
    .with({ roomId: P.nullish }, () => null)
    .with({ room: P.nullish, isLoading: true }, () => <RoomLoadingFallback />)
    .with({ room: P.nullish }, () => <RoomNotFound />)
    .with({ roomId: P.string, room: { isPrivate: true }, token: P.nullish }, () => (
      <RoomPasswordForm
        displayName={displayName}
        error={tokenFailed ? (tokenError?.message ?? 'Wrong password') : undefined}
        isSubmitting={tokenFetching}
        onSubmit={submitPassword}
      />
    ))
    .with({ token: P.nullish }, () => <RoomConnecting displayName={displayName} />)
    .with({ roomId: P.string, token: P.nonNullable, room: P.nonNullable }, ({ roomId, token }) => (
      <VoiceRoom
        key={roomId}
        roomName={displayName}
        serverUrl={env.NEXT_PUBLIC_LIVEKIT_URL}
        token={token}
        onConnectFailure={(reason) => {
          toast.error('Failed to join room', { description: `LiveKit: ${reason}` });

          setPassword(undefined);
          router.replace(ROUTES.lobby);
        }}
        onLeave={() => router.replace(ROUTES.lobby)}
      />
    ))
    .exhaustive();
};
