import { SITE } from '@/shared/config';

export const siteJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE.url}/#website`,
      url: SITE.url,
      name: SITE.name,
      description: SITE.description,
      inLanguage: SITE.lang,
      publisher: { '@id': `${SITE.url}/#author` },
    },
    {
      '@type': 'Person',
      '@id': `${SITE.url}/#author`,
      name: 'Alexandr Artemev',
      url: SITE.url,
    },
    {
      '@type': 'SoftwareApplication',
      '@id': `${SITE.url}/#app`,
      name: SITE.name,
      url: SITE.url,
      description: SITE.description,
      applicationCategory: 'CommunicationApplication',
      operatingSystem: 'Web, Windows, macOS, Linux',
      author: { '@id': `${SITE.url}/#author` },
      creator: { '@id': `${SITE.url}/#author` },
      publisher: { '@id': `${SITE.url}/#author` },
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      featureList: [
        'Real-time voice rooms',
        'Real-time video rooms',
        'Password-protected private rooms',
        'Google and email sign-in',
        'Native desktop app',
        'Self-hostable',
      ],
    },
  ],
} as const;
