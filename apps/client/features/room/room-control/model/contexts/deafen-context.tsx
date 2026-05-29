'use client';

import { createContextHook } from '@siberiacancode/reactuse';
import { useRef, useState } from 'react';
import type { ReactNode } from 'react';

const useDeafenState = () => {
  const [isDeafened, setIsDeafened] = useState(false);

  const micBeforeDeafen = useRef(false);

  return { isDeafened, setIsDeafened, micBeforeDeafen };
};

const { Provider, use } = createContextHook(useDeafenState);

export const DeafenProvider = ({ children }: { children: ReactNode }) => (
  <Provider params={[]}>{children}</Provider>
);

export const useDeafenContext = () => {
  const value = use();

  if (!value) throw new Error('useDeafenContext must be used within DeafenProvider');

  return value;
};
