'use client';

import { roomsParticipantsSnapshotSchema, safeJsonParse } from '@chatovo/schemas';
import { useEventSource } from '@siberiacancode/reactuse';
import { useEffect, useState } from 'react';
import { isString } from 'remeda';
import { buildPresenceStreamUrl } from '@/shared/api';
import type { RoomsParticipantsSnapshot } from '@chatovo/schemas';

const EMPTY: RoomsParticipantsSnapshot = { rooms: {}, lobbyOnline: 0 };

export const useRoomsPresenceStream = (enabled: boolean) => {
  const [url, setUrl] = useState<string>();

  useEffect(() => {
    if (!enabled) {
      setUrl(undefined);

      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        const next = await buildPresenceStreamUrl();

        if (!cancelled) setUrl(next);
      } catch {}
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  const { data } = useEventSource<string>(url ?? '', ['snapshot'], {
    immediately: Boolean(url),
    retry: true,
  });

  if (!isString(data)) return EMPTY;

  const parsed = roomsParticipantsSnapshotSchema.safeParse(safeJsonParse(data));

  return parsed.success ? parsed.data : EMPTY;
};
