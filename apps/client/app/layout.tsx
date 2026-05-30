import { Inter, JetBrains_Mono } from 'next/font/google';
import { JsonLdScript } from '@/shared/seo';
import { Toaster, TooltipProvider } from '@/shared/ui';
import { Providers } from './providers';
import type { ReactNode } from 'react';

import '@livekit/components-styles';

import './globals.css';

export { defaultMetadata as metadata, defaultViewport as viewport } from '@/shared/seo';

const sans = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html suppressHydrationWarning className={`dark ${sans.variable} ${mono.variable}`} lang="en">
    <head>
      <JsonLdScript />
    </head>
    <body className="font-sans">
      <Providers>
        <Toaster />
        <TooltipProvider>{children}</TooltipProvider>
      </Providers>
    </body>
  </html>
);

export default RootLayout;
