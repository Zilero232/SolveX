'use client';

import { useStateHistory } from '@siberiacancode/reactuse';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const useNavHistory = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { value, index, history, canUndo, canRedo, set, back, forward } = useStateHistory(pathname);

  // biome-ignore lint/correctness/useExhaustiveDependencies: track pathname only; set is a new ref each render
  useEffect(() => {
    if (pathname !== value) set(pathname);
  }, [pathname, value]);

  const goBack = () => {
    if (!canUndo) return;

    back();

    router.push(history[index - 1]);
  };

  const goForward = () => {
    if (!canRedo) return;

    forward();

    router.push(history[index + 1]);
  };

  return { canGoBack: canUndo, canGoForward: canRedo, goBack, goForward };
};
