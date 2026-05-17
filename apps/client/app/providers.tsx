'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { ReactNode } from 'react';
import { useEffect } from 'react';

import { subscribeAuth, useCurrentUser } from '@/entities/user';
import { queryClient } from '@/shared/api';

const BootSplash = () => (
  <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
    Loading...
  </div>
);

const AuthBootstrap = ({ children }: { children: ReactNode }) => {
  const { isLoading } = useCurrentUser();

  useEffect(() => {
    return subscribeAuth();
  }, []);

  return isLoading ? <BootSplash /> : children;
};

export const Providers = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <AuthBootstrap>{children}</AuthBootstrap>
    {process.env.NODE_ENV === 'development' && <ReactQueryDevtools buttonPosition="bottom-right" />}
  </QueryClientProvider>
);
