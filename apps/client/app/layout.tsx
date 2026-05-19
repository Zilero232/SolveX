import type { ReactNode } from 'react';

import { JsonLdScript } from '@/shared/seo';
import { Toaster, TooltipProvider } from '@/shared/ui';

import { Providers } from './providers';

import '@livekit/components-styles';

import './globals.css';

export { defaultMetadata as metadata, defaultViewport as viewport } from '@/shared/seo';

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html suppressHydrationWarning className="dark" lang="en">
    <head>
      <JsonLdScript />
    </head>
    <body>
      <Providers>
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster />
      </Providers>
    </body>
  </html>
);

export default RootLayout;
