import { Inter, JetBrains_Mono } from 'next/font/google';
import { JsonLdScript } from '@/shared/seo';
import { Providers } from './providers';
import type { ReactNode } from 'react';

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
      <Providers>{children}</Providers>
    </body>
  </html>
);

export default RootLayout;
