import { siteJsonLd } from './json-ld';

export const JsonLdScript = () => (
  <script
    type="application/ld+json"
    // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires raw insertion
    dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
  />
);
