'use client';

import { useMouse } from '@siberiacancode/reactuse';
import { useRef } from 'react';

export const usePointerParallax = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);
  const frameRef = useRef<number | null>(null);

  useMouse<T>(({ clientX, clientY }) => {
    if (frameRef.current !== null) return;

    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;

      const node = ref.current;
      if (!node) return;

      const x = clientX / window.innerWidth - 0.5;
      const y = clientY / window.innerHeight - 0.5;

      node.style.setProperty('--px', x.toFixed(3));
      node.style.setProperty('--py', y.toFixed(3));
    });
  });

  return ref;
};
