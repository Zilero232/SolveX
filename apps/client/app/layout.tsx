import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { Toaster } from '@/shared/ui/sonner';
import { TooltipProvider } from '@/shared/ui/tooltip';

import { Providers } from './providers';

import '@livekit/components-styles';

import './globals.css';

export const metadata: Metadata = {
  title: 'Solvex',
  description: 'Voice rooms',
};

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html suppressHydrationWarning className="dark" lang="en">
    <body>
      <Providers>
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster />
      </Providers>
    </body>
  </html>
);

export default RootLayout;
