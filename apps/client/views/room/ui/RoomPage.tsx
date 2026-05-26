'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { isNonNullish } from 'remeda';
import { toast } from 'sonner';
import { match, P } from 'ts-pattern';
import { useRoomById, useRoomToken } from '@/entities/room/room';
import { env } from '@/shared/config';
import { ROUTES } from '@/shared/constants';
import { VoiceRoom } from '@/widgets/room/voice-room';
import { RoomConnecting, RoomLoadingFallback, RoomNotFound, RoomPasswordForm } from './components';

export const RoomPage = () => {
  const router = useRouter();
  const params = useSearchParams();
  const t = useTranslations('room');

  const roomId = params.get('id');

  const { room, isLoading, displayName, isPrivate } = useRoomById(roomId);

  // Wait for room data before isPrivate is meaningful — otherwise a private
  // room reads as public for one render and useRoomToken fires unauthenticated.
  const roomReady = isNonNullish(room);

  // data dep: password feeds useRoomToken below
  const [password, setPassword] = useState<string>();

  const {
    data: token,
    isError: tokenFailed,
    isFetching: tokenFetching,
    error: tokenError,
    refetch: refetchToken,
  } = useRoomToken(roomReady ? roomId : null, { isPrivate, password });

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
        error={tokenFailed ? (tokenError?.message ?? t('password.wrong')) : undefined}
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
          toast.error(t('joinFailed'), { description: `LiveKit: ${reason}` });

          setPassword(undefined);
          router.replace(ROUTES.lobby);
        }}
        onLeave={() => router.replace(ROUTES.lobby)}
      />
    ))
    .exhaustive();
};
