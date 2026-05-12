import './globals.css';
import '@livekit/components-styles';

import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { Toaster } from '@/shared/ui/sonner';
import { TooltipProvider } from '@/shared/ui/tooltip';

import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Solvex',
  description: 'Voice rooms',
};

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="en" className="dark" suppressHydrationWarning>
    <body>
      <Providers>
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster />
      </Providers>
    </body>
  </html>
);

export default RootLayout;
