'use client';

import { isTauri } from '@tauri-apps/api/core';
import { onOpenUrl } from '@tauri-apps/plugin-deep-link';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { authClient } from '@/shared/api';
import { exchangeOtt } from '../../lib/exchange-ott';

const readOtt = (url: string): string | null => {
  try {
    return new URL(url).searchParams.get('ott');
  } catch {
    return null;
  }
};

const stripOtt = (): void => {
  const url = new URL(window.location.href);

  url.searchParams.delete('ott');
  window.history.replaceState(null, '', url.toString());
};

export const useOttReturn = () => {
  const consumed = useRef(false);
  const { refetch } = authClient.useSession();

  // biome-ignore lint/correctness/useExhaustiveDependencies: run once on mount; refetch is a stable ref
  useEffect(() => {
    let cancelled = false;

    const complete = async (ott: string) => {
      if (consumed.current) return;

      consumed.current = true;

      try {
        await exchangeOtt(ott);
        await refetch();
      } catch (error) {
        if (!cancelled) toast.error(error instanceof Error ? error.message : 'Sign-in failed');
      }
    };

    const webOtt = readOtt(window.location.href);

    if (webOtt) {
      stripOtt();
      complete(webOtt);

      return;
    }

    if (!isTauri()) return;

    const unlistenPromise = onOpenUrl((urls) => {
      const url = urls.find((u) => u.startsWith('chatovo://auth'));
      const ott = url ? readOtt(url) : null;

      if (ott) complete(ott);
    });

    return () => {
      cancelled = true;

      unlistenPromise.then((unlisten) => unlisten());
    };
  }, []);
};
