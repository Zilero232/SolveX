'use client';

import { useLocalStorage } from '@siberiacancode/reactuse';
import { STORAGE_KEYS } from '@/shared/constants';

const MAX_RECENT = 6;

type RecentEntry = {
  id: string;
  visitedAt: number;
};

export const useRecentRooms = () => {
  const { value, set } = useLocalStorage<RecentEntry[]>(STORAGE_KEYS.recentRooms, []);

  const recent = value ?? [];

  const push = (id: string) => {
    const filtered = recent.filter((entry) => entry.id !== id);

    set([{ id, visitedAt: Date.now() }, ...filtered].slice(0, MAX_RECENT));
  };

  const remove = (id: string) => {
    set(recent.filter((entry) => entry.id !== id));
  };

  return { recent, push, remove };
};
