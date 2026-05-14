'use client';

import type { LocalUserChoices } from '@livekit/components-core';

import { PreJoin } from '@livekit/components-react';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { clearRoomTokenCache, useRoomToken } from '@/entities/room';
import { useCurrentUser } from '@/entities/user';
import { QUERY_KEYS, ROUTES } from '@/shared/constants';
import { VoiceRoom } from '@/widgets/voice-room';

import { roomPageStyles as s } from './RoomPage.styles';

export const RoomPage = () => {
  const router = useRouter();
  const params = useSearchParams();

  const { session } = useCurrentUser();

  const name = params.get('name');

  const queryClient = useQueryClient();
  const query = useRoomToken({ roomName: name });

  const [choices, setChoices] = useState<LocalUserChoices | null>(null);

  useEffect(() => {
    if (!name) {
      router.replace(ROUTES.lobby);

      return;
    }

    if (query.error) {
      toast.error('Room error', { description: query.error.message });
      clearRoomTokenCache(name);
      router.replace(ROUTES.lobby);
    }
  }, [name, query.error, router]);

  if (!name) return null;

  if (query.isLoading || !query.data) {
    return (
      <div className={s.loaderRoot}>
        <div className={s.loaderBox}>
          <Loader2 className={s.loaderIcon} />
          <p className={s.loaderText}>Connecting to "{name}"...</p>
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
          roomName={name}
          serverUrl={query.data.url}
          token={query.data.token}
          userChoices={choices}
          onConnectFailure={(reason) => {
            toast.error('Failed to join room', { description: `LiveKit: ${reason}` });
            clearRoomTokenCache(name);
            queryClient.removeQueries({ queryKey: QUERY_KEYS.livekitToken(name) });
            router.replace(ROUTES.lobby);
          }}
          onLeave={() => router.replace(ROUTES.lobby)}
        />
      </div>
    </div>
  );
};
