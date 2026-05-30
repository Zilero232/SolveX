import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

type NavState = {
  canGoBack: boolean;
  canGoForward: boolean;
};

const computeNavState = (cursor: number, stackLength: number): NavState => {
  return {
    canGoBack: cursor > 0,
    canGoForward: cursor < stackLength - 1,
  };
};

export const useNavHistory = () => {
  const pathname = usePathname();

  const stack = useRef<string[]>([pathname]);
  const cursor = useRef(0);

  const [navState, setNavState] = useState<NavState>({ canGoBack: false, canGoForward: false });

  useEffect(() => {
    const handlePop = () => {
      const path = window.location.pathname;
      const backIdx = stack.current.lastIndexOf(path, cursor.current - 1);
      const forwardIdx = stack.current.indexOf(path, cursor.current + 1);

      if (backIdx !== -1) cursor.current = backIdx;
      else if (forwardIdx !== -1) cursor.current = forwardIdx;

      setNavState(computeNavState(cursor.current, stack.current.length));
    };

    window.addEventListener('popstate', handlePop);

    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  useEffect(() => {
    const isAlreadyCurrent = pathname === stack.current[cursor.current];

    if (isAlreadyCurrent) return;

    stack.current = [...stack.current.slice(0, cursor.current + 1), pathname];
    cursor.current = stack.current.length - 1;

    setNavState(computeNavState(cursor.current, stack.current.length));
  }, [pathname]);

  return navState;
};
