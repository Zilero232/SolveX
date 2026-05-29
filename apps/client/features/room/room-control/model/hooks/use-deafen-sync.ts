'use client';

import { appBus } from '@/shared/lib';
import { useDeafen } from './use-deafen';

export const useDeafenSync = () => {
  const { isDeafened, toggle, undeafen } = useDeafen();

  appBus.useSubscribe('deafenToggle', () => {
    void toggle();
  });

  appBus.useSubscribe('micActivated', () => {
    if (isDeafened) void undeafen();
  });
};
