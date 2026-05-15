'use client';

import type { LocalUserChoices } from '@livekit/components-core';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { useRooms, useRoomToken } from '@/entities/room';
import { useCurrentUser } from '@/entities/user';
import { ROUTES } from '@/shared/constants';
import { Button, Input, Label } from '@/shared/ui';
import { VoiceRoom } from '@/widgets/voice-room';

import { roomPageStyles as s } from './RoomPage.styles';

const passwordSchema = z.object({
  password: z.string().trim().min(1, 'Password required'),
});

type PasswordValues = z.infer<typeof passwordSchema>;

export const RoomPage = () => {
  const router = useRouter();
  const params = useSearchParams();

  const { session } = useCurrentUser();

  const rooms = useRooms();
  const tokenMutation = useRoomToken();

  const {
    formState: { errors },
    handleSubmit,
    register,
    setError,
  } = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '' },
  });

  const roomId = params.get('id');
  const room = rooms.data?.find((r) => r.id === roomId);
  const displayName = room?.name ?? roomId ?? '';

  const choices: LocalUserChoices = {
    username: session?.user.email ?? 'guest',
    audioEnabled: true,
    videoEnabled: false,
    audioDeviceId: '',
    videoDeviceId: '',
  };

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

  if (!roomId) return null;

  if (!room && rooms.isLoading) {
    return (
      <div className={s.loaderRoot}>
        <div className={s.loaderBox}>
          <Loader2 className={s.loaderIcon} />
          <p className={s.loaderText}>Loading room...</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className={s.loaderRoot}>
        <div className={s.loaderBox}>
          <p className={s.loaderText}>Room not found</p>
          <Button onClick={() => router.replace(ROUTES.lobby)}>Back to lobby</Button>
        </div>
      </div>
    );
  }

  if (room.isPrivate && !tokenMutation.data) {
    const onSubmit = handleSubmit(({ password }) => {
      tokenMutation.mutate(
        { roomId, password },
        {
          onError: (err) => setError('password', { message: err.message }),
        },
      );
    });

    return (
      <div className={s.loaderRoot}>
        <form className={s.loaderBox} onSubmit={onSubmit}>
          <p className={s.loaderText}>Enter password for "{displayName}"</p>
          <div className={s.field}>
            <Label htmlFor="room-password">Password</Label>
            <Input
              disabled={tokenMutation.isPending}
              id="room-password"
              type="password"
              {...register('password')}
            />
            {errors.password ? <p className={s.error}>{errors.password.message}</p> : null}
          </div>
          <Button disabled={tokenMutation.isPending} type="submit">
            {tokenMutation.isPending ? <Loader2 className={s.spinner} /> : null}
            Join
          </Button>
        </form>
      </div>
    );
  }

  if (tokenMutation.isPending || !tokenMutation.data) {
    return (
      <div className={s.loaderRoot}>
        <div className={s.loaderBox}>
          <Loader2 className={s.loaderIcon} />
          <p className={s.loaderText}>Connecting to "{displayName}"...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={s.voiceRoot}>
      <div className={s.voiceFrame}>
        <VoiceRoom
          roomName={displayName}
          serverUrl={tokenMutation.data.url}
          token={tokenMutation.data.token}
          userChoices={choices}
          onConnectFailure={(reason) => {
            toast.error('Failed to join room', { description: `LiveKit: ${reason}` });
            tokenMutation.reset();
            router.replace(ROUTES.lobby);
          }}
          onLeave={() => router.replace(ROUTES.lobby)}
        />
      </div>
    </div>
  );
};
