'use client';

import type { ReactNode } from 'react';

import { useMount } from '@siberiacancode/reactuse';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { bootstrapAuth, useAuthStore } from '@/entities/user';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const BootSplash = () => (
  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
    Loading...
  </div>
);

export const Providers = ({ children }: { children: ReactNode }) => {
  const isLoading = useAuthStore((s) => s.isLoading);

  useMount(() => {
    bootstrapAuth();
  });

  return (
    <QueryClientProvider client={queryClient}>
      {isLoading ? <BootSplash /> : children}
      {process.env.NODE_ENV === 'development' ? (
        <ReactQueryDevtools buttonPosition="bottom-right" />
      ) : null}
    </QueryClientProvider>
  );
};
