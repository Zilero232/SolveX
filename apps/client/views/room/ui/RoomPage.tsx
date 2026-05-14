'use client';

import type { LocalUserChoices } from '@livekit/components-core';

import { PreJoin } from '@livekit/components-react';
import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { clearRoomTokenCache, useRooms, useRoomToken } from '@/entities/room';
import { useCurrentUser } from '@/entities/user';
import { ROUTES } from '@/shared/constants';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { VoiceRoom } from '@/widgets/voice-room';

import { roomPageStyles as s } from './RoomPage.styles';

export const RoomPage = () => {
  const router = useRouter();
  const params = useSearchParams();

  const { session } = useCurrentUser();

  const rooms = useRooms();
  const tokenMutation = useRoomToken();

  const roomId = params.get('id');
  const room = rooms.data?.find((r) => r.id === roomId);
  const displayName = room?.name ?? roomId ?? '';

  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [choices, setChoices] = useState<LocalUserChoices | null>(null);

  useEffect(() => {
    if (!roomId) {
      router.replace(ROUTES.lobby);

      return;
    }

    if (!room || tokenMutation.data || tokenMutation.isPending) return;

    if (room.isPrivate) return;

    tokenMutation.mutate({ roomId });
  }, [roomId, room, tokenMutation, router]);

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
    const onSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      const trimmed = password.trim();

      if (!trimmed) {
        setPasswordError('Password required');

        return;
      }

      setPasswordError(null);
      tokenMutation.mutate(
        { roomId, password: trimmed },
        { onError: (err) => setPasswordError(err.message) },
      );
    };

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
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
            {passwordError ? <p className={s.error}>{passwordError}</p> : null}
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

  if (!choices) {
    return (
      <div className={s.preJoinRoot}>
        <div className={s.preJoinFrame} data-lk-theme="default">
          <PreJoin
            persistUserChoices
            defaults={{
              username: session?.user.email ?? 'guest',
              audioEnabled: true,
              videoEnabled: false,
            }}
            onSubmit={setChoices}
          />
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
            clearRoomTokenCache(roomId);
            tokenMutation.reset();
            router.replace(ROUTES.lobby);
          }}
          onLeave={() => router.replace(ROUTES.lobby)}
        />
      </div>
    </div>
  );
};
